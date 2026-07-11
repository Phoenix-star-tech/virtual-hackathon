import { useState, useEffect } from "react";
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from "../../api/admin";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "info", priority: "normal", send_email: false });
  const { admin } = useAdminAuth();
  const isSuper = admin?.role === "super_admin";

  useEffect(() => {
    getAnnouncements()
      .then((d) => setAnnouncements(d.announcements))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setForm({ title: "", body: "", type: "info", priority: "normal", send_email: false });
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await createAnnouncement(form);
      resetForm();
      const data = await getAnnouncements();
      setAnnouncements(data.announcements);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await deleteAnnouncement(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bebas text-4xl text-white tracking-wider">Announcements</h1>
        <button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">New</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" required />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm">
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-1">Body</label>
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows="4" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" required />
          </div>
          <label className="flex items-center gap-2 text-gray-300 text-sm">
            <input type="checkbox" checked={form.send_email} onChange={(e) => setForm({ ...form, send_email: e.target.checked })} />
            Send email blast to all users
          </label>
          <div className="flex gap-3">
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm">Publish</button>
            <button type="button" onClick={resetForm} className="bg-white/5 border border-white/10 text-gray-300 px-6 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No announcements</div>
        ) : announcements.map((a) => (
          <div key={a.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-xs ${
                  a.type === "alert" ? "bg-red-500/20 text-red-400" :
                  a.type === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>{a.type}</span>
                <h3 className="text-white font-medium">{a.title}</h3>
                <span className={`text-xs ${a.priority === "urgent" ? "text-red-400" : a.priority === "high" ? "text-yellow-400" : "text-gray-500"}`}>{a.priority}</span>
              </div>
              {isSuper && <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>}
            </div>
            <p className="text-gray-400 text-sm">{a.body}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span>By {a.author_name || "Unknown"}</span>
              <span>{new Date(a.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}