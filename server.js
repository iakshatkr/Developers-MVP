/**
 * server.js
 * 
 * Main application entry point for the Developer Productivity MVP backend.
 * 
 * Architecture Overview:
 * ┌─────────────────────────────────────┐
 * │      Express Application            │
 * │  (server.js - this file)            │
 * └──────────────┬──────────────────────┘
 *                │
 *    ┌───────────┼───────────┐
 *    │                       │
 * Routes                  Middleware
 * (src/routes/)         (src/middleware/)
 *    │                       │
 * Controllers          Error Handling
 * (src/controllers/)   Response Logging
 *    │
 * Services
 * (src/services/)
 *    │
 * Utilities & Data
 * (src/utils/ & src/data/)
 * 
 * Benefits of this structure:
 * - Separation of concerns: Each layer has a single responsibility
 * - Testability: Each layer can be tested independently
 * - Maintainability: Easy to locate and modify code
 * - Scalability: Simple to add new features without affecting existing code
 */

import express from 'express';
import cors from 'cors';
import { loggerMiddleware } from './src/middleware/loggerMiddleware.js';
import { errorMiddleware, notFoundMiddleware } from './src/middleware/errorMiddleware.js';
import developerRoutes from './src/routes/developerRoutes.js';
import metricsRoutes from './src/routes/metricsRoutes.js';

// ============================================
// Configuration
// ============================================

const PORT = process.env.PORT || 3000;
const app = express();

// ============================================
// Global Middleware (applies to all routes)
// ============================================

// Enable CORS - allows requests from different origins
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Custom logging middleware
app.use(loggerMiddleware);

// ============================================
// Health Check Endpoint
// ============================================

/**
 * Simple health check endpoint
 * Useful for monitoring if the API is running
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Developer Productivity MVP API is running',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// API Routes
// ============================================

/**
 * Developer endpoints
 * Base path: /developers
 * Routes:
 *   GET /developers - all developers
 *   GET /developers/:id - specific developer
 *   GET /developers/team/:team - by team
 *   GET /developers/stats/active - active count
 */
app.use('/developers', developerRoutes);

/**
 * Metrics endpoints
 * Base path: /metrics
 * Routes:
 *   GET /metrics/:developerId - all metrics
 *   GET /metrics/:developerId/latest - latest metrics
 *   GET /metrics/:developerId/:month - by month
 *   GET /metrics/:developerId/average-score - average score
 *   GET /metrics/aggregated/all - aggregated data
 */
app.use('/metrics', metricsRoutes);

// ============================================
// Error Handling Middleware
// ============================================

// 404 Not Found middleware (must be after all routes)
app.use(notFoundMiddleware);

// Global error handling middleware (must be last)
app.use(errorMiddleware);

// ============================================
// Server Startup
// ============================================

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log('═════════════════════════════════════════════════');
  console.log('Developer Productivity MVP - Backend Server');
  console.log('═════════════════════════════════════════════════');
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('Available Endpoints:');
  console.log('├─ GET  /developers');
  console.log('├─ GET  /developers/:id');
  console.log('├─ GET  /developers/team/:team');
  console.log('├─ GET  /developers/stats/active');
  console.log('├─ GET  /metrics/:developerId');
  console.log('├─ GET  /metrics/:developerId/latest');
  console.log('├─ GET  /metrics/:developerId/:month');
  console.log('├─ GET  /metrics/:developerId/average-score');
  console.log('└─ GET  /metrics/aggregated/all');
  console.log('═════════════════════════════════════════════════');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

export default app;
