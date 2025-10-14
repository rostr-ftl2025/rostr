import { API_URL } from "~/config";
import type { PitcherData } from "../types";

export async function fetchPitchers(params: { name?: string }) {
  const qs = new URLSearchParams();
  const currentYear = new Date().getFullYear().toString();
  qs.set("season", currentYear);
  if (params.name) qs.set("name", params.name.trim());

  const res = await fetch(`${API_URL}/api/search-pitcher?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch pitchers");
  return (await res.json()) as PitcherData[];
}
