import { apiPost, apiGet } from "./client";

export async function registerSoloApi(data) {
  return apiPost("/api/auth/register/solo", data);
}

export async function registerTeamApi(data) {
  return apiPost("/api/auth/register/team", data);
}

export async function checkEmailApi(email) {
  return apiGet(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
}

export async function checkTeamNameApi(teamName) {
  return apiGet(`/api/auth/check-team-name?team_name=${encodeURIComponent(teamName)}`);
}

export async function loginApi(type, credential, password) {
  const body = { type, password };
  if (type === "solo") {
    body.email = credential;
  } else {
    body.team_name = credential;
  }
  return apiPost("/api/auth/login", body);
}

export async function logoutApi() {
  return apiPost("/api/auth/logout");
}

export async function getSessionApi() {
  return apiGet("/api/auth/session");
}
