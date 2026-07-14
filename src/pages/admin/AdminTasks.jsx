import { useState, useEffect } from "react";
import { getModules, getTasks, createTask, updateTask, deleteTask, toggleTaskActive, uploadTaskImage } from "../../api/admin";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function AdminTasks() {
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState({ module_id: "", title: "", description: "", link: "", answer_type: "link", quiz_options: ["", "", "", ""], points: 10, order_index: 0, attachments: [] });
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
    setForm({ module_id: selectedModule, title: "", description: "", link: "", answer_type: "link", quiz_options: ["", "", "", ""], points: 10, order_index: 0, attachments: [] });
    setEditing(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        module_id: form.module_id,
        title: form.title,
        description: form.description,
        link: form.link,
        answer_type: form.answer_type,
        quiz_options: form.answer_type === "quiz" ? form.quiz_options : [],
        attachments: form.attachments,
        points: Number(form.points),
        order_index: Number(form.order_index),
      };
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
      link: t.link || "",
      answer_type: t.answer_type || "link",
      quiz_options: t.quiz_options?.length === 4 ? t.quiz_options : ["", "", "", ""],
      attachments: t.attachments || [],
      points: t.points || 10,
      order_index: t.order_index || 0,
    });
    setShowForm(true);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this task?")) return;
    try { await deleteTask(id); fetchTasks(); } catch (err) { alert(err.message); }
  }

  async function handleToggleActive(id, current) {
    try {
      await toggleTaskActive(id);
      fetchTasks();
    } catch (err) { alert(err.message); }
  }

  function setQuizOpt(idx, val) {
    const opts = [...form.quiz_options];
    opts[idx] = val;
    setForm({ ...form, quiz_options: opts });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const { url } = await uploadTaskImage(file);
      setForm({ ...form, attachments: [...form.attachments, url] });
    } catch (err) {
      alert(err.message);
    } finally {
      setImageUploading(false);
    }
  }

  function removeAttachment(idx) {
    const updated = form.attachments.filter((_, i) => i !== idx);
    setForm({ ...form, attachments: updated });
  }

  const answerTypes = [
    { value: "quiz", label: "Quiz (A, B, C, D)" },
    { value: "link", label: "Link (URL)" },
    { value: "description", label: "Description (Text)" },
    { value: "image", label: "Image Upload" },
  ];

  return (
    <div>
      <style>{`select option { background: #1a1a2e; color: #fff; }`}</style>
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
              <label className="block text-gray-300 text-sm mb-1">Answer Type</label>
              <select value={form.answer_type} onChange={(e) => setForm({ ...form, answer_type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm">
                {answerTypes.map((at) => <option key={at.value} value={at.value}>{at.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Points</label>
              <input type="number" value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" />
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

          <div>
            <label className="block text-gray-300 text-sm mb-1">Link <span className="text-gray-500">(optional)</span></label>
            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://example.com/resource" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-red-500 text-sm" />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Attachments / Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.attachments.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Attachment ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-white/10" />
                  <button type="button" onClick={() => removeAttachment(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:border-red-500/50 cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {imageUploading ? "Uploading..." : "Upload Image"}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} className="hidden" />
            </label>
          </div>

          {form.answer_type === "quiz" && (
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">Quiz Options</label>
              <div className="grid grid-cols-2 gap-3">
                {["A", "B", "C", "D"].map((letter, i) => (
                  <div key={letter} className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm font-bold w-5">{letter}:</span>
                    <input value={form.quiz_options[i]} onChange={(e) => setQuizOpt(i, e.target.value)} placeholder={`Option ${letter}`} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

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
              <th className="text-left px-4 py-3">Answer Type</th>
              <th className="text-left px-4 py-3">Points</th>
              <th className="text-left px-4 py-3">Visible</th>
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
                <td className="px-4 py-3 text-gray-400 text-xs capitalize">{t.answer_type || "link"}</td>
                <td className="px-4 py-3">{t.points}</td>
                <td className="px-4 py-3">
                  {isSuper && (
                    <button onClick={() => handleToggleActive(t.id, t.is_active)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                        t.is_active ? "bg-green-500" : "bg-gray-600"
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        t.is_active ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  )}
                  {!isSuper && (
                    <span className={`text-xs font-semibold ${t.is_active ? "text-green-400" : "text-gray-500"}`}>
                      {t.is_active ? "On" : "Off"}
                    </span>
                  )}
                </td>
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
