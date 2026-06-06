// ============================================
// Async Handler Wrapper
// ============================================
// Why: Express 5 handles async errors natively, but this wrapper
// provides an explicit safety net and keeps controller code clean.
// Without it, every controller needs try/catch boilerplate.
// ============================================

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
