import { useState, useEffect } from "react";
import { getAdminStats } from "../../api/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 text-center py-20">Loading...</div>;

  const cards = [
    { label: "Total Users", value: stats?.total_users || 0, color: "from-blue-600 to-blue-800" },
    { label: "Total Teams", value: stats?.total_teams || 0, color: "from-green-600 to-green-800" },
    { label: "Total Submissions", value: stats?.total_submissions || 0, color: "from-purple-600 to-purple-800" },
    { label: "Pending Reviews", value: stats?.pending_submissions || 0, color: "from-yellow-600 to-yellow-800" },
    { label: "Modules", value: stats?.total_modules || 0, color: "from-red-600 to-red-800" },
  ];

  return (
    <div>
      <h1 className="font-bebas text-4xl text-white tracking-wider mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-5 border border-white/10`}>
            <p className="text-white/70 text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {stats?.module_counts && Object.keys(stats.module_counts).length > 0 && (
        <div>
          <h2 className="font-bebas text-2xl text-white tracking-wider mb-4">Module Registrations</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left px-4 py-3">Module</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Fee</th>
                  <th className="text-left px-4 py-3">Registrations</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.module_counts).map(([name, data]) => (
                  <tr key={name} className="border-b border-white/5 text-white hover:bg-white/5">
                    <td className="px-4 py-3">{name}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${data.status === "open" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {data.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">₹{data.fee}</td>
                    <td className="px-4 py-3">{data.registrations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}