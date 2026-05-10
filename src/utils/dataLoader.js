/**
 * dataLoader.js
 * 
 * Utility module to load mock JSON data files.
 * This replaces database queries in a production environment.
 * 
 * Purpose: Centralize data loading logic for easy switching to a real database later
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory path (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load JSON data from the data folder
 * @param {string} filename - Name of the JSON file to load (e.g., 'developers.json')
 * @returns {Array} Parsed JSON data
 */
function loadJsonData(filename) {
  try {
    const filePath = join(__dirname, '../data', filename);
    const rawData = readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error.message);
    return [];
  }
}

export { loadJsonData };
