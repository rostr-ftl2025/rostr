import React, { useState } from "react"
import { removePlayerFromTeam } from "./api/teamRoster"
import { classNames } from "./utils"

interface Player {
  player_name: string
  mlbid?: string
  idfg: string
  position: string
}

interface Props {
  teamId: number
  players: Player[]
  onRosterChange?: () => void
}

export default function PitcherRoster({ teamId, players, onRosterChange }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRemove = async (playerName: string) => {
    setLoading(true)
    setError(null)
    try {
      await removePlayerFromTeam(teamId, playerName)
      // notify parent to refresh authoritative list
      if (onRosterChange) onRosterChange()
    } catch (e: any) {
      setError(e.message || "Failed to remove player")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Roster ({players.length})</h2>
      {loading && <div className="text-gray-500">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {players.map((p) => (
        <div key={p.idfg} className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 shadow">
          <div>
            <div className="font-medium">{p.player_name}</div>
            <div className="text-xs text-gray-500">
              {p.position} · {p.mlbid || "N/A"}
            </div>
          </div>
          <button
            onClick={() => handleRemove(p.player_name)}
            className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-opacity duration-200 ease-in-out hover:opacity-90 hover:cursor-pointer"
          >
            Remove
          </button>
        </div>
      ))}
      {players.length === 0 && !loading && !error && (
        <div className="rounded-xl border border-dashed bg-white/50 p-4 text-center text-sm text-gray-500">
          Your roster is empty. Add pitchers from the left.
        </div>
      )}
    </div>
  )
}
