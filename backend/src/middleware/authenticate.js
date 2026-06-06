// ============================================
// JWT Authentication Middleware
// ============================================
// Why: Every protected route needs token verification.
// This middleware extracts the Bearer token, verifies it,
// fetches the user from DB, and attaches to req.user.
// Rejects expired/invalid tokens with 401.
// ============================================

const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { UnauthorizedError } = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  // 1. Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Access token required');
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Access token expired');
    }
    throw new UnauthorizedError('Invalid access token');
  }

  // 3. Fetch user with roles and permissions
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId, deletedAt: null },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      isActive: true,
      userRoles: {
        select: {
          role: {
            select: {
              id: true,
              name: true,
              rolePermissions: {
                select: {
                  permission: {
                    select: {
                      module: true,
                      action: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedError('User account is inactive or not found');
  }

  // 4. Flatten permissions into a simple array: ["rfq.create", "vendor.read", ...]
  const permissions = new Set();
  const roles = [];

  user.userRoles.forEach(({ role }) => {
    roles.push(role.name);
    role.rolePermissions.forEach(({ permission }) => {
      permissions.add(`${permission.module}.${permission.action}`);
    });
  });

  // 5. Attach to request
  req.user = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles,
    permissions: Array.from(permissions),
  };

  next();
});

module.exports = authenticate;
