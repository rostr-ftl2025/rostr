import React, { useEffect, useMemo, useRef, useState } from "react";
const API_BASE: string =
  (typeof window !== "undefined" && (window as any).__API_URL__) ||
  ((globalThis as any)?.import?.meta?.env?.VITE_API_URL ?? "") ||
  ((typeof process !== "undefined" && (process as any)?.env?.NEXT_PUBLIC_API_URL) || "");

// ---------------- Types ----------------
interface PitcherData {
  IDfg: string;
  Name: string;
  Team: string;
  Age: number;
  W: number;
  L: number;
  start?: number;
  end?: number;
}

// ---------------- Helpers ----------------
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const useDebouncedValue = <T,>(value: T, delay = 300) => {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

// ---------------- API ----------------
async function fetchPitchers(params: { season?: string; name?: string }) {
  const qs = new URLSearchParams();
  if (params.season) qs.set("season", params.season.trim());
  if (params.name) qs.set("name", params.name.trim());
  const res = await fetch(`${API_BASE}/api/search-pitcher?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch pitchers");
  return (await res.json()) as PitcherData[];
}

async function fetchYears(idfg: string) {
  const res = await fetch(`${API_BASE}/api/get-player-years?fangraph_id=${idfg}`);
  if (!res.ok) throw new Error("Failed to fetch years");
  return (await res.json()) as { start: number; end: number };
}

// ---------------- Main Component ----------------
export default function TeamMakerPitchers() {
  // search state
  const [season, setSeason] = useState("");
  const [name, setName] = useState("");
  const debouncedSeason = useDebouncedValue(season, 400);
  const debouncedName = useDebouncedValue(name, 400);

  // result state
  const [results, setResults] = useState<PitcherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // roster state
  const [teamName, setTeamName] = useState("My Pitching Staff");
  const [roster, setRoster] = useState<PitcherData[]>([]);
  const MAX_PITCHERS = 10; // adjust to your rules

  // fetch on debounce
  useEffect(() => {
    const doFetch = async () => {
      setError(null);
      if (!debouncedSeason && !debouncedName) {
        setResults([]);
        return;
      }
      if (debouncedSeason && !/^\d{4}$/.test(debouncedSeason)) {
        setError("Season must be a 4‑digit year (e.g., 2024)");
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchPitchers({ season: debouncedSeason, name: debouncedName });
        setResults(data);
        if (data.length === 0) setError("No pitchers found for the given criteria.");
      } catch (e: any) {
        setError(e?.message || "Failed to load pitchers");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [debouncedSeason, debouncedName]);

  const canAddMore = roster.length < MAX_PITCHERS;
  const rosterIds = useMemo(() => new Set(roster.map((p) => p.IDfg)), [roster]);

  const addToRoster = (p: PitcherData) => {
    if (rosterIds.has(p.IDfg)) return; // no duplicates
    if (!canAddMore) return;
    setRoster((r) => [...r, p]);
  };

  const removeFromRoster = (id: string) => {
    setRoster((r) => r.filter((p) => p.IDfg !== id));
  };

  const clearRoster = () => setRoster([]);

  const [yearsLoading, setYearsLoading] = useState<Record<string, boolean>>({});
  const [yearsError, setYearsError] = useState<Record<string, string | undefined>>({});
  const [yearsById, setYearsById] = useState<Record<string, { start: number; end: number } | undefined>>({});

  const handleGetYears = async (id: string) => {
    if (yearsById[id] || yearsLoading[id]) return;
    setYearsLoading((m) => ({ ...m, [id]: true }));
    setYearsError((m) => ({ ...m, [id]: undefined }));
    try {
      const yrs = await fetchYears(id);
      setYearsById((m) => ({ ...m, [id]: yrs }));
    } catch (e: any) {
      setYearsError((m) => ({ ...m, [id]: e?.message || "Error loading years" }));
    } finally {
      setYearsLoading((m) => ({ ...m, [id]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5DBD5] px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-wide">
            Rostr<span className="text-[#850027]">.</span> Team Maker — Pitchers
          </h1>
          <div className="flex items-center gap-3">
            <input
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <button
              onClick={clearRoster}
              disabled={roster.length === 0}
              className={classNames(
                "rounded-xl px-3 py-2 text-sm font-semibold shadow",
                roster.length === 0 ? "bg-gray-200 text-gray-400" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Clear Roster
            </button>
          </div>
        </div>

        {/* Search Card */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Season</label>
              <input
                placeholder="e.g., 2024"
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium text-gray-600">Pitcher Name (optional)</label>
              <input
                placeholder="e.g., Gerrit Cole"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
              />
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-500">
                Start typing — results auto‑update.
              </div>
            </div>
          </div>
          {error && <div className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</div>}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Results */}
          <div className="lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Search Results</h2>
              <div className="text-sm text-gray-500">{loading ? "Loading…" : `${results.length} found`}</div>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-white shadow">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Team</th>
                    <th className="px-3 py-2">Age</th>
                    <th className="px-3 py-2">W</th>
                    <th className="px-3 py-2">L</th>
                    <th className="px-3 py-2">Years</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => {
                    const yrs = yearsById[row.IDfg];
                    const isAdded = rosterIds.has(row.IDfg);
                    return (
                      <tr key={row.IDfg} className="border-t">
                        <td className="px-3 py-2 font-medium">{row.Name}</td>
                        <td className="px-3 py-2 text-gray-700">{row.Team}</td>
                        <td className="px-3 py-2 text-gray-700">{row.Age}</td>
                        <td className="px-3 py-2 text-gray-700">{row.W}</td>
                        <td className="px-3 py-2 text-gray-700">{row.L}</td>
                        <td className="px-3 py-2">
                          {yrs ? (
                            <span className="text-gray-800">{yrs.start} – {yrs.end}</span>
                          ) : yearsLoading[row.IDfg] ? (
                            <span className="text-gray-500">Loading…</span>
                          ) : yearsError[row.IDfg] ? (
                            <span className="text-rose-700">{yearsError[row.IDfg]}</span>
                          ) : (
                            <button
                              onClick={() => handleGetYears(row.IDfg)}
                              className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200"
                            >
                              find years
                            </button>
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => addToRoster(row)}
                            disabled={isAdded || !canAddMore}
                            className={classNames(
                              "rounded-lg px-3 py-1 text-sm font-semibold shadow",
                              isAdded
                                ? "bg-gray-200 text-gray-400"
                                : canAddMore
                                ? "bg-[#562424] text-white hover:bg-[#734343]"
                                : "bg-gray-200 text-gray-400"
                            )}
                          >
                            {isAdded ? "Added" : "Add"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {(!loading && results.length === 0 && !error) && (
                    <tr>
                      <td className="px-3 py-6 text-center text-gray-500" colSpan={7}>
                        Start typing a season and/or name to search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Roster */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Roster ({roster.length}/{MAX_PITCHERS})</h2>
            </div>
            <div className="space-y-2">
              {roster.map((p) => (
                <div key={p.IDfg} className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 shadow">
                  <div>
                    <div className="font-medium">{p.Name}</div>
                    <div className="text-xs text-gray-500">{p.Team} · Age {p.Age} · {p.W}-{p.L}</div>
                  </div>
                  <button
                    onClick={() => removeFromRoster(p.IDfg)}
                    className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                  >
                    Remove
                  </button>
                </div>
              ))}
              {roster.length === 0 && (
                <div className="rounded-xl border border-dashed bg-white/50 p-4 text-center text-sm text-gray-500">
                  Your roster is empty. Add pitchers from the left.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
