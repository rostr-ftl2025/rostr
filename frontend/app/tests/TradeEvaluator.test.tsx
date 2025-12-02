import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import TradeEvaluator from "./TradeEvaluator"
import * as api from "~/team-maker-page/api/teamRoster"

// --- 1. MOCK THE API DEPENDENCIES ---
// We mock the specific API functions so we don't hit the real backend
jest.mock("~/team-maker-page/api/teamRoster", () => ({
  fetchTeamPlayers: jest.fn(),
  fetchPitchers: jest.fn(),
}))

// Mock global fetch for the evaluate endpoint
global.fetch = jest.fn()

// --- 2. DUMMY DATA ---
const MOCK_TEAM_PLAYERS = [
  { player_name: "Gerrit Cole", idfg: "12345", position: "SP" },
  { player_name: "Aaron Judge", idfg: "67890", position: "OF" },
]

const MOCK_SEARCH_RESULTS = [
  { IDfg: "54321", Name: "Paul Skenes", Team: "PIT", Age: 22, W: 10, L: 2 },
]

const MOCK_WIN_RESULT = {
  sideA: { total_grade: 90 },
  sideB: { total_grade: 50 },
  diff: 40,
  winner: "Your Team", // You win
  fairness_pct: 55,
  suggestion: "Great trade for you.",
  profile: "standard",
  profile_explanation: "Standard analysis.",
}

const MOCK_LOSS_RESULT = {
  sideA: { total_grade: 20 },
  sideB: { total_grade: 80 },
  diff: -60,
  winner: "Other Team", // You lose
  fairness_pct: 25,
  suggestion: "Bad trade.",
  profile: "standard",
  profile_explanation: "Standard analysis.",
}

describe("TradeEvaluator Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default setup: Team players load successfully
    ;(api.fetchTeamPlayers as jest.Mock).mockResolvedValue(MOCK_TEAM_PLAYERS)
  })

  // --- UI RENDERING TESTS ---

  test("renders the header and instructions", async () => {
    render(<TradeEvaluator />)
    expect(screen.getByText("Trade Evaluator")).toBeInTheDocument()
    expect(screen.getByText(/Choose which players/i)).toBeInTheDocument()
  })

  test("loads and displays 'My Team' players", async () => {
    render(<TradeEvaluator />)
    
    await waitFor(() => {
      expect(screen.getByText("Gerrit Cole")).toBeInTheDocument()
      expect(screen.getByText("Aaron Judge")).toBeInTheDocument()
    })
  })

  test("displays 'No team selected' warning if URL param is missing", () => {
    // Mock window.location.search to be empty
    Object.defineProperty(window, "location", {
      value: { search: "" },
      writable: true,
    })
    
    render(<TradeEvaluator />)
    expect(screen.getByText(/No team selected/i)).toBeInTheDocument()
  })

  // --- INTERACTION TESTS ---

  test("user can select a player from their team", async () => {
    render(<TradeEvaluator />)
    await waitFor(() => screen.getByText("Gerrit Cole"))

    const checkbox = screen.getAllByRole("checkbox")[0]
    fireEvent.click(checkbox)

    // Check if the summary text updates
    expect(screen.getByText(/Selected:.*1/)).toBeInTheDocument()
    expect(screen.getByText("(Gerrit Cole)")).toBeInTheDocument()
  })

  test("user can search and add an opponent player", async () => {
    ;(api.fetchPitchers as jest.Mock).mockResolvedValue(MOCK_SEARCH_RESULTS)
    render(<TradeEvaluator />)

    // Find search input
    const input = screen.getByPlaceholderText(/e.g., Zac Gallen/i)
    fireEvent.change(input, { target: { value: "Skenes" } })

    // Wait for API call
    await waitFor(() => {
      expect(api.fetchPitchers).toHaveBeenCalledWith({ name: "Skenes" })
    })

    // Click "Add" button on the result
    const addButton = screen.getByText("Add")
    fireEvent.click(addButton)

    // Verify player is added to the "Selected pitchers" chips area
    // We look for the Name inside the chips section
    expect(screen.getByText("Paul Skenes")).toBeVisible()
  })

  // --- FULL INTEGRATION TEST (Happy Path) ---

  test("Full Flow: Select players -> Evaluate -> View 'Win' Result", async () => {
    // 1. Setup API Responses
    ;(api.fetchPitchers as jest.Mock).mockResolvedValue(MOCK_SEARCH_RESULTS)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => MOCK_WIN_RESULT,
    })

    render(<TradeEvaluator />)

    // 2. Select Gerrit Cole from My Team
    await waitFor(() => screen.getByText("Gerrit Cole"))
    fireEvent.click(screen.getAllByRole("checkbox")[0])

    // 3. Search and Add Paul Skenes
    const input = screen.getByPlaceholderText(/e.g., Zac Gallen/i)
    fireEvent.change(input, { target: { value: "Skenes" } })
    await waitFor(() => screen.getByText("Add"))
    fireEvent.click(screen.getByText("Add"))

    // 4. Click Evaluate
    const evalBtn = screen.getByText("Evaluate Trade")
    expect(evalBtn).not.toBeDisabled()
    fireEvent.click(evalBtn)

    // 5. Verify Loading State
    expect(screen.getByText("Analyzing...")).toBeInTheDocument()

    // 6. Verify Result Visualizer appears
    await waitFor(() => {
      expect(screen.getByText("Win for You")).toBeInTheDocument()
      expect(screen.getByText("Fairness: 55%")).toBeInTheDocument()
      expect(screen.getByText("Great trade for you.")).toBeInTheDocument()
    })
  })

  test("Visualizes a 'Loss' correctly", async () => {
    // Setup Loss Result
    ;(api.fetchPitchers as jest.Mock).mockResolvedValue(MOCK_SEARCH_RESULTS)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => MOCK_LOSS_RESULT,
    })

    render(<TradeEvaluator />)
    
    // Quick select players (abstracted steps)
    await waitFor(() => screen.getByText("Gerrit Cole"))
    fireEvent.click(screen.getAllByRole("checkbox")[0])
    
    const input = screen.getByPlaceholderText(/e.g., Zac Gallen/i)
    fireEvent.change(input, { target: { value: "Skenes" } })
    await waitFor(() => screen.getByText("Add"))
    fireEvent.click(screen.getByText("Add"))

    fireEvent.click(screen.getByText("Evaluate Trade"))

    // Verify Loss UI
    await waitFor(() => {
      expect(screen.getByText("Loss for You")).toBeInTheDocument()
      // Check for the Red color class (bg-rose-600) logic implicitly via text presence
      expect(screen.getByText("Bad trade.")).toBeInTheDocument()
    })
  })
})