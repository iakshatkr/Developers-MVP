import { loadJsonData } from '../utils/dataLoader.js';

const round1 = (n) => Math.round(n * 10) / 10;

function getMetricsForDeveloper(developerId) {
  const jiraIssues = loadJsonData('jiraIssues.json').filter((r) => r.developer_id === developerId);
  const pullRequests = loadJsonData('pullRequests.json').filter((r) => r.developer_id === developerId && r.status === 'merged');
  const deployments = loadJsonData('deployments.json').filter((r) => r.developer_id === developerId && r.status === 'success');
  const bugReports = loadJsonData('bugReports.json').filter((r) => r.developer_id === developerId && r.escaped_to_prod === 'Yes');

  const months = new Set([
    ...jiraIssues.map((r) => r.month_done),
    ...pullRequests.map((r) => r.month_merged),
    ...deployments.map((r) => r.month_deployed),
    ...bugReports.map((r) => r.month_found)
  ]);

  return [...months].sort().map((month) => buildMetricRow(developerId, month));
}

function buildMetricRow(developerId, month) {
  const developers = loadJsonData('developers.json');
  const jiraIssues = loadJsonData('jiraIssues.json');
  const pullRequests = loadJsonData('pullRequests.json');
  const deployments = loadJsonData('deployments.json');
  const bugReports = loadJsonData('bugReports.json');

  const dev = developers.find((d) => d.developer_id === developerId);
  const issues = jiraIssues.filter((r) => r.developer_id === developerId && r.month_done === month && r.status === 'Done');
  const prs = pullRequests.filter((r) => r.developer_id === developerId && r.month_merged === month && r.status === 'merged');
  const deps = deployments.filter((r) => r.developer_id === developerId && r.month_deployed === month && r.status === 'success');
  const bugs = bugReports.filter((r) => r.developer_id === developerId && r.month_found === month && r.escaped_to_prod === 'Yes');

  const cycleTime = issues.length ? round1(issues.reduce((s, r) => s + Number(r.cycle_time_days), 0) / issues.length) : 0;
  const leadTime = deps.length ? round1(deps.reduce((s, r) => s + Number(r.lead_time_days), 0) / deps.length) : 0;
  const prThroughput = prs.length;
  const deploymentFrequency = deps.length;
  const bugRate = issues.length ? round1(bugs.length / issues.length) : 0;

  const interpretation = getInterpretation({ cycleTime, leadTime, prThroughput, deploymentFrequency, bugRate });
  const recommendations = getRecommendations({ cycleTime, leadTime, prThroughput, deploymentFrequency, bugRate });

  return {
    developer_id: developerId,
    month,
    developer_name: dev?.developer_name,
    manager_id: dev?.manager_id,
    team_name: dev?.team_name,
    issues_done: issues.length,
    merged_prs: prThroughput,
    prod_deployments: deploymentFrequency,
    escaped_bugs: bugs.length,
    avg_cycle_time_days: cycleTime,
    avg_lead_time_days: leadTime,
    bug_rate: bugRate,
    interpretation,
    recommendations,
    dev_month_key: `${developerId}|${month}`
  };
}

function getLatestMetricsForDeveloper(developerId) {
  const rows = getMetricsForDeveloper(developerId);
  return rows.length ? rows[rows.length - 1] : null;
}

function getMetricsForMonth(developerId, month) {
  return buildMetricRow(developerId, month);
}

function getAverageSocreForDeveloper(developerId) {
  const rows = getMetricsForDeveloper(developerId);
  if (!rows.length) return 0;
  const avg = rows.reduce((s, r) => s + (100 - r.avg_cycle_time_days * 5 - r.bug_rate * 50), 0) / rows.length;
  return Math.max(0, Math.round(avg));
}

function getAggregatedMetrics() {
  const developers = loadJsonData('developers.json');
  const metricRows = developers.flatMap((d) => getMetricsForDeveloper(d.developer_id));

  return {
    totalMetrics: metricRows.length,
    averageCycleTime: metricRows.length ? round1(metricRows.reduce((s, r) => s + r.avg_cycle_time_days, 0) / metricRows.length) : 0,
    averageLeadTimeForChanges: metricRows.length ? round1(metricRows.reduce((s, r) => s + r.avg_lead_time_days, 0) / metricRows.length) : 0,
    totalMergedPrs: metricRows.reduce((s, r) => s + r.merged_prs, 0),
    totalSuccessfulDeployments: metricRows.reduce((s, r) => s + r.prod_deployments, 0),
    averageBugRate: metricRows.length ? round1(metricRows.reduce((s, r) => s + r.bug_rate, 0) / metricRows.length) : 0
  };
}

function getInterpretation({ cycleTime, leadTime, bugRate }) {
  if (bugRate >= 0.5) return 'Quality watch';
  if (cycleTime > 5 || leadTime > 4) return 'Slow review cycle';
  if (leadTime <= 2.5) return 'High deployment efficiency';
  return 'Healthy flow';
}

function getRecommendations({ cycleTime, leadTime, bugRate }) {
  const items = [];
  if (cycleTime > 5) items.push('Reduce PR size');
  if (bugRate >= 0.5) items.push('Improve test coverage');
  if (leadTime > 4) items.push('Reduce review wait time');
  if (leadTime > 3) items.push('Increase deployment cadence');
  return items.length ? items : ['Maintain current execution rhythm'];
}

export { getMetricsForDeveloper, getLatestMetricsForDeveloper, getMetricsForMonth, getAverageSocreForDeveloper, getAggregatedMetrics };
