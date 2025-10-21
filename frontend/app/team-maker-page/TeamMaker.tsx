import React, { useEffect, useState } from "react"
import PitcherSearchCard from "./PitcherSearchCard"
import PitcherRoster from "./PitcherRoster"
import { createTeam, deleteTeam, fetchUserTeams } from "./api/teamRoster"
import { classNames } from "./utils"
import { getUserFromJWT } from "~/utils/getToken"
import SignOutButton from "~/components/sign-out-button"

interface Team {
  team_id: number
  team_name: string
}

export default function TeamMaker() {
  const [userId, setUserId] = useState<number | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [newTeamName, setNewTeamName] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [rosterRefreshFlag, setRosterRefreshFlag] = useState(0)

  // 🔧 NEW preference states
  const [favoriteTeamId, setFavoriteTeamId] = useState<number | null>(null)
  const [teamColor, setTeamColor] = useState("#562424")
  const [isPublic, setIsPublic] = useState(true)

  // Get userId from JWT on mount
  useEffect(() => {
    const token = localStorage.getItem("jwtToken")
    const info = getUserFromJWT(token ?? "")
    setUserId(info?.userID ? Number(info.userID) : null)
  }, [])

  useEffect(() => {
    if (userId === null) return
    const fetchTeams = async () => {
      try {
        const res = await fetchUserTeams(userId)
        setTeams(res)
        if (res.length > 0) setSelectedTeamId(res[0].team_id)
      } catch (e) {
        console.error("Failed to fetch teams", e)
      }
    }
    fetchTeams()
  }, [userId])

  const handleCreateTeam = async () => {
    if (!userId) return
    if (!newTeamName.trim()) {
      setMessage("Team name is required.")
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      await createTeam(userId, newTeamName)
      setNewTeamName("")
      const updatedTeams = await fetchUserTeams(userId)
      setTeams(updatedTeams)
      setSelectedTeamId(updatedTeams[updatedTeams.length - 1]?.team_id ?? null)
      setMessage("Team created successfully.")
    } catch (e: any) {
      setMessage(e.message || "Failed to create team.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTeam = async () => {
    if (!selectedTeamId) return
    setLoading(true)
    setMessage(null)
    try {
      await deleteTeam(selectedTeamId)
      const updatedTeams = userId ? await fetchUserTeams(userId) : []
      setTeams(updatedTeams)
      setSelectedTeamId(updatedTeams[0]?.team_id ?? null)
      setRosterRefreshFlag((f) => f + 1)
      setMessage("Team deleted successfully.")
    } catch (e: any) {
      setMessage(e.message || "Failed to delete team.")
    } finally {
      setLoading(false)
    }
  }

  // 🔧 NEW: Handle saving preferences (placeholder logic)
  const handleSavePreferences = () => {
    setMessage(`Preferences saved for team ${selectedTeamId}`)
    console.log({
      favorite: favoriteTeamId,
      color: teamColor,
      public: isPublic,
    })
  }

  if (userId === null) {
    return (
      <div className="p-8 text-gray-900">
        <div className="mb-4 text-red-600 font-bold">
          No user ID found in JWT. Please sign in.
        </div>
        <div className="text-gray-700">
          You must be signed in to use the Team Maker.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5DBD5] px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold tracking-wide">
          Rostr<span className="text-[#850027]">.</span> Team Maker — Pitchers
        </h1>

        <SignOutButton />

        <div className="rounded-2xl bg-white p-4 shadow space-y-3">
          {/* ---------- TEAM SELECTION ---------- */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Select Team</label>
              <select
                value={selectedTeamId ?? ""}
                onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
              >
                {teams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
              />
              <button
                onClick={handleCreateTeam}
                disabled={loading}
                className={classNames(
                  "rounded-xl px-4 py-2 text-sm font-semibold shadow",
                  loading ? "bg-gray-200 text-gray-400" : "bg-[#562424] text-white hover:bg-[#734343]"
                )}
              >
                Create
              </button>
              <button
                onClick={handleDeleteTeam}
                disabled={loading || !selectedTeamId}
                className={classNames(
                  "rounded-xl px-4 py-2 text-sm font-semibold shadow",
                  loading || !selectedTeamId
                    ? "bg-gray-200 text-gray-400"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                )}
              >
                Delete
              </button>
            </div>
          </div>

          {/* ---------- NEW: TEAM PREFERENCES ---------- */}
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold mb-2">Team Preferences</h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div>
                <label className="text-sm font-medium text-gray-700">Favorite Team</label>
                <select
                  value={favoriteTeamId ?? ""}
                  onChange={(e) => setFavoriteTeamId(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#850027]"
                >
                  <option value="">None</option>
                  {teams.map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Team Color</label>
                <input
                  type="color"
                  value={teamColor}
                  onChange={(e) => setTeamColor(e.target.value)}
                  className="mt-1 h-10 w-16 cursor-pointer rounded border border-gray-300"
                />
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-6">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  id="public"
                  className="h-4 w-4 text-[#850027] focus:ring-[#850027]"
                />
                <label htmlFor="public" className="text-sm text-gray-700">
                  Public team
                </label>
              </div>

              <button
                onClick={handleSavePreferences}
                className="rounded-xl bg-[#562424] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#734343]"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-700">
              {message}
            </div>
          )}
        </div>

        {/* ---------- MAIN GRID ---------- */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PitcherSearchCard
              teamId={selectedTeamId ?? 0}
              onRosterChange={() => setRosterRefreshFlag((f) => f + 1)}
            />
          </div>
          <div>
            <PitcherRoster
              key={rosterRefreshFlag}
              teamId={selectedTeamId ?? 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
