import { apiGet, apiPost } from "./client";

export async function getTasksByModule(moduleId) {
  const q = moduleId ? `?module_id=${moduleId}` : "";
  return apiGet(`/api/tasks/${q}`);
}

export async function getPublicModules() {
  return apiGet("/api/tasks/modules");
}

export async function getMySubmissions(submitterId) {
  return apiGet(`/api/submissions/my?submitter_id=${submitterId}`);
}

export async function submitTask({ taskId, submitterId, answer, files }) {
  return apiPost("/api/submissions/", { task_id: taskId, submitter_id: submitterId, answer: answer || "", files: files || [] });
}
