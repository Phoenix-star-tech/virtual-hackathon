import { apiGet, apiPost, apiPut, apiDelete } from "./client";

function getToken() {
  const stored = localStorage.getItem("admin_token");
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    return parsed?.access_token || null;
  } catch {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function adminGet(endpoint) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com"}${endpoint}`, {
    headers: { ...authHeaders() },
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

async function adminPost(endpoint, body) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com"}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

async function adminPut(endpoint, body) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com"}${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

async function adminDelete(endpoint) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com"}${endpoint}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  return res.json();
}

export async function adminLogin(email, password) {
  const data = await adminPost("/api/admin/auth/login", { email, password });
  localStorage.setItem("admin_token", JSON.stringify(data));
  return data;
}

export async function adminLogout() {
  localStorage.removeItem("admin_token");
}

export async function getAdminMe() {
  return adminGet("/api/admin/auth/me");
}

export async function changeAdminPassword(data) {
  return adminPut("/api/admin/auth/change-password", data);
}

export async function getAdminStats() {
  return adminGet("/api/admin/dashboard/stats");
}

export async function getUsers(params = {}) {
  const q = new URLSearchParams(params).toString();
  return adminGet(`/api/admin/users/?${q}`);
}

export async function getUser(id) {
  return adminGet(`/api/admin/users/${id}`);
}

export async function updateUser(id, data) {
  return adminPut(`/api/admin/users/${id}`, data);
}

export async function deleteUser(id) {
  return adminDelete(`/api/admin/users/${id}`);
}

export async function toggleBanUser(id) {
  return adminPost(`/api/admin/users/${id}/toggle-ban`);
}

export async function getModules() {
  return adminGet("/api/admin/modules/");
}

export async function getModule(id) {
  return adminGet(`/api/admin/modules/${id}`);
}

export async function createModule(data) {
  return adminPost("/api/admin/modules/", data);
}

export async function updateModule(id, data) {
  return adminPut(`/api/admin/modules/${id}`, data);
}

export async function deleteModule(id) {
  return adminDelete(`/api/admin/modules/${id}`);
}

export async function toggleModuleStatus(id) {
  return adminPut(`/api/admin/modules/${id}/toggle-status`);
}

export async function getTasks(moduleId) {
  return adminGet(`/api/admin/tasks/module/${moduleId}`);
}

export async function getTask(id) {
  return adminGet(`/api/admin/tasks/${id}`);
}

export async function createTask(data) {
  return adminPost("/api/admin/tasks/", data);
}

export async function updateTask(id, data) {
  return adminPut(`/api/admin/tasks/${id}`, data);
}

export async function deleteTask(id) {
  return adminDelete(`/api/admin/tasks/${id}`);
}

export async function reorderTask(id, orderIndex) {
  return adminPut(`/api/admin/tasks/${id}/reorder`, { order_index: orderIndex });
}

export async function toggleTaskActive(id) {
  return adminPut(`/api/admin/tasks/${id}/toggle-active`);
}

export async function getTeams() {
  return adminGet("/api/admin/teams/");
}

export async function getTeam(id) {
  return adminGet(`/api/admin/teams/${id}`);
}

export async function createTeam(data) {
  return adminPost("/api/admin/teams/", data);
}

export async function updateTeam(id, data) {
  return adminPut(`/api/admin/teams/${id}`, data);
}

export async function deleteTeam(id) {
  return adminDelete(`/api/admin/teams/${id}`);
}

export async function addTeamMember(teamId, userId) {
  return adminPost(`/api/admin/teams/${teamId}/members?user_id=${userId}`);
}

export async function removeTeamMember(teamId, userId) {
  return adminDelete(`/api/admin/teams/${teamId}/members/${userId}`);
}

export async function getSubmissions(params = {}) {
  const q = new URLSearchParams(params).toString();
  return adminGet(`/api/admin/submissions/?${q}`);
}

export async function reviewSubmission(id, data) {
  return adminPut(`/api/admin/submissions/${id}/review`, data);
}

export async function getAnnouncements() {
  return adminGet("/api/admin/announcements/");
}

export async function createAnnouncement(data) {
  return adminPost("/api/admin/announcements/", data);
}

export async function deleteAnnouncement(id) {
  return adminDelete(`/api/admin/announcements/${id}`);
}

export async function getLeaderboard(moduleId) {
  const q = moduleId ? `?module_id=${moduleId}` : "";
  return adminGet(`/api/admin/leaderboard/${q}`);
}

export async function updateLeaderboardEntry(id, data) {
  return adminPut(`/api/admin/leaderboard/${id}`, data);
}

export async function toggleLeaderboardPublish(moduleId) {
  return adminPut(`/api/admin/leaderboard/toggle-publish/${moduleId}`);
}

export async function recalculateLeaderboard(moduleId) {
  return adminPost(`/api/admin/leaderboard/recalculate/${moduleId}`);
}

export async function getAdmins() {
  return adminGet("/api/admin/admins/");
}

export async function createAdmin(data) {
  return adminPost("/api/admin/admins/", data);
}

export async function updateAdmin(id, data) {
  return adminPut(`/api/admin/admins/${id}`, data);
}

export async function getPaymentSettings() {
  return adminGet("/api/admin/payment-settings/");
}

export async function updatePaymentSettings(data) {
  return adminPut("/api/admin/payment-settings/", data);
}

export async function getPlatformSettings() {
  return adminGet("/api/admin/platform-settings/");
}

export async function updatePlatformSettings(data) {
  return adminPut("/api/admin/platform-settings/", data);
}

export async function uploadTaskImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com"}/api/admin/tasks/upload-image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function uploadQrImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://virtual-hack-backend.onrender.com"}/api/admin/payment-settings/qr-upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}