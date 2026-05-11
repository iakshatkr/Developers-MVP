import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:3000';

function formatMetric(value, suffix = '') {
  if (value === null || value === undefined) return '-';
  return `${value}${suffix}`;
}

function KpiCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

export default function App() {
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loadingDevelopers, setLoadingDevelopers] = useState(true);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDevelopers = async () => {
      try {
        setError('');
        const res = await fetch(`${API_BASE}/developers`);
        if (!res.ok) throw new Error('Failed to load developers');
        const body = await res.json();
        const list = body.data || [];
        setDevelopers(list);
        if (list.length > 0) setSelectedDeveloper(list[0].developer_id);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingDevelopers(false);
      }
    };

    loadDevelopers();
  }, []);

  useEffect(() => {
    if (!selectedDeveloper) return;

    const loadMetrics = async () => {
      try {
        setLoadingMetrics(true);
        setError('');
        const res = await fetch(`${API_BASE}/metrics/${selectedDeveloper}/latest`);
        if (!res.ok) throw new Error('Failed to load metrics');
        const body = await res.json();
        setMetrics(body.data || null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingMetrics(false);
      }
    };

    loadMetrics();
  }, [selectedDeveloper]);

  const selectedDeveloperDetails = useMemo(
    () => developers.find((d) => d.developer_id === selectedDeveloper),
    [developers, selectedDeveloper]
  );

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-2xl bg-slate-900 p-6 text-white shadow-lg">
          <h1 className="text-2xl font-semibold md:text-3xl">Developer Productivity Dashboard</h1>
          <p className="mt-2 text-sm text-slate-200">Individual Contributor view: understand your metrics and what to do next.</p>
        </header>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="developer-select">Developer</label>
          <select
            id="developer-select"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            value={selectedDeveloper}
            onChange={(e) => setSelectedDeveloper(e.target.value)}
            disabled={loadingDevelopers}
          >
            {developers.map((dev) => (
              <option key={dev.developer_id} value={dev.developer_id}>
                {dev.developer_name} ({dev.developer_id})
              </option>
            ))}
          </select>
          {selectedDeveloperDetails && (
            <p className="mt-2 text-xs text-slate-500">
              Team: {selectedDeveloperDetails.team_name} | Manager: {selectedDeveloperDetails.manager_name}
            </p>
          )}
        </section>

        {(loadingDevelopers || loadingMetrics) && <p className="mb-4 text-sm text-slate-600">Loading dashboard data...</p>}
        {error && <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        {metrics && !loadingMetrics && !error && (
          <>
            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <KpiCard title="Lead Time for Changes" value={formatMetric(metrics.avg_lead_time_days, ' days')} hint="Average deployment lead time" />
              <KpiCard title="Cycle Time" value={formatMetric(metrics.avg_cycle_time_days, ' days')} hint="Issue in-progress to done" />
              <KpiCard title="Bug Rate" value={formatMetric((metrics.bug_rate * 100).toFixed(1), '%')} hint="Escaped bugs / issues done" />
              <KpiCard title="Deployment Frequency" value={formatMetric(metrics.prod_deployments)} hint="Successful prod deployments" />
              <KpiCard title="PR Throughput" value={formatMetric(metrics.merged_prs)} hint="Merged pull requests" />
            </section>

            <section className="mb-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Interpretation</h2>
                <p className="mt-3 text-sm text-slate-700">{metrics.interpretation || 'No interpretation available.'}</p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Recommendations</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {(metrics.recommendations || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
