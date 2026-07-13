import { apiGet } from "./client";

export async function getDomainsApi() {
  const data = await apiGet("/api/domains");
  return data.domains || [];
}
