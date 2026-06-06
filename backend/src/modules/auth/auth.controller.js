// ============================================
// Auth Controller — HTTP Adapter Layer
// ============================================
// Why: Thin controllers. Parse request → call service → send response.
// No business logic here. No database calls. Just HTTP concerns.
// ============================================

const AuthService = require('./auth.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const result = await AuthService.register(req.body);
    ApiResponse.success(res, {
      data: {
        token: result.accessToken,
        refreshToken: result.refreshToken,
        isNewUser: result.isNewUser,
        user: result.user,
      },
      message: result.isNewUser
        ? 'Welcome! Your account has been created successfully.'
        : 'Welcome back! You have been logged in.',
      statusCode: 201,
    });
  });

  /**
   * POST /api/v1/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const result = await AuthService.login({
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });
    ApiResponse.success(res, {
      data: result,
      message: 'Login successful',
    });
  });

  /**
   * POST /api/v1/auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }
    ApiResponse.success(res, { message: 'Logged out successfully' });
  });

  /**
   * POST /api/v1/auth/refresh-token
   */
  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshAccessToken(refreshToken);
    ApiResponse.success(res, {
      data: tokens,
      message: 'Token refreshed',
    });
  });

  /**
   * POST /api/v1/auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (req, res) => {
    await AuthService.forgotPassword(req.body.email);
    // Always return success (don't reveal if email exists)
    ApiResponse.success(res, {
      message: 'If the email is registered, a reset link has been sent',
    });
  });

  /**
   * POST /api/v1/auth/reset-password
   */
  static resetPassword = asyncHandler(async (req, res) => {
    await AuthService.resetPassword(req.body.token, req.body.password);
    ApiResponse.success(res, {
      message: 'Password reset successful. Please login with your new password.',
    });
  });

  /**
   * PUT /api/v1/auth/onboarding
   */
  static completeOnboarding = asyncHandler(async (req, res) => {
    await AuthService.completeOnboarding(req.user.id);
    ApiResponse.success(res, {
      message: 'Onboarding completed successfully',
    });
  });

  /**
   * PUT /api/v1/auth/change-password
   */
  static changePassword = asyncHandler(async (req, res) => {
    await AuthService.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );
    ApiResponse.success(res, {
      message: 'Password changed successfully',
    });
  });
}

module.exports = AuthController;
