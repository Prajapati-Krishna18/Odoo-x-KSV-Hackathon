// ============================================
// Auth Repository — Data Access Layer
// ============================================
// Why: All Prisma queries for auth live here. The service
// layer calls these methods. If we switch from Prisma to
// Knex tomorrow, ONLY this file changes.
// ============================================

const prisma = require('../../config/database');

class AuthRepository {
  static async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        phone: true,
        organization: true,
        role: true,
        reason: true,
        status: true,
        isApproved: true,
        onboardingCompleted: true,
        isActive: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        lastLoginAt: true,
        createdAt: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
  }

  static async findUserById(id) {
    return prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  static async createUser(data) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        organization: true,
        role: true,
        reason: true,
        status: true,
        isApproved: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });
  }

  static async updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async createRefreshToken(data) {
    return prisma.refreshToken.create({ data });
  }

  static async findRefreshToken(tokenHash) {
    return prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null },
      include: { user: true },
    });
  }

  static async revokeRefreshToken(id) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  static async revokeAllUserTokens(userId) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  static async assignDefaultRole(userId) {
    const viewerRole = await prisma.role.findUnique({
      where: { name: 'viewer' },
    });

    if (viewerRole) {
      await prisma.userRole.create({
        data: { userId, roleId: viewerRole.id },
      });
    }
  }

  static async assignRoleByName(userId, roleName) {
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (role) {
      await prisma.userRole.create({
        data: { userId, roleId: role.id },
      });
      return role;
    }
    return null;
  }

  static async findUserByResetToken(token) {
    return prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpiry: { gt: new Date() },
        deletedAt: null,
      },
    });
  }
}

module.exports = AuthRepository;
