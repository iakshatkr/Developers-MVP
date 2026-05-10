/**
 * metricsRoutes.js
 * 
 * Express router for metrics-related endpoints.
 * Handles routing for productivity metrics and performance data endpoints.
 * 
 * Route ordering: More specific routes should come before generic ones
 */

import express from 'express';
import {
  getMetricsHandler,
  getLatestMetricsHandler,
  getMetricsForMonthHandler,
  getAverageScoreHandler,
  getAggregatedMetricsHandler
} from '../controllers/metricsController.js';

const router = express.Router();

/**
 * GET /metrics/aggregated/all
 * Retrieve aggregated metrics for all developers
 * Must come before /:developerId route to avoid matching 'aggregated' as developerId
 */
router.get('/aggregated/all', getAggregatedMetricsHandler);

/**
 * GET /metrics/:developerId/latest
 * Retrieve latest metrics for a specific developer
 * Must come before /:developerId/:month to avoid ambiguity
 */
router.get('/:developerId/latest', getLatestMetricsHandler);

/**
 * GET /metrics/:developerId/average-score
 * Retrieve average productivity score for a developer
 */
router.get('/:developerId/average-score', getAverageScoreHandler);

/**
 * GET /metrics/:developerId/:month
 * Retrieve metrics for a specific developer in a specific month (YYYY-MM)
 * Example: GET /metrics/DEV001/2025-01
 */
router.get('/:developerId/:month', getMetricsForMonthHandler);

/**
 * GET /metrics/:developerId
 * Retrieve all metrics for a specific developer
 */
router.get('/:developerId', getMetricsHandler);

export default router;
