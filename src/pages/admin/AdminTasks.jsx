import { useState, useEffect } from "react";
import { getModules, getTasks, createTask, updateTask, deleteTask } from "../../api/admin";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminTasks() {
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ module_id: "", title: "", description: "", type: "coding", points: 10, deadline: "", order_index: 0 });
  const { admin } = useAdminAuth();
  const isSuper = admin?.role === "super_admin";

  useEffect(() => {
    getModules().then((d) => setModules(d.modules)).catch(console.error);
  }, []);

  async function fetchTasks() {
    if (!selectedModule) return;
    setLoading(true);
    try {
      const data = await getTasks(selectedModule);
      setTasks(data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTasks(); }, [selectedModule]);

  function resetForm() {
    setForm({ module_id: selectedModule, title: "", description: "", type: "coding", points: 10, deadline: "", order_index: 0 });
    setEditing(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = { ...form, points: Number(form.points), order_index: Number(form.order_index) };
      if (editing) {
        await updateTask(editing.id, payload);
      } else {
        await createTask(payload);
      }
      resetForm();
      fetchTasks();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleEdit(t) {
    setEditing(t);
    setForm({
      module_id: t.module_id,
      title: t.title || "",
      description: t.description || "",
      type: t.type || "coding",
      points: t.points || 10,
      deadline: t.deadline ? t.deadline.slice(0, 16) : "",
      order_index: t.order_index || 0,
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this task?")) return;
    try { await deleteTask(id); fetchTasks(); } catch (err) { alert(err.message); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-white tracking-wider">Tasks</h1>
        {isSuper && selectedModule && <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">Add Task</button>}
      </div>

      <div className="mb-4">
        <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm">
          <option value="">Select a module</option>
          {modules.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" required />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm">
                <option value="coding">Coding</option>
                <option value="quiz">Quiz</option>
                <option value="subjective">Subjective</option>
                <option value="file">File Upload</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Points</label>
              <input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Deadline</label>
              <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Order</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" />
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
              <th className="text-left px-4 py-3">Order</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Type</th>
              <th className="text-left px-4 py-3">Points</th>
              <th className="text-left px-4 py-3">Deadline</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!selectedModule ? (
              <tr><td colSpan="6" className="text-center text-gray-500 py-8">Select a module</td></tr>
            ) : loading ? (
              <tr><td colSpan="6" className="text-center text-gray-500 py-8">Loading...</td></tr>
            ) : tasks.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-gray-500 py-8">No tasks</td></tr>
            ) : tasks.map((t) => (
              <tr key={t.id} className="border-b border-white/5 text-white hover:bg-white/5">
                <td className="px-4 py-3">{t.order_index}</td>
                <td className="px-4 py-3">{t.title}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{t.type}</td>
                <td className="px-4 py-3">{t.points}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{t.deadline ? new Date(t.deadline).toLocaleDateString() : "—"}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {isSuper && <button onClick={() => handleEdit(t)} className="text-blue-400 hover:text-blue-300 text-xs">Edit</button>}
                  {isSuper && <button onClick={() => handleDelete(t.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}