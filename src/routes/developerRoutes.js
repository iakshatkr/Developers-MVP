/**
 * developerRoutes.js
 * 
 * Express router for developer-related endpoints.
 * Routes map HTTP requests to appropriate controller handlers.
 * 
 * Pattern: Routes are lightweight and only handle URL mapping,
 * delegating business logic to controllers and services
 */

import express from 'express';
import {
  getDevelopersHandler,
  getDeveloperByIdHandler,
  getDevelopersByTeamHandler,
  getActiveDeveloperCountHandler
} from '../controllers/developerController.js';

const router = express.Router();

/**
 * GET /developers
 * Retrieve all developers
 */
router.get('/', getDevelopersHandler);

/**
 * GET /developers/stats/active
 * Note: This must be before /:id route to avoid matching 'stats' as an ID
 * Retrieve count of active developers
 */
router.get('/stats/active', getActiveDeveloperCountHandler);

/**
 * GET /developers/team/:team
 * Retrieve developers filtered by team
 */
router.get('/team/:team', getDevelopersByTeamHandler);

/**
 * GET /developers/:id
 * Retrieve a specific developer by ID
 */
router.get('/:id', getDeveloperByIdHandler);

export default router;
