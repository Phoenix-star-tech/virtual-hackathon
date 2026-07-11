import { apiPost, apiGet } from "./client";

export async function loginApi(email, password) {
  return apiPost("/api/auth/login", { email, password });
}

export async function registerApi(fullName, email, phone, college, password) {
  return apiPost("/api/auth/register", {
    full_name: fullName,
    email,
    phone,
    college,
    password,
  });
}

export async function logoutApi() {
  return apiPost("/api/auth/logout");
}

export async function getSessionApi() {
  return apiGet("/api/auth/session");
}