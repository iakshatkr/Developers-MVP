/**
 * developerController.js
 * 
 * Request handler layer for developer-related endpoints.
 * Controllers are responsible for:
 * - Receiving HTTP requests
 * - Calling appropriate services
 * - Formatting and returning responses
 * 
 * Separation: Services handle business logic, controllers handle HTTP concerns
 */

import {
  getAllDevelopers,
  getDeveloperById,
  getDevelopersByTeam,
  getActiveDeveloperCount
} from '../services/developerService.js';

/**
 * Handler for GET /developers
 * Returns a list of all developers
 */
function getDevelopersHandler(req, res) {
  try {
    const developers = getAllDevelopers();
    
    // Return success response with developer data
    res.status(200).json({
      success: true,
      data: developers,
      count: developers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Handle errors gracefully
    console.error('Error in getDevelopersHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve developers',
      error: error.message
    });
  }
}

/**
 * Handler for GET /developers/:id
 * Returns a specific developer by ID
 */
function getDeveloperByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const developer = getDeveloperById(id);
    
    // Check if developer was found
    if (!developer) {
      return res.status(404).json({
        success: false,
        message: `Developer with ID ${id} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: developer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getDeveloperByIdHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve developer',
      error: error.message
    });
  }
}

/**
 * Handler for GET /developers/team/:team
 * Returns all developers in a specific team
 */
function getDevelopersByTeamHandler(req, res) {
  try {
    const { team } = req.params;
    const developers = getDevelopersByTeam(team);
    
    res.status(200).json({
      success: true,
      data: developers,
      count: developers.length,
      team: team,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getDevelopersByTeamHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve developers by team',
      error: error.message
    });
  }
}

/**
 * Handler for GET /developers/stats/active
 * Returns count of active developers
 */
function getActiveDeveloperCountHandler(req, res) {
  try {
    const count = getActiveDeveloperCount();
    
    res.status(200).json({
      success: true,
      data: {
        activeDeveloperCount: count
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getActiveDeveloperCountHandler:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active developer count',
      error: error.message
    });
  }
}

export {
  getDevelopersHandler,
  getDeveloperByIdHandler,
  getDevelopersByTeamHandler,
  getActiveDeveloperCountHandler
};
