import React, { useEffect, useState } from "react"
import PitcherSearchCard from "./PitcherSearchCard"
import PitcherRoster from "./PitcherRoster"
import { createTeam, deleteTeam, fetchUserTeams, fetchTeamPlayers } from "./api/teamRoster"
import { classNames } from "./utils"
import { getUserFromJWT } from "~/utils/getToken"
import SignOutButton from "~/components/sign-out-button"
import { Link } from "react-router-dom"

interface Team {
  team_id: number;
  team_name: string;
}

interface Player {
  player_name: string
  mlbid?: string
  idfg: string
  position: string
}

export default function TeamMaker() {
  const [userId, setUserId] = useState<number | null>(null)
  const [checkedAuth, setCheckedAuth] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [newTeamName, setNewTeamName] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [rosterRefreshFlag, setRosterRefreshFlag] = useState(0)

  // Get userId from JWT on mount
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const info = getUserFromJWT(token ?? "");
    setUserId(info?.userID ? Number(info.userID) : null);
    setCheckedAuth(true)
  }, [])

  // redirect to homepage if auth checked and no userId found
  useEffect(() => {
    if (checkedAuth && userId === null) {
      window.location.assign("/")
    }
  }, [checkedAuth, userId])

  useEffect(() => {
    if (userId === null) return;
    const fetchTeams = async () => {
      try {
        const res = await fetchUserTeams(userId);
        setTeams(res);
        if (res.length > 0) setSelectedTeamId(res[0].team_id);
      } catch (e) {
        console.error("Failed to fetch teams", e);
      }
    };
    fetchTeams();
  }, [userId]);

  // Fetch players for selected team when selectedTeamId or refresh flag changes
  const fetchPlayersFor = async (teamIdParam?: number | null) => {
    const id = teamIdParam ?? selectedTeamId
    if (!id) {
      setPlayers([])
      return
    }
    try {
      const res = await fetchTeamPlayers(id)
      setPlayers(res)
    } catch (e) {
      console.error("Failed to fetch team players", e)
      setPlayers([])
    }
  }

  useEffect(() => {
    fetchPlayersFor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeamId, rosterRefreshFlag])

  const handleCreateTeam = async () => {
    if (!userId) return;
    if (!newTeamName.trim()) {
      setMessage("Team name is required.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      await createTeam(userId, newTeamName);
      setNewTeamName("");
      const updatedTeams = await fetchUserTeams(userId);
      setTeams(updatedTeams);
      const newSelected = updatedTeams[updatedTeams.length - 1]?.team_id ?? null;
      setSelectedTeamId(newSelected);
      // Immediately fetch players for the new team
      await fetchPlayersFor(newSelected);
      setMessage("Team created successfully.");
    } catch (e: any) {
      setMessage(e.message || "Failed to create team.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeamId) return;
    setLoading(true);
    setMessage(null);
    try {
      await deleteTeam(selectedTeamId);
      const updatedTeams = userId ? await fetchUserTeams(userId) : [];
      setTeams(updatedTeams);
      const newSelected = updatedTeams[0]?.team_id ?? null;
      setSelectedTeamId(newSelected);
      // Fetch players for the newly selected team (or clear)
      await fetchPlayersFor(newSelected);
      setRosterRefreshFlag((f) => f + 1);
      setMessage("Team deleted successfully.");
    } catch (e: any) {
      setMessage(e.message || "Failed to delete team.");
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Navigate to grading display page
  const handleShowGrade = () => {
    if (!selectedTeamId) {
      alert("Please select a team first.");
      return;
    }
    window.location.href = `/grading-display?teamId=${selectedTeamId}`;
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 text-gray-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-3xl font-bold tracking-wide">
          Rostr<span className="text-[#850027]">.</span> Team Maker — Pitchers
        </h1>

        <div className="inline-block hover:cursor-pointer">
          <SignOutButton />
        </div>

        <div className="rounded-2xl bg-sky-100 p-4 shadow space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Select Team
              </label>
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

              {/* Create Team button — primary (light blue) */}
              <button
                onClick={handleCreateTeam}
                disabled={loading}
                className={classNames(
                  "rounded-xl px-4 py-2 text-sm font-semibold shadow transition-opacity duration-200 ease-in-out",
                  loading
                    ? "bg-gray-200 text-gray-400"
                    : "bg-sky-400 text-white border border-sky-400 hover:bg-sky-500 hover:opacity-90 hover:cursor-pointer"
                )}
              >
                Create Team
              </button>

              {/* Delete Team button — destructive (red) */}
              <button
                onClick={handleDeleteTeam}
                disabled={loading || !selectedTeamId}
                className={classNames(
                  "rounded-xl px-4 py-2 text-sm font-semibold shadow transition-opacity duration-200 ease-in-out",
                  loading || !selectedTeamId
                    ? "bg-gray-200 text-gray-400"
                    : "bg-red-500 text-white border border-red-500 hover:bg-red-600 hover:opacity-90 hover:cursor-pointer"
                )}
              >
                Delete Team
              </button>
              
              {/* Show Grade button — primary (light blue) */}
              <button
                onClick={handleShowGrade}
                className="rounded-xl bg-sky-400 text-white border border-sky-400 px-4 py-2 text-sm font-semibold shadow hover:bg-sky-500 transition-opacity duration-200 ease-in-out hover:opacity-90 hover:cursor-pointer"
              >
                Show Grade
              </button>
            </div>
          </div>

          {message && (
            <div className="mt-2 rounded-lg bg-gray-50 p-2 text-sm text-gray-700">
              {message}
            </div>
          )}
        </div>

        {/* Replace unconditional grid with conditional rendering based on selectedTeamId */}
        {selectedTeamId !== null ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PitcherSearchCard
                teamId={selectedTeamId ?? 0}
                players={players}
                onRosterChange={() => setRosterRefreshFlag((f) => f + 1)}
              />
            </div>
            <div>
              <PitcherRoster
                teamId={selectedTeamId ?? 0}
                players={players}
                onRosterChange={() => setRosterRefreshFlag((f) => f + 1)}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-sky-100 p-4 text-sm text-gray-600">
            Please select or create a team to manage pitchers.
          </div>
        )}
      </div>
    </div>
  );
}