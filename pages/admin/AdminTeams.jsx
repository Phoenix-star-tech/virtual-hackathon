import { useState, useEffect } from "react";
import { getTeams, deleteTeam } from "../../api/admin";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { admin } = useAdminAuth();
  const isSuper = admin?.role === "super_admin";

  useEffect(() => {
    getTeams()
      .then((d) => setTeams(d.teams))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this team?")) return;
    try { await deleteTeam(id); setTeams(teams.filter((t) => t.id !== id)); } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-white tracking-wider">Teams</h1>
        <span className="text-gray-400 text-sm">{teams.length} teams</span>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : teams.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No teams</div>
        ) : teams.map((t) => (
          <div key={t.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <button onClick={() => setExpanded(expanded === t.id ? null : t.id)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors">
              <div>
                <span className="text-white font-medium">{t.name}</span>
                <span className="text-gray-500 text-sm ml-3">Module: {t.module_id?.slice(0, 8) || "—"}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">{t.members?.length || 0} members</span>
                <span className="text-gray-500">{expanded === t.id ? "▲" : "▼"}</span>
              </div>
            </button>
            {expanded === t.id && (
              <div className="px-5 pb-4 border-t border-white/5 pt-3">
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div><span className="text-gray-400">Team ID:</span> <span className="text-white">{t.id}</span></div>
                  <div><span className="text-gray-400">Created:</span> <span className="text-white">{new Date(t.created_at).toLocaleDateString()}</span></div>
                </div>
                {t.members?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs mb-2">Members</p>
                    {t.members.map((m) => (
                      <div key={m.user_id} className="flex items-center justify-between text-sm py-1">
                        <span className="text-white">{m.user_id}</span>
                        <span className={`text-xs ${m.role === "leader" ? "text-yellow-400" : "text-gray-400"}`}>{m.role}</span>
                      </div>
                    ))}
                  </div>
                )}
                {isSuper && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 text-xs">Delete Team</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}