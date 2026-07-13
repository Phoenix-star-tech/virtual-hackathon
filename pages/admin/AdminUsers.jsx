import { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser, toggleBanUser } from "../../api/admin";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { admin } = useAdminAuth();
  const isSuper = admin?.role === "super_admin";

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await getUsers({ page, per_page: 20, search });
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, [page, search]);

  async function handleEdit(id) {
    try {
      await updateUser(id, editData);
      setEditing(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleBan(id) {
    try {
      await toggleBanUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-white tracking-wider">Users</h1>
        <span className="text-gray-400 text-sm">{total} total</span>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 transition-colors text-sm"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="text-left px-4 py-3">Name / Team</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Module</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center text-gray-500 py-8">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-gray-500 py-8">No users found</td></tr>
            ) : users.map((u) => (
              <tr
                key={u.id}
                onClick={() => setSelectedTeam(u)}
                className="border-b border-white/5 text-white cursor-pointer hover:bg-white/10"
              >
                <td className="px-4 py-3">
                  <div className="font-medium">{u.full_name || "—"}</div>
                  {u.registration_type === "team" && u.team_name && (
                    <div className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      {u.team_name}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400">{u.email || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    u.registration_type === "team" ? "bg-purple-500/20 text-purple-400" :
                    u.registration_type === "solo" ? "bg-blue-500/20 text-blue-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {u.registration_type === "team" ? "Team" : u.registration_type === "solo" ? "Solo" : "Legacy"}
                  </span>
                </td>
                <td className="px-4 py-3">{u.module_status || u.domain || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${u.is_banned ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                    {u.is_banned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {isSuper && <button onClick={(e) => { e.stopPropagation(); handleDelete(u.id); }} className="text-red-400 hover:text-red-300 text-xs">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 hover:bg-white/10 text-sm">Prev</button>
          <span className="text-gray-400 text-sm">Page {page} of {Math.ceil(total / 20)}</span>
          <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 hover:bg-white/10 text-sm">Next</button>
        </div>
      )}

      {/* User / Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelectedTeam(null)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg mx-4 w-full relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
              selectedTeam.registration_type === "team"
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gradient-to-r from-blue-500 to-cyan-500"
            }`}></div>
            <button onClick={() => setSelectedTeam(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                selectedTeam.registration_type === "team"
                  ? "bg-purple-500/20 text-purple-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}>
                {selectedTeam.registration_type === "team" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedTeam.registration_type === "team" ? selectedTeam.team_name : selectedTeam.full_name || "User"}
                </h3>
                <span className="text-xs text-gray-400 capitalize">{selectedTeam.registration_type || "Legacy"} Registration</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 rounded-xl">
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Full Name</span>
                <span className="text-sm font-semibold text-white">{selectedTeam.full_name || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Email</span>
                <span className="text-sm font-semibold text-white break-all">{selectedTeam.email || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Phone</span>
                <span className="text-sm font-semibold text-white">{selectedTeam.phone || "—"}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">College</span>
                <span className="text-sm font-semibold text-white">{selectedTeam.college || "—"}</span>
              </div>
              {selectedTeam.domain && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Domain</span>
                  <span className="text-sm font-semibold text-white">{selectedTeam.domain}</span>
                </div>
              )}
              {selectedTeam.amount != null && (
                <div>
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Amount Paid</span>
                  <span className="text-sm font-semibold text-emerald-400">₹{selectedTeam.amount}</span>
                </div>
              )}
              {selectedTeam.transaction_id && (
                <div className="col-span-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold block">Transaction ID</span>
                  <span className="text-sm font-semibold text-white break-all">{selectedTeam.transaction_id}</span>
                </div>
              )}
            </div>

            {/* Team Members Section */}
            {selectedTeam.registration_type === "team" && (
              <>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Team Members ({1 + (selectedTeam.team_members?.length || 0)})
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold shrink-0">
                      {(selectedTeam.full_name || "L").charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-white block truncate">{selectedTeam.full_name}</span>
                      <span className="text-xs text-gray-400 block">{selectedTeam.email}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded">Leader</span>
                  </div>
                  {selectedTeam.team_members?.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold shrink-0">
                        {(m.full_name || "?").charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white block truncate">{m.full_name}</span>
                        <span className="text-xs text-gray-400 block">{m.email}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Member</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={() => setSelectedTeam(null)}
              className="w-full mt-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}