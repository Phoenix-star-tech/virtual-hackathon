import { apiGet } from "./client";

export async function getPlatformSettings() {
  return apiGet("/api/platform/settings");
}
