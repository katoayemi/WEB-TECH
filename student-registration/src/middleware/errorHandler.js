'use strict';

/**
 * Central async error wrapper — eliminates try/catch boilerplate in controllers.
 */
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

/**
 * Global error handler — must be registered LAST in Express.
 */
function errorHandler(err, req, res, _next) {
  const isDev = process.env.NODE_ENV !== 'production';

  // MySQL duplicate-entry error
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'A record with that value already exists.',
    });
  }

  console.error('[ERROR]', err);

  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : 'Internal server error.',
    ...(isDev && { stack: err.stack }),
  });
}

/**
 * 404 handler — must be registered BEFORE errorHandler.
 */
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
}

module.exports = { asyncHandler, errorHandler, notFound };
