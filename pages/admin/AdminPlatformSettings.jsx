import { useState, useEffect } from "react";
import { getPlatformSettings, updatePlatformSettings } from "../../api/admin";

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

export default function AdminPlatformSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const data = await getPlatformSettings();
      setSettings(data);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function toggle(field) {
    setSaving(true);
    try {
      const payload = { [field]: !settings[field] };
      const updated = await updatePlatformSettings(payload);
      setSettings(updated);
      notify(`${field.replace(/_/g, " ")} toggled successfully`);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function setModule(value) {
    setSaving(true);
    try {
      const updated = await updatePlatformSettings({ active_module: value });
      setSettings(updated);
      notify(`Active module changed to ${value}`);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!settings) {
    return <div className="text-gray-400 text-center py-20">Failed to load settings</div>;
  }

  const toggles = [
    {
      key: "tasks_visible",
      label: "Tasks Visibility",
      description: "ON: User dashboard hides tasks and shows 'Coming Soon'. OFF: Tasks visible normally.",
      value: settings.tasks_visible,
    },
    {
      key: "certificate_download_enabled",
      label: "Certificate Download",
      description: "ON: Certificate button downloads. OFF: Button shows 'Still not qualified'.",
      value: settings.certificate_download_enabled,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Control user dashboard behaviour in real time</p>
      </div>

      {/* Toggle Cards */}
      <div className="space-y-4 mb-8">
        {toggles.map((t) => (
          <div key={t.key} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white">{t.label}</h3>
              <p className="text-sm text-gray-400 mt-1">{t.description}</p>
            </div>
            <button
              onClick={() => toggle(t.key)}
              disabled={saving}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 ${
                t.value ? "bg-emerald-500" : "bg-gray-600"
              } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  t.value ? "translate-x-7" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Module Registration Phase */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white">Module Registration Phase</h3>
        <p className="text-sm text-gray-400 mt-1 mb-5">
          Select which module users can register for. The other module will be locked/hidden on the dashboard.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setModule("Module 1")}
            disabled={saving || settings.active_module === "Module 1"}
            className={`flex-1 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              settings.active_module === "Module 1"
                ? "bg-red-600 text-white border border-red-500"
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-red-500/50 hover:text-white"
            } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="text-lg">Module 1</div>
            <div className="text-xs font-normal mt-0.5 opacity-70">Online Tasks</div>
            {settings.active_module === "Module 1" && (
              <div className="text-[10px] mt-1.5 font-semibold uppercase tracking-wider text-emerald-400">Active</div>
            )}
          </button>
          <button
            onClick={() => setModule("Module 2")}
            disabled={saving || settings.active_module === "Module 2"}
            className={`flex-1 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
              settings.active_module === "Module 2"
                ? "bg-red-600 text-white border border-red-500"
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-red-500/50 hover:text-white"
            } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="text-lg">Module 2</div>
            <div className="text-xs font-normal mt-0.5 opacity-70">42h Sprint</div>
            {settings.active_module === "Module 2" && (
              <div className="text-[10px] mt-1.5 font-semibold uppercase tracking-wider text-emerald-400">Active</div>
            )}
          </button>
        </div>
      </div>

      {/* Live Preview Hint */}
      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400">
        <span className="text-gray-300 font-semibold">ℹ️</span> Changes take effect immediately on the user dashboard — no redeploy needed.
      </div>
    </div>
  );
}
