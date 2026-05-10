/**
 * metricsService.js
 * 
 * Business logic layer for metrics-related operations.
 * Handles metric retrieval, aggregation, and calculations.
 * 
 * Purpose: Separate metrics logic from controllers to maintain clean separation of concerns
 */

import { loadJsonData } from '../utils/dataLoader.js';

/**
 * Get all metrics for a specific developer
 * @param {string} developerId - The ID of the developer
 * @returns {Array} List of metrics for the developer
 */
function getMetricsForDeveloper(developerId) {
  const metrics = loadJsonData('metrics.json');
  return metrics.filter(metric => metric.developerId === developerId);
}

/**
 * Get the latest metrics for a developer (most recent month)
 * @param {string} developerId - The ID of the developer
 * @returns {Object|null} Latest metrics object or null if not found
 */
function getLatestMetricsForDeveloper(developerId) {
  const metrics = getMetricsForDeveloper(developerId);
  
  if (metrics.length === 0) {
    return null;
  }
  
  // Sort by month in descending order and get the first one
  return metrics.sort((a, b) => b.month.localeCompare(a.month))[0];
}

/**
 * Get metrics for a specific developer and month
 * @param {string} developerId - The ID of the developer
 * @param {string} month - The month in YYYY-MM format
 * @returns {Object|null} Metrics object or null if not found
 */
function getMetricsForMonth(developerId, month) {
  const metrics = loadJsonData('metrics.json');
  return metrics.find(
    metric => metric.developerId === developerId && metric.month === month
  ) || null;
}

/**
 * Get average productivity score for a developer across all periods
 * @param {string} developerId - The ID of the developer
 * @returns {number} Average productivity score
 */
function getAverageSocreForDeveloper(developerId) {
  const metrics = getMetricsForDeveloper(developerId);
  
  if (metrics.length === 0) {
    return 0;
  }
  
  const totalScore = metrics.reduce((sum, metric) => sum + metric.productivityScore, 0);
  return Math.round(totalScore / metrics.length);
}

/**
 * Get aggregated metrics statistics for all developers
 * @returns {Object} Statistics including average scores and totals
 */
function getAggregatedMetrics() {
  const metrics = loadJsonData('metrics.json');
  
  if (metrics.length === 0) {
    return {
      totalMetrics: 0,
      averageProductivityScore: 0,
      averageTAsksCompleted: 0
    };
  }
  
  const averageScore = Math.round(
    metrics.reduce((sum, m) => sum + m.productivityScore, 0) / metrics.length
  );
  
  const averageTasks = Math.round(
    metrics.reduce((sum, m) => sum + m.tasksCompleted, 0) / metrics.length
  );
  
  return {
    totalMetrics: metrics.length,
    averageProductivityScore: averageScore,
    averageTAsksCompleted: averageTasks
  };
}

export {
  getMetricsForDeveloper,
  getLatestMetricsForDeveloper,
  getMetricsForMonth,
  getAverageSocreForDeveloper,
  getAggregatedMetrics
};
