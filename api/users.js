import { apiGet, apiPut } from "./client";

export async function getProfileApi(userId) {
  return apiGet(`/api/users/profile/${userId}`);
}

export async function updateProfileApi(userId, data) {
  return apiPut(`/api/users/profile/${userId}`, data);
}