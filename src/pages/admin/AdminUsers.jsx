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
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Module</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center text-gray-500 py-8">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-gray-500 py-8">No users found</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="border-b border-white/5 text-white hover:bg-white/5">
                {editing === u.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input value={editData.full_name || ""} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-4 py-2">
                      <input value={editData.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-4 py-2">{u.module_status || "—"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${u.is_banned ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                        {u.is_banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button onClick={() => handleEdit(u.id)} className="text-green-400 hover:text-green-300 text-xs">Save</button>
                      <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white text-xs">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{u.full_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">{u.module_status || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs ${u.is_banned ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                        {u.is_banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => { setEditing(u.id); setEditData({ full_name: u.full_name, email: u.email }); }} className="text-blue-400 hover:text-blue-300 text-xs">Edit</button>
                      {isSuper && <button onClick={() => handleBan(u.id)} className="text-yellow-400 hover:text-yellow-300 text-xs">{u.is_banned ? "Unban" : "Ban"}</button>}
                      {isSuper && <button onClick={() => handleDelete(u.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>}
                    </td>
                  </>
                )}
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
    </div>
  );
}