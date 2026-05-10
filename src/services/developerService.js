import { loadJsonData } from '../utils/dataLoader.js';

function getAllDevelopers() {
  return loadJsonData('developers.json');
}

function getDeveloperById(developerId) {
  const developers = loadJsonData('developers.json');
  return developers.find((dev) => dev.developer_id === developerId) || null;
}

function getDevelopersByTeam(team) {
  const developers = loadJsonData('developers.json');
  return developers.filter((dev) => dev.team_name === team);
}

function getActiveDeveloperCount() {
  const developers = loadJsonData('developers.json');
  return developers.length;
}

export {
  getAllDevelopers,
  getDeveloperById,
  getDevelopersByTeam,
  getActiveDeveloperCount
};
