import React, { useEffect, useState } from "react"
import { fetchTeamPlayers, fetchPitchers } from "~/team-maker-page/api/teamRoster"

interface Player {
  player_name: string
  mlbid?: string
  idfg: string
  position: string
}

interface PitcherData {
  IDfg: string
  Name: string
  Team: string
  Age: number
  W: number
  L: number
}

interface TradeResult {
  sideA: { total_grade: number }
  sideB: { total_grade: number }
  diff: number
  winner: string
  fairness_pct?: number
  suggestion?: string
  profile?: string
  profile_explanation?: string
}

interface SideBSearchProps {
  players: PitcherData[]
  setPlayers: React.Dispatch<React.SetStateAction<PitcherData[]>>
}

const PROFILE_OPTIONS = [
  { value: "standard", label: "Standard (balanced)" },
  { value: "strikeout", label: "Strikeout-heavy" },
  { value: "control", label: "Control & ratios" },
  { value: "groundball", label: "Groundball / contact" },
  { value: "clutch", label: "Clutch / WPA" },
  { value: "sabermetrics", label: "Sabermetrics / xFIP" },
]

function SideBSearch({ players, setPlayers }: SideBSearchProps) {
  const [name, setName] = useState("")
  const [results, setResults] = useState<PitcherData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const doFetch = async () => {
      if (!name) {
        setResults([])
        setError(null)
        return
      }
      setLoading(true)
      try {
        const data = await fetchPitchers({ name })
        setResults(data)
        setError(data.length === 0 ? "No pitchers found." : null)
      } catch (e: any) {
        setError(e.message || "Failed to fetch pitchers")
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const timeout = setTimeout(doFetch, 400)
    return () => clearTimeout(timeout)
  }, [name])

  const handleAdd = (p: PitcherData) => {
    if (players.some((x) => x.IDfg === p.IDfg)) return
    setPlayers((prev) => [...prev, p])
  }

  const handleRemove = (idfg: string) => {
    setPlayers((prev) => prev.filter((p) => p.IDfg !== idfg))
  }

  const isAdded = (idfg: string) => players.some((p) => p.IDfg === idfg)

  return (
    <div className="rounded-2xl bg-white p-4 shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Other Team</h2>
        <p className="text-xs text-gray-500">Search and add pitchers.</p>
      </div>

      {/* Search input */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-gray-600">Pitcher Name</label>
          <input
            placeholder="e.g., Zac Gallen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
          />
        </div>
        <div className="flex items-end">
          <div className="text-xs text-gray-500">Start typing — results auto-update.</div>
        </div>
      </div>

      {/* Selected players as chips */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1">Selected pitchers</p>
        {players.length === 0 ? (
          <p className="text-xs text-gray-400">No pitchers added yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <div
                key={p.IDfg}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs shadow-sm"
              >
                <span className="font-medium">{p.Name}</span>
                <span className="text-gray-500 text-[10px]">
                  {p.Team} · {p.W}-{p.L}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(p.IDfg)}
                  className="text-gray-500 hover:text-red-600 text-[10px]"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Search results table */}
      <div className="overflow-hidden rounded-2xl border bg-white shadow">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Team</th>
              <th className="px-3 py-2">Age</th>
              <th className="px-3 py-2">W</th>
              <th className="px-3 py-2">L</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => {
              const added = isAdded(row.IDfg)
              return (
                <tr key={row.IDfg} className="border-t">
                  <td className="px-3 py-2 font-medium">{row.Name}</td>
                  <td className="px-3 py-2 text-gray-700">{row.Team}</td>
                  <td className="px-3 py-2 text-gray-700">{row.Age}</td>
                  <td className="px-3 py-2 text-gray-700">{row.W}</td>
                  <td className="px-3 py-2 text-gray-700">{row.L}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => handleAdd(row)}
                      disabled={added}
                      className={
                        "rounded-lg px-3 py-1 text-xs font-semibold shadow transition-colors " +
                        (added
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-[#562424] text-white hover:bg-[#734343]")
                      }
                    >
                      {added ? "Added" : "Add"}
                    </button>
                  </td>
                </tr>
              )
            })}
            {!loading && results.length === 0 && !error && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={6}>
                  Start typing a name to search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mt-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-700">
          {error}
        </div>
      )}
    </div>
  )
}

export default function TradeEvaluator() {
  const [teamId, setTeamId] = useState<number | null>(null)
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([])
  const [selectedSideAIds, setSelectedSideAIds] = useState<string[]>([])
  const [sideBPlayers, setSideBPlayers] = useState<PitcherData[]>([])
  const [result, setResult] = useState<TradeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingTeam, setLoadingTeam] = useState(false)

  const [profile, setProfile] = useState<string>("standard") // 🔥 NEW

  // Read teamId from ?teamId=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("teamId")
    if (id) setTeamId(Number(id))
  }, [])

  // Fetch team players
  useEffect(() => {
    const loadTeam = async () => {
      if (!teamId) return
      setLoadingTeam(true)
      try {
        const data = await fetchTeamPlayers(teamId)
        setTeamPlayers(data)
      } catch (e: any) {
        setError(e.message || "Failed to load team players")
      } finally {
        setLoadingTeam(false)
      }
    }
    loadTeam()
  }, [teamId])

  const togglePlayer = (idfg: string) => {
    setSelectedSideAIds((prev) =>
      prev.includes(idfg) ? prev.filter((x) => x !== idfg) : [...prev, idfg]
    )
  }

  const selectedSideAPlayers = teamPlayers.filter((p) =>
    selectedSideAIds.includes(p.idfg)
  )

  const handleEvaluate = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("http://localhost:5006/api/trade/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sideA: selectedSideAPlayers.map((p) => p.player_name),
          sideB: sideBPlayers.map((p) => p.Name),
          profile, // 🔥 send profile
        }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const evaluateDisabled =
    loading ||
    selectedSideAPlayers.length === 0 ||
    sideBPlayers.length === 0

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trade Evaluator</h1>
        </div>

        {!teamId && (
          <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            No team selected. Please go back to the Team Maker page and open the Trade
            Analyzer from there.
          </div>
        )}

        {/* 🔥 Strategy selection */}
        <div className="rounded-2xl bg-gray-50 p-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-gray-800">
            Fantasy Strategy / Profile
          </div>
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
          >
            {PROFILE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-sm text-gray-700">
          Choose which players from your team are involved in the trade (My Team), then
          search and add the opposing players (Other Team). The evaluation will be explained
          through the lens of your selected fantasy strategy.
        </p>

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow p-4 mt-6 space-y-2">
            <h2 className="text-xl font-bold">Trade Summary</h2>
            <p>My Team Total: {result.sideA.total_grade.toFixed(2)}</p>
            <p>Other Team Total: {result.sideB.total_grade.toFixed(2)}</p>
            <p>Difference: {result.diff.toFixed(2)}</p>
            {typeof result.fairness_pct === "number" && (
              <p>Fairness: {result.fairness_pct.toFixed(1)}%</p>
            )}
            <p>Winner: {result.winner}</p>
            {result.suggestion && (
              <p className="text-sm text-gray-700">{result.suggestion}</p>
            )}
            {result.profile_explanation && (
              <div className="mt-3 border-t pt-2 text-xs text-gray-700">
                <div className="font-semibold mb-1">
                  Strategy:{" "}
                  {
                    PROFILE_OPTIONS.find((p) => p.value === result.profile)
                      ?.label ?? result.profile
                  }
                </div>
                <p>{result.profile_explanation}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleEvaluate}
          disabled={evaluateDisabled}
          className={
            "rounded-xl px-4 py-2 text-sm font-semibold shadow " +
            (evaluateDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-[#562424] text-white hover:bg-[#734343]")
          }
        >
          {loading ? "Analyzing..." : "Evaluate Trade"}
        </button>

        <div className="grid md:grid-cols-2 gap-6">
          {/*  My Team: your team */}
          <div className="rounded-2xl bg-white p-4 shadow space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Team</h2>
              {loadingTeam && (
                <span className="text-xs text-gray-500">Loading team...</span>
              )}
            </div>

            {teamPlayers.length === 0 && !loadingTeam ? (
              <p className="text-xs text-gray-400">
                No players found on this team yet. Go back to Team Maker to add pitchers.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto rounded-xl border border-gray-100">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2">Select</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Pos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamPlayers.map((p) => {
                      const checked = selectedSideAIds.includes(p.idfg)
                      return (
                        <tr key={p.idfg} className="border-t">
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePlayer(p.idfg)}
                            />
                          </td>
                          <td className="px-3 py-2 font-medium">{p.player_name}</td>
                          <td className="px-3 py-2 text-gray-700">{p.position}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Selected summary */}
            <div className="text-xs text-gray-600">
              Selected:{" "}
              <span className="font-semibold">
                {selectedSideAPlayers.length}
              </span>{" "}
              {selectedSideAPlayers.length > 0 && (
                <span>
                  (
                  {selectedSideAPlayers
                    .map((p) => p.player_name)
                    .join(", ")}
                  )
                </span>
              )}
            </div>
          </div>

          {/* Other Team: search */}
          <SideBSearch players={sideBPlayers} setPlayers={setSideBPlayers} />
        </div>

        <a
          href="/team-maker"
          className="inline-block text-sm font-semibold text-[#562424] hover:underline"
        >
          ← Back to Team Maker
        </a>
      </div>
    </div>
  )
}
