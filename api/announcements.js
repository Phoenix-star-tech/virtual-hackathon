import { apiGet } from "./client";

export async function getAnnouncements() {
  return apiGet("/api/announcements");
}
