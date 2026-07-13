import { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "../../hooks/useAdminAuth";

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
  el.className = `fixed top-4 right-4 z-[9999] px-6 py-3 rounded-xl text-sm font-semibold shadow-xl backdrop-blur-sm transition-all duration-300 animate-bounce-once ${
    type === "success"
      ? "bg-emerald-600/90 text-white border border-emerald-500/30"
      : "bg-rose-600/90 text-white border border-rose-500/30"
  }`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 3000);
}

export default function AdminPaymentSettings() {
  const { admin } = useAdminAuth();
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState(9);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/payment-settings`, {
        headers: { ...authHeaders() },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setConfig(data);
      setUpiId(data.upi_id || "");
      setAmount(data.amount || 9);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("Please select an image file", "error");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/api/admin/payment-settings/qr-upload`, {
        method: "POST",
        headers: { ...authHeaders() },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }));
        throw new Error(err.detail);
      }
      const data = await res.json();
      setConfig((prev) => ({ ...prev, qr_image_url: data.qr_image_url }));
      notify("QR code image updated successfully");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleUpdateSettings() {
    setUpdating(true);
    try {
      const body = {};
      if (upiId !== (config?.upi_id || "")) body.upi_id = upiId;
      if (amount !== (config?.amount || 9)) body.amount = amount;

      if (Object.keys(body).length === 0) {
        notify("No changes to save");
        setUpdating(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/admin/payment-settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Update failed" }));
        throw new Error(err.detail);
      }
      notify("Settings updated successfully");
      fetchConfig();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setUpdating(false);
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
        <h1 className="text-2xl font-bold text-white">Payment Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage QR code image and UPI payment configuration</p>
      </div>

      {/* QR Code Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">QR Code Image</h2>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0">
            {config?.qr_image_url ? (
              <img
                src={config.qr_image_url}
                alt="Payment QR Code"
                className="w-40 h-40 rounded-xl border border-white/10 object-contain bg-white"
              />
            ) : (
              <div className="w-40 h-40 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center">
                <span className="text-gray-500 text-xs text-center px-2">No QR code uploaded</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Upload new QR code image</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600/20 file:text-red-400 hover:file:bg-red-600/30 file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {uploading && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                  <span className="text-xs text-gray-400">Uploading to Cloudinary...</span>
                </div>
              )}
            </div>

            {config?.qr_image_url && (
              <div>
                <p className="text-xs text-gray-500 break-all">
                  Current URL: <span className="text-gray-400">{config.qr_image_url}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UPI Settings Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">UPI Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@upi"
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
            />
          </div>
        </div>

        <button
          onClick={handleUpdateSettings}
          disabled={updating}
          className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all"
        >
          {updating ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Preview Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Public Preview</h2>
        <p className="text-sm text-gray-400 mb-4">This is how the payment section appears on the registration page.</p>
        <div className="bg-white rounded-xl p-6 max-w-sm mx-auto">
          {config?.qr_image_url ? (
            <img src={config.qr_image_url} alt="QR" className="w-32 h-32 mx-auto rounded-lg border border-slate-200 object-contain" />
          ) : (
            <div className="w-32 h-32 mx-auto rounded-lg bg-slate-100 flex items-center justify-center">
              <span className="text-xs text-slate-400">No QR</span>
            </div>
          )}
          <p className="text-xs text-slate-500 text-center mt-2 font-medium">
            Scan to pay ₹{amount || 9}
            {upiId && <> — UPI: <span className="font-semibold text-slate-700">{upiId}</span></>}
          </p>
        </div>
      </div>
    </div>
  );
}
