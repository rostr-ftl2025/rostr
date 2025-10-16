import { API_URL } from "~/config"

// ---------------- Teams ----------------
export async function fetchUserTeams(userId: number) {
  const res = await fetch(`${API_URL}/api/team-search/${userId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Failed to fetch user teams")
  }
  return (await res.json()) as { team_id: number; team_name: string }[]
}

export async function createTeam(userId: number, team_name: string) {
  const res = await fetch(`${API_URL}/api/create-team`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, team_name }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Failed to create team")
  }
  return res.json()
}

export async function deleteTeam(teamId: number) {
  const res = await fetch(`${API_URL}/api/delete-team/${teamId}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Failed to delete team")
  }
  return res.json()
}

// ---------------- Players ----------------
export interface PitcherData {
  IDfg: string
  Name: string
  Team: string
  Age: number
  W: number
  L: number
}

export async function fetchPitchers(params: { name?: string }) {
  const qs = new URLSearchParams()
  const currentYear = new Date().getFullYear().toString()
  qs.set("season", currentYear)
  if (params.name) qs.set("name", params.name.trim())

  const res = await fetch(`${API_URL}/api/search-pitcher?${qs.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch pitchers")
  return (await res.json()) as PitcherData[]
}

export async function fetchTeamPlayers(teamId: number) {
  const res = await fetch(`${API_URL}/api/teams/${teamId}/players`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Failed to fetch team players")
  }
  return (await res.json()) as {
    player_name: string
    mlbid?: string
    idfg: string
    position: string
  }[]
}

export async function addPlayerToTeam(
  teamId: number,
  player: { player_name: string; mlbid?: string; idfg: string; position: string }
) {
  const res = await fetch(`${API_URL}/api/teams/${teamId}/add-player`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Failed to add player")
  }
  return res.json()
}

export async function removePlayerFromTeam(teamId: number, playerName: string) {
  const res = await fetch(`${API_URL}/api/teams/${teamId}/remove-player/${playerName}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Failed to remove player")
  }
  return res.json()
}
