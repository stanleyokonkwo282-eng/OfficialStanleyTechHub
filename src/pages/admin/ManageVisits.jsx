import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import LoaderSpinner from '../../components/common/LoaderSpinner';
import useAxiosSecure from '../../hooks/useAxiosSecure';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ManageVisits() {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ['visits-stats'],
    queryFn: async () => {
      const res = await axiosSecure.get('/visits/stats');
      return res.data;
    },
  });

  if (isLoading) return <LoaderSpinner />;

  const { stats, pageViews, visitsPerDay, recentVisits } = data;

  const chartLabels = visitsPerDay.map(d => d._id);
  const chartCounts = visitsPerDay.map(d => d.count);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Visits per day',
        data: chartCounts,
        borderColor: '#facc15',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#27272a' } },
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#27272a' } },
    },
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">Visitor Analytics</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Visits</p>
          <p className="text-4xl font-bold text-white">{stats.totalVisits}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Unique Visitors (by session)</p>
          <p className="text-4xl font-bold text-white">{stats.uniqueVisitors}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <p className="text-gray-400 text-sm">Visits Today</p>
          <p className="text-4xl font-bold text-white">{stats.visitsToday}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Last 30 Days</h2>
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Most visited pages */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-white">Most Visited Pages</h2>
        <div className="space-y-2">
          {pageViews.map(p => (
            <div key={p._id} className="flex justify-between border-b border-zinc-800 py-2">
              <span className="text-gray-300">{p._id === '/' ? 'Homepage' : p._id}</span>
              <span className="text-yellow-400 font-bold">{p.count} views</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent visits table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Recent Visits</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-800">
              <tr className="text-left text-gray-400">
                <th className="pb-2 pr-4">Time</th>
                <th className="pb-2 pr-4">Page</th>
                <th className="pb-2 pr-4">IP</th>
                <th className="pb-2">Device</th>
              </tr>
            </thead>
            <tbody>
              {recentVisits.map(visit => (
                <tr key={visit._id} className="border-b border-zinc-800/50">
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {new Date(visit.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 pr-4">{visit.page === '/' ? 'Homepage' : visit.page}</td>
                  <td className="py-2 pr-4">{visit.ip || 'unknown'}</td>
                  <td className="py-2 truncate max-w-xs text-gray-400">
                    {visit.userAgent ? visit.userAgent.substring(0, 60) : 'unknown'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}