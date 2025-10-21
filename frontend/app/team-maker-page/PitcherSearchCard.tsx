import React, { useEffect, useState } from "react"
import { fetchPitchers, addPlayerToTeam } from "./api/teamRoster"
import { classNames } from "./utils"

interface PitcherData {
  IDfg: string
  Name: string
  Team: string
  Age: number
  W: number
  L: number
}

interface Props {
  teamId: number
  onRosterChange?: () => void
}

export default function PitcherSearchCard({ teamId, onRosterChange }: Props) {
  const [name, setName] = useState("")
  const [results, setResults] = useState<PitcherData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const doFetch = async () => {
      if (!name) {
        setResults([])
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

  const handleAdd = async (player: PitcherData) => {
    if (!teamId || addedIds.has(player.IDfg)) return
    try {
      await addPlayerToTeam(teamId, {
        player_name: player.Name,
        mlbid: player.W + "-" + player.L,
        idfg: player.IDfg,
        position: "P",
      })
      setAddedIds((prev) => new Set(prev).add(player.IDfg))
      if (onRosterChange) onRosterChange()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-medium text-gray-600">Pitcher Name</label>
          <input
            placeholder="e.g., Gerrit Cole"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
          />
        </div>
        <div className="flex items-end">
          <div className="text-sm text-gray-500">Start typing — results auto-update.</div>
        </div>
      </div>
      {error && <div className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</div>}

      <div className="overflow-hidden rounded-2xl border bg-white shadow mt-4">
        <table className="min-w-full text-left text-sm">
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
              const isAdded = addedIds.has(row.IDfg)
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
                      disabled={isAdded}
                      className={classNames(
                        "rounded-lg px-3 py-1 text-sm font-semibold shadow transition-colors",
                        isAdded
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-[#562424] text-white hover:bg-[#734343]"
                      )}
                    >
                      {isAdded ? "Added" : "Add"}
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
    </div>
  )
}
