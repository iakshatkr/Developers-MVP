/**
 * metricsController.js
 * 
 * Request handler layer for metrics-related endpoints.
 * Handles HTTP requests for productivity metrics and performance data.
 * 
 * Pattern: Each handler accepts (req, res) and manages request/response lifecycle
 */

import {
  getMetricsForDeveloper,
  getLatestMetricsForDeveloper,
  getMetricsForMonth,
  getAverageSocreForDeveloper,
  getAggregatedMetrics
} from '../services/metricsService.js';

/**
 * Handler for GET /metrics/:developerId
 * Returns all metrics for a specific developer
 */
function getMetricsHandler(req, res) {
  try {
    const { developerId } = req.params;
    const metrics = getMetricsForDeveloper(developerId);
    
    // If no metrics found, still return 200 with empty array
    res.status(200).json({
      success: true,
      data: metrics,
      count: metrics.length,
      developerId: developerId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getMetricsHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve metrics',
      error: error.message
    });
  }
}

/**
 * Handler for GET /metrics/:developerId/latest
 * Returns the most recent metrics for a developer
 */
function getLatestMetricsHandler(req, res) {
  try {
    const { developerId } = req.params;
    const metrics = getLatestMetricsForDeveloper(developerId);
    
    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: `No metrics found for developer ${developerId}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: metrics,
      developerId: developerId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getLatestMetricsHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest metrics',
      error: error.message
    });
  }
}

/**
 * Handler for GET /metrics/:developerId/:month
 * Returns metrics for a specific developer in a specific month (YYYY-MM format)
 */
function getMetricsForMonthHandler(req, res) {
  try {
    const { developerId, month } = req.params;
    
    // Validate month format (YYYY-MM)
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        success: false,
        message: 'Month must be in YYYY-MM format (e.g., 2025-01)'
      });
    }
    
    const metrics = getMetricsForMonth(developerId, month);
    
    if (!metrics) {
      return res.status(404).json({
        success: false,
        message: `No metrics found for developer ${developerId} in month ${month}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: metrics,
      developerId: developerId,
      month: month,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getMetricsForMonthHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve metrics for month',
      error: error.message
    });
  }
}

/**
 * Handler for GET /metrics/:developerId/average-score
 * Returns average productivity score for a developer across all periods
 */
function getAverageScoreHandler(req, res) {
  try {
    const { developerId } = req.params;
    const averageScore = getAverageSocreForDeveloper(developerId);
    
    res.status(200).json({
      success: true,
      data: {
        developerId: developerId,
        averageProductivityScore: averageScore
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getAverageScoreHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve average score',
      error: error.message
    });
  }
}

/**
 * Handler for GET /metrics/aggregated/all
 * Returns aggregated statistics for all developers
 */
function getAggregatedMetricsHandler(req, res) {
  try {
    const aggregated = getAggregatedMetrics();
    
    res.status(200).json({
      success: true,
      data: aggregated,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getAggregatedMetricsHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve aggregated metrics',
      error: error.message
    });
  }
}

export {
  getMetricsHandler,
  getLatestMetricsHandler,
  getMetricsForMonthHandler,
  getAverageScoreHandler,
  getAggregatedMetricsHandler
};
