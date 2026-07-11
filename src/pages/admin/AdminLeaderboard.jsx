import { useState, useEffect } from "react";
import { getModules, getLeaderboard, updateLeaderboardEntry, toggleLeaderboardPublish, recalculateLeaderboard } from "../../api/admin";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminLeaderboard() {
  const [modules, setModules] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { admin } = useAdminAuth();
  const isSuper = admin?.role === "super_admin";

  useEffect(() => {
    getModules().then((d) => setModules(d.modules || [])).catch(console.error);
  }, []);

  async function fetchLeaderboard() {
    if (!selectedModule) return;
    setLoading(true);
    try {
      const data = await getLeaderboard(selectedModule);
      setEntries(data.leaderboard);
      setIsPublished(data.leaderboard[0]?.is_published || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLeaderboard(); }, [selectedModule]);

  async function handleTogglePublish() {
    try {
      const data = await toggleLeaderboardPublish(selectedModule);
      setIsPublished(data.is_published);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRecalculate() {
    if (!confirm("Recalculate scores from submissions?")) return;
    try {
      await recalculateLeaderboard(selectedModule);
      fetchLeaderboard();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleScoreUpdate(entryId, field, value) {
    try {
      await updateLeaderboardEntry(entryId, { [field]: Number(value) });
      fetchLeaderboard();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-white tracking-wider">Leaderboard</h1>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm">
          <option value="">Select a module</option>
          {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        {selectedModule && (
          <>
            <button onClick={handleTogglePublish} className={`px-4 py-2 rounded-lg text-sm border ${isPublished ? "bg-green-600/20 border-green-500/30 text-green-400" : "bg-white/5 border-white/10 text-gray-300"}`}>
              {isPublished ? "Published" : "Hidden"}
            </button>
            {isSuper && <button onClick={handleRecalculate} className="bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg text-sm">Recalculate</button>}
          </>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="text-left px-4 py-3">Rank</th>
              <th className="text-left px-4 py-3">Team</th>
              <th className="text-left px-4 py-3">Total Score</th>
              <th className="text-left px-4 py-3">Override</th>
              <th className="text-left px-4 py-3">Display</th>
            </tr>
          </thead>
          <tbody>
            {!selectedModule ? (
              <tr><td colSpan="5" className="text-center text-gray-500 py-8">Select a module</td></tr>
            ) : loading ? (
              <tr><td colSpan="5" className="text-center text-gray-500 py-8">Loading...</td></tr>
            ) : entries.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-gray-500 py-8">No entries</td></tr>
            ) : entries.map((e) => (
              <tr key={e.id} className="border-b border-white/5 text-white hover:bg-white/5">
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    e.rank === 1 ? "bg-yellow-500/20 text-yellow-400" :
                    e.rank === 2 ? "bg-gray-400/20 text-gray-300" :
                    e.rank === 3 ? "bg-orange-500/20 text-orange-400" :
                    "bg-white/5 text-gray-400"
                  }`}>{e.rank}</span>
                </td>
                <td className="px-4 py-3">{e.team_name || e.team_id?.slice(0, 8)}</td>
                <td className="px-4 py-3">{e.total_score || 0}</td>
                <td className="px-4 py-3">
                  {isSuper ? (
                    <input
                      type="number"
                      defaultValue={e.manual_override || ""}
                      onBlur={(ev) => { if (ev.target.value !== "") handleScoreUpdate(e.id, "manual_override", ev.target.value); }}
                      className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm"
                      placeholder="Auto"
                    />
                  ) : (
                    <span className="text-gray-400">{e.manual_override ?? "—"}</span>
                  )}
                </td>
                <td className="px-4 py-3 font-bold">{e.display_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}