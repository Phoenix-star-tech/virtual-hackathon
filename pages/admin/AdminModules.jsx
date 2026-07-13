import { useState, useEffect } from "react";
import { getModules, createModule, updateModule, deleteModule, toggleModuleStatus } from "../../api/admin";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminModules() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const { admin } = useAdminAuth();
  const isSuper = admin?.role === "super_admin";

  async function fetchModules() {
    setLoading(true);
    try {
      const data = await getModules();
      setModules(data.modules);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchModules(); }, []);

  function resetForm() {
    setForm({ name: "" });
    setEditing(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = { name: form.name, description: "", registration_fee: 0, start_date: null, end_date: null, status: "open", order_index: modules.length + 1 };
      if (editing) {
        await updateModule(editing, payload);
      } else {
        await createModule(payload);
      }
      resetForm();
      fetchModules();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleEdit(m) {
    setEditing(m);
    setForm({ name: m.name || "" });
    setShowForm(true);
  }

  async function handleToggleStatus(id) {
    try {
      await toggleModuleStatus(id);
      fetchModules();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this module?")) return;
    try {
      await deleteModule(id);
      fetchModules();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-white tracking-wider">Modules</h1>
        {isSuper && <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Add Module</button>}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-1">Module Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Module 1" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" required />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={resetForm} className="bg-white/5 border border-white/10 text-gray-300 px-6 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-gray-400">
              <th className="text-left px-4 py-3">#</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="text-center text-gray-500 py-8">Loading...</td></tr>
            ) : modules.length === 0 ? (
              <tr><td colSpan="4" className="text-center text-gray-500 py-8">No modules</td></tr>
            ) : modules.map((m) => (
              <tr key={m.id} className="border-b border-white/5 text-white hover:bg-white/5">
                <td className="px-4 py-3">{m.order_index}</td>
                <td className="px-4 py-3 font-medium">{m.name}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleToggleStatus(m.id)} className={`px-2 py-0.5 rounded text-xs font-semibold ${m.status === "open" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{m.status}</button>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {isSuper && <button onClick={() => handleEdit(m)} className="text-blue-400 hover:text-blue-300 text-xs">Rename</button>}
                  {isSuper && <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}