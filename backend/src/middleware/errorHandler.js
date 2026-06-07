const logger = require('../config/logger');
const { ApiError } = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Prisma known errors
  if (err.code === 'P2002') {
    statusCode = 409;
    const field = err.meta?.target?.join(', ') || 'field';
    message = `Duplicate value for: ${field}`;
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Foreign key constraint failed';
  }

  // Prisma connection errors — NEVER leak raw DB errors to client
  if (
    err?.constructor?.name?.includes('Prisma') ||
    err.message?.includes('Can\'t reach database server') ||
    err.message?.includes('connect ECONNREFUSED') ||
    err.message?.includes('getaddrinfo ENOTFOUND') ||
    err.message?.includes('Connection timed out') ||
    err.message?.includes('prisma') ||
    ['P1001', 'P1002', 'P1003', 'P1009', 'P1010', 'P1011'].includes(err.code)
  ) {
    statusCode = 503;
    message = 'We are temporarily unable to process your request. Please try again later.';
    logger.error(`DATABASE CONNECTION FAILED: ${err.message}`, {
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`${statusCode} - ${err.message}`, {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id,
    });
  } else {
    logger.warn(`${statusCode} - ${message}`, {
      path: req.path,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
