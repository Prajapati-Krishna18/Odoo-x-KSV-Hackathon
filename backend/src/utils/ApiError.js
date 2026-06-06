// ============================================
// Custom API Error Classes
// ============================================
// Why: Typed errors with HTTP status codes enable the global
// error handler to send correct responses without if/else chains.
// Extends native Error for proper stack traces.
// ============================================

class ApiError extends Error {
  constructor(statusCode, message, errors = [], isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad request', errors = []) {
    super(400, message, errors);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden — insufficient permissions') {
    super(403, message);
  }
}

class NotFoundError extends ApiError {
  constructor(resource = 'Resource') {
    super(404, `${resource} not found`);
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

class ValidationError extends ApiError {
  constructor(errors = []) {
    super(422, 'Validation failed', errors);
  }
}

class TooManyRequestsError extends ApiError {
  constructor(message = 'Too many requests, please try again later') {
    super(429, message);
  }
}

class InternalError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message, [], false);
  }
}

module.exports = {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
  InternalError,
};
