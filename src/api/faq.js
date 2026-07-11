import { apiGet } from "./client";

export async function getFaqsApi() {
  return apiGet("/api/faq/");
}