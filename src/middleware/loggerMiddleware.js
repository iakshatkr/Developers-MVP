/**
 * loggerMiddleware.js
 * 
 * Middleware for logging HTTP requests and responses.
 * Provides insights into API usage and helps with debugging.
 * 
 * Logs: HTTP method, URL, status code, response time, and timestamp
 */

/**
 * Logger middleware - logs all incoming requests and responses
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function loggerMiddleware(req, res, next) {
  // Record the request start time
  const requestStartTime = Date.now();
  
  // Store original send function
  const originalSend = res.send;
  
  // Override send to capture response
  res.send = function (data) {
    // Calculate response time in milliseconds
    const responseTime = Date.now() - requestStartTime;
    
    // Build log message with relevant information
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.path} - Status: ${res.statusCode} - Response Time: ${responseTime}ms`;
    
    // Log to console
    console.log(logMessage);
    
    // Call original send function
    return originalSend.call(this, data);
  };
  
  // Continue to next middleware
  next();
}

export { loggerMiddleware };
