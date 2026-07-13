import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com";

function authHeaders() {
  const stored = localStorage.getItem("admin_token");
  if (!stored) return {};
  try {
    const parsed = JSON.parse(stored);
    return parsed?.access_token ? { Authorization: `Bearer ${parsed.access_token}` } : {};
  } catch {
    return {};
  }
}

function notify(msg, type = "success") {
  const el = document.createElement("div");
  el.className = `fixed top-4 right-4 z-[9999] px-6 py-3 rounded-xl text-sm font-semibold shadow-xl backdrop-blur-sm transition-all duration-300 ${
    type === "success"
      ? "bg-emerald-600/90 text-white border border-emerald-500/30"
      : "bg-rose-600/90 text-white border border-rose-500/30"
  }`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 3000);
}

export default function AdminDomains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchDomains(); }, []);

  async function fetchDomains() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/domains`, {
        headers: { ...authHeaders() },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDomains(data.domains || []);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/domains`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to add" }));
        throw new Error(err.detail);
      }
      notify("Domain added successfully");
      setNewName("");
      fetchDomains();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/domains/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Failed to delete" }));
        throw new Error(err.detail);
      }
      notify("Domain deleted");
      fetchDomains();
    } catch (err) {
      notify(err.message, "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Manage Domains</h1>
        <p className="text-gray-400 text-sm mt-1">Add or remove hackathon domains that users can select during registration</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add New Domain</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. Web Development"
            className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Current Domains ({domains.length})</h2>
        </div>
        {domains.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">No domains added yet</div>
        ) : (
          <div className="divide-y divide-white/10">
            {domains.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-6 py-4">
                <span className="text-white text-sm font-medium">{d.name}</span>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
