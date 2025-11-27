import React, { useEffect, useState } from "react";
import { API_URL } from "~/config";
import { getUserFromJWT } from "~/utils/getToken";

interface Pitcher {
  player_name: string;
  position: string;
  grade?: number | string;
  analysis?: string;
  // added optional fields for recommendation
  rank?: number;
  score?: number;
}

export default function GradingDisplayPage() {
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const teamId = search.get("teamId");
  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  // store original order to allow clearing recommendation
  const [originalPitchers, setOriginalPitchers] = useState<Pitcher[]>([]);

  // recommendation-related state
  const [recLoading, setRecLoading] = useState(false);
  const [recExplanation, setRecExplanation] = useState<string>("");
  const [recError, setRecError] = useState<string | null>(null);

  // whether to show the Rank column (becomes true when user clicks to view recommendations)
  const [showRanks, setShowRanks] = useState(false);

  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileSelect, setShowProfileSelect] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("standard");
  const [opponentTeamId, setOpponentTeamId] = useState<string | null>(null);

  const profiles = [
    { key: "standard", label: "Standard (Balanced)" },
    { key: "strikeout", label: "Strikeout" },
    { key: "control", label: "Control" },
    { key: "groundball", label: "Groundball" },
    { key: "clutch", label: "Clutch" },
    { key: "sabermetrics", label: "Sabermetrics" },
  ];

  useEffect(() => {
    // Get opponent team ID from JWT token
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const userData = getUserFromJWT(token);
      if (userData?.opponentTeamID) {
        setOpponentTeamId(userData.opponentTeamID);
      }
    }

    if (!teamId) {
      setError("No team selected.");
      setLoading(false);
      return;
    }

    const fetchPitchers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/teams/${teamId}/players`);
        if (!res.ok) throw new Error("Failed to fetch pitchers");
        const data = await res.json();
        setPitchers(data);
        setOriginalPitchers(data); // capture original order
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPitchers();
  }, [teamId]);

  // Fetch recommended lineup and apply ranking to local pitchers list
  const applyRecommendation = async () => {
    if (!teamId) return;
    // show the Rank column as soon as user requests a recommendation
    setShowRanks(true);
    setRecError(null);
    setRecLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/teams/${teamId}/recommend-lineup?profile=${selectedProfile}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to get recommendation");
      }
      const data = await res.json();
      const lineup = data.lineup || [];
      const explanation = data.explanation || "";
      setRecExplanation(explanation);

      // build name -> rank & score mapping
      const map = new Map<string, { rank?: number; score?: number }>();
      lineup.forEach((item: any, idx: number) => {
        const name = (item.name || item.player_name || "").toString().trim();
        map.set(name, { rank: item.rank ?? idx + 1, score: item.score });
      });

      // apply ranks to current pitchers; try to match by player_name
      const updated = pitchers.map((p) => {
        const key = p.player_name?.toString().trim() || "";
        const match = map.get(key);
        if (match) {
          return { ...p, rank: match.rank, score: match.score };
        }
        // also try case-insensitive match if exact didn't work
        const ciMatchEntry = Array.from(map.entries()).find(
          ([k]) => k.toLowerCase() === key.toLowerCase()
        );
        if (ciMatchEntry) {
          return { ...p, rank: ciMatchEntry[1].rank, score: ciMatchEntry[1].score };
        }
        return { ...p, rank: undefined, score: undefined };
      });

      // sort so ranked pitchers appear first in rank order, others follow original relative order
      const ranked = updated
        .slice()
        .sort((a, b) => {
          const ra = typeof a.rank === "number" ? a.rank : Infinity;
          const rb = typeof b.rank === "number" ? b.rank : Infinity;
          return ra - rb;
        });

      setPitchers(ranked);
    } catch (e: any) {
      setRecError(e.message || "Something went wrong fetching recommendation.");
    } finally {
      setRecLoading(false);
    }
  };

  const clearRecommendation = () => {
    setPitchers(originalPitchers);
    setRecExplanation("");
    setRecError(null);
    // hide Rank column when clearing recommendation
    setShowRanks(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
        <p className="text-lg">Loading pitcher grades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{error}</p>
        <a
          href="/team-maker"
          className="mt-6 bg-[#562424] text-white px-4 py-2 rounded-xl hover:bg-[#734343]"
        >
          Back to Team Maker
        </a>
      </div>
    );
  }

  const avgGrade =
    pitchers.length > 0
      ? (
          pitchers.reduce(
            (sum, p) => sum + (typeof p.grade === "number" ? p.grade : 0),
            0
          ) / pitchers.length
        ).toFixed(1)
      : "N/A";


  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-10 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Pitcher Grades</h1>

      <p className="text-xl mb-6">
        <span className="font-semibold">Team Average Grade:</span>{" "}
        <span className="text-[#562424] font-bold">{avgGrade}</span>
      </p>


    <div className="flex flex-col items-center gap-4">
        {!showProfileSelect ? (
          <>
            <button
              onClick={() => setShowProfileSelect(true)}
              className="rounded-xl bg-sky-400 text-white border border-sky-400 px-6 py-2 text-sm font-semibold shadow hover:bg-sky-500 transition-all hover:cursor-pointer"
            >
              Suggest Starting Rotation
            </button>
          </>
        ) : (
          <div className="bg-sky-50 border rounded-2xl shadow p-4 flex flex-col items-center space-y-3">
            <label htmlFor="profile" className="font-semibold text-gray-800">
              Choose Your Rotation Strategy:
            </label>
            <select
              id="profile"
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="border rounded-lg p-2 bg-white text-gray-800 focus:outline-none hover:cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>

            <div className="flex gap-3 mt-3">
              {/* Changed from redirect link to button that updates ranking in-place */}
              <button
                onClick={applyRecommendation}
                disabled={recLoading}
                className="rounded-xl bg-sky-400 text-white border border-sky-400 px-4 py-2 text-sm font-semibold shadow hover:bg-sky-500 disabled:opacity-60 hover:cursor-pointer"
              >
                {recLoading ? "Generating..." : "View Recommended Starting Rotation"}
              </button>

              <button
                onClick={() => {
                  setShowProfileSelect(false);
                  setRecError(null);
                }}
                className="rounded-xl bg-gray-200 text-black px-4 py-2 text-sm font-semibold shadow hover:bg-gray-300 hover:cursor-pointer"
              >
                Cancel
              </button>

              {/* If a recommendation has been applied, allow clearing it */}
              {recExplanation && (
                <button
                  onClick={clearRecommendation}
                  className="rounded-xl bg-red-200 text-black px-4 py-2 text-sm font-semibold shadow hover:bg-red-300 hover:cursor-pointer"
                >
                  Clear Recommendation
                </button>
              )}
            </div>

            {/* Show explanation or error from recommendation API */}
            {recLoading && <p className="text-sm text-gray-600 mt-2">Generating recommendation...</p>}
            {recError && <p className="text-sm text-red-600 mt-2">{recError}</p>}
            {recExplanation && !recLoading && (
              <p className="max-w-2xl text-center text-sm text-gray-700 mt-3">{recExplanation}</p>
            )}
          </div>
        )}
      </div>
      

      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border bg-sky-50 shadow my-8">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sky-200 text-lg">
            <tr>
              {/* Rank column is hidden until user requests recommendations */}
              {showRanks && <th className="px-3 py-2 font-semibold text-center">Rank</th>}
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold text-right">Grade</th>
              <th className="px-3 py-2 font-semibold text-right">Analysis</th>
            </tr>
          </thead>
          <tbody>
            {pitchers.length === 0 ? (
              <tr>
                <td colSpan={showRanks ? 4 : 3} className="px-3 py-4 text-center text-gray-500">
                  No pitchers found for this team.
                </td>
              </tr>
            ) : (
              pitchers.map((p, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="border-t bg-white hover:cursor-pointer hover:bg-sky-100"
                    onClick={() => setExpanded(expanded === index ? null : index)}
                  >
                    {showRanks && (
                      <td className="px-4 py-3 text-base font-medium text-center">
                        {typeof p.rank === "number" ? p.rank : "-"}
                      </td>
                    )}
                    <td className="px-4 py-3 text-base font-medium">{p.player_name}</td>
                    <td className="px-4 py-3 text-gray-700 text-right text-base font-semibold text-[#562424]">
                      {p.grade ?? "N/A"}
                    </td>
                    <td className="px-4 py-3 text-right text-base">
                      {p.analysis ? (
                        <a className="text-sky-700 hover:underline">
                          {expanded === index ? "Hide" : "View"}
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>

                  {expanded === index && p.analysis && (
                    <tr className="bg-sky-50">
                      <td colSpan={showRanks ? 4 : 3} className="px-3 py-4">
                        <div className="bg-white p-3 rounded border border-sky-200">
                          <h4 className="font-bold text-sky-700 mb-2">Detailed Analysis:</h4>
                          <p className="whitespace-pre-wrap text-sm text-gray-700">
                            {p.analysis}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 m-12 px-4">

        {/* Pitcher Grade Scale */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Pitcher Grade Scale</h2>
          <div className="overflow-hidden rounded-2xl border bg-sky-100 shadow">
        <table className="min-w-full text-left text-base">
          <thead className="bg-sky-200">
            <tr>
          <th className="px-3 py-2">Tier</th>
          <th className="px-3 py-2">Grade Range</th>
          <th className="px-3 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Elite</td>
          <td className="px-3 py-2">&gt; 80</td>
          <td className="px-3 py-2">Must-start fantasy aces.</td>
            </tr>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Top</td>
          <td className="px-3 py-2">70–80</td>
          <td className="px-3 py-2">Reliable, high-end starters.</td>
            </tr>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Solid</td>
          <td className="px-3 py-2">60–70</td>
          <td className="px-3 py-2">Good, matchup-dependent starters.</td>
            </tr>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Replacement</td>
          <td className="px-3 py-2">45–60</td>
          <td className="px-3 py-2">Streamers; risky ratios.</td>
            </tr>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Poor</td>
          <td className="px-3 py-2">&lt; 45</td>
          <td className="px-3 py-2">Hurts ERA/WHIP; avoid.</td>
            </tr>
          </tbody>
        </table>
          </div>
        </div>

        {/* Team Grade Scale */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Team Average Grade Scale</h2>
          <div className="overflow-hidden rounded-2xl border bg-sky-100 shadow">
        <table className="min-w-full text-left text-base">
          <thead className="bg-sky-200">
            <tr>
          <th className="px-3 py-2">Team Tier</th>
          <th className="px-3 py-2">Avg Grade Range</th>
          <th className="px-3 py-2">Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Excellent Team</td>
          <td className="px-3 py-2">&gt; 75</td>
          <td className="px-3 py-2">Elite pitching staff.</td>
            </tr>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Very Good</td>
          <td className="px-3 py-2">65–75</td>
          <td className="px-3 py-2">Competitive every week.</td>
            </tr>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Average</td>
          <td className="px-3 py-2">55–65</td>
          <td className="px-3 py-2">Solid but needs upgrades.</td>
            </tr>
            <tr className="border-t bg-white">
          <td className="px-3 py-2 font-semibold">Weak</td>
          <td className="px-3 py-2">&lt; 55</td>
          <td className="px-3 py-2">Below-average team.</td>
            </tr>
          </tbody>
        </table>
          </div>
        </div>
      </div>

      
    </div>
  );
}