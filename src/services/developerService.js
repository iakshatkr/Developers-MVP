/**
 * developerService.js
 * 
 * Business logic layer for developer-related operations.
 * Handles data retrieval, filtering, and transformation.
 * 
 * Architecture: Services contain the core business logic and data operations,
 * keeping controllers lightweight and focused on request handling.
 */

import { loadJsonData } from '../utils/dataLoader.js';

/**
 * Get all developers
 * @returns {Array} List of all developers
 */
function getAllDevelopers() {
  const developers = loadJsonData('developers.json');
  return developers;
}

/**
 * Get a specific developer by ID
 * @param {string} developerId - The ID of the developer
 * @returns {Object|null} Developer object or null if not found
 */
function getDeveloperById(developerId) {
  const developers = loadJsonData('developers.json');
  return developers.find(dev => dev.id === developerId) || null;
}

/**
 * Get developers by team
 * @param {string} team - The team name to filter by
 * @returns {Array} List of developers in the specified team
 */
function getDevelopersByTeam(team) {
  const developers = loadJsonData('developers.json');
  return developers.filter(dev => dev.team === team);
}

/**
 * Get count of active developers
 * @returns {number} Total count of active developers
 */
function getActiveDeveloperCount() {
  const developers = loadJsonData('developers.json');
  return developers.filter(dev => dev.status === 'active').length;
}

export {
  getAllDevelopers,
  getDeveloperById,
  getDevelopersByTeam,
  getActiveDeveloperCount
};
