/**
 * errorMiddleware.js
 * 
 * Middleware for handling errors across the application.
 * Catches unhandled errors and returns consistent error responses.
 * 
 * Best Practice: Error middleware should be registered last, after all other middleware and routes
 */

/**
 * Error handling middleware - catches and formats errors
 * Note: Express requires exactly 4 parameters (err, req, res, next) to recognize this as error middleware
 * 
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function errorMiddleware(err, req, res, next) {
  // Log the error for debugging purposes
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  // Determine status code (default to 500 Internal Server Error)
  const statusCode = err.statusCode || 500;
  
  // Send error response with consistent format
  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err : {},
    timestamp: new Date().toISOString()
  });
}

/**
 * 404 Not Found middleware - handles requests to non-existent routes
 * Should be registered after all other routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function notFoundMiddleware(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
}

export { errorMiddleware, notFoundMiddleware };
