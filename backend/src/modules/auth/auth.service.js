// ============================================
// Auth Service — Business Logic Layer
// ============================================
// Why: All authentication business logic lives here.
// Controllers call these methods. Services orchestrate
// repositories, hashing, token generation, and email.
// ============================================

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AuthRepository = require('./auth.repository');
const EmailService = require('../../services/email.service');
const AuditService = require('../../services/audit.service');
const {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} = require('../../utils/ApiError');

class AuthService {
  // ──────────── Register ────────────

  static async register({ email, firstName, lastName, organization, role, reason }) {
    // Check if user exists
    let user = await AuthRepository.findUserByEmail(email);
    let isNewUser = false;
    
    if (!user) {
      isNewUser = true;

      // Create user with new schema properties
      user = await AuthRepository.createUser({
        email,
        firstName,
        lastName,
        organization,
        reason,
        role,
        status: 'active',
        isApproved: true,
        onboardingCompleted: false,
      });

      // Link UserRole (map frontend role names to DB role names)
      const roleMap = {
        admin: 'admin',
        procurement: 'procurement_officer',
        manager: 'approver',
        vendor: 'vendor',
      };
      const dbRoleName = roleMap[role] || 'viewer';
      await AuthRepository.assignRoleByName(user.id, dbRoleName);

      // Log audit
      await AuditService.log({
        userId: user.id,
        tableName: 'users',
        recordId: user.id,
        action: 'INSERT',
        newValues: { email, firstName, lastName, role, organization },
      });

      // Refetch user with mapped roles/permissions for the login payload
      user = await AuthRepository.findUserByEmail(email);
    }

    // Now log the user in (generate tokens)
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await AuthRepository.createRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return {
      accessToken,
      refreshToken,
      isNewUser,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        role: user.role,
        reason: user.reason,
        status: user.status,
        isApproved: user.isApproved,
        onboardingCompleted: user.onboardingCompleted,
      },
    };
  }

  // ──────────── Login ────────────

  static async login({ email, password, ipAddress, userAgent }) {
    const user = await AuthRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Check account lock
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil - new Date()) / 60000);
      throw new UnauthorizedError(
        `Account locked. Try again in ${minutesLeft} minutes`
      );
    }

    // Verify password
    if (!user.passwordHash) {
      throw new UnauthorizedError('No password set. Please use "Forgot Password" to set one.');
    }
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      // Increment failed attempts
      const attempts = user.failedLoginAttempts + 1;
      const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
      const lockMinutes = parseInt(process.env.LOCK_TIME_MINUTES) || 30;

      const updateData = { failedLoginAttempts: attempts };

      if (attempts >= maxAttempts) {
        updateData.lockedUntil = new Date(Date.now() + lockMinutes * 60000);
      }

      await AuthRepository.updateUser(user.id, updateData);
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Reset failed attempts and update last login
    await AuthRepository.updateUser(user.id, {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    });

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    // Store hashed refresh token
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await AuthRepository.createRefreshToken({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent,
    });

    // Build roles/permissions for response
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = new Set();
    user.userRoles.forEach(({ role }) => {
      role.rolePermissions.forEach(({ permission }) => {
        permissions.add(`${permission.module}.${permission.action}`);
      });
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles,
        permissions: Array.from(permissions),
      },
    };
  }

  // ──────────── Logout ────────────

  static async logout(refreshToken) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const storedToken = await AuthRepository.findRefreshToken(tokenHash);
    if (storedToken) {
      await AuthRepository.revokeRefreshToken(storedToken.id);
    }
  }

  // ──────────── Refresh Token ────────────

  static async refreshAccessToken(refreshToken) {
    const tokenHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const storedToken = await AuthRepository.findRefreshToken(tokenHash);

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    // Rotate: revoke old, issue new
    await AuthRepository.revokeRefreshToken(storedToken.id);

    const newRefreshToken = this.generateRefreshToken();
    const newHash = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');

    await AuthRepository.createRefreshToken({
      userId: storedToken.userId,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const accessToken = this.generateAccessToken(storedToken.user);

    return { accessToken, refreshToken: newRefreshToken };
  }

  // ──────────── Forgot Password ────────────

  static async forgotPassword(email) {
    const user = await AuthRepository.findUserByEmail(email);

    // Don't reveal whether user exists
    if (!user) return;

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    await AuthRepository.updateUser(user.id, {
      passwordResetToken: hashedToken,
      passwordResetExpiry: new Date(
        Date.now() + (parseInt(process.env.PASSWORD_RESET_EXPIRY) || 3600000)
      ),
    });

    // Send email
    await EmailService.sendPasswordReset({
      to: user.email,
      name: user.firstName,
      resetToken,
    });
  }

  // ──────────── Reset Password ────────────

  static async resetPassword(token, newPassword) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await AuthRepository.findUserByResetToken(hashedToken);
    if (!user) {
      throw new BadRequestError('Invalid or expired reset token');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await AuthRepository.updateUser(user.id, {
      passwordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
      passwordChangedAt: new Date(),
    });

    // Revoke all refresh tokens for security
    await AuthRepository.revokeAllUserTokens(user.id);

    await AuditService.log({
      userId: user.id,
      tableName: 'users',
      recordId: user.id,
      action: 'UPDATE',
      newValues: { passwordReset: true },
    });
  }

  // ──────────── Complete Onboarding ────────────

  static async completeOnboarding(userId) {
    return AuthRepository.updateUser(userId, {
      onboardingCompleted: true,
    });
  }

  // ──────────── Change Password ────────────

  static async changePassword(userId, currentPassword, newPassword) {
    const user = await AuthRepository.findUserById(userId);
    if (!user) throw new NotFoundError('User');

    if (!user.passwordHash) {
      throw new BadRequestError('No password set. Please use "Forgot Password" to set one.');
    }
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    await AuthRepository.updateUser(userId, {
      passwordHash,
      passwordChangedAt: new Date(),
    });

    await AuditService.log({
      userId,
      tableName: 'users',
      recordId: userId,
      action: 'UPDATE',
      newValues: { passwordChanged: true },
    });
  }

  // ──────────── Token Helpers ────────────

  static generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
  }

  static generateRefreshToken() {
    return crypto.randomBytes(40).toString('hex');
  }
}

module.exports = AuthService;
