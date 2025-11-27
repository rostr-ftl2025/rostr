import React, { useEffect, useState } from "react";
import { API_URL } from "~/config";

interface LineupPitcher {
  rank: number;
  name: string;
  position: string;
  score: number;
}

interface OpponentWeaknesses {
  summary: string;
  avg_k: number;
  avg_era: number;
}

interface CounterLineupData {
  lineup: LineupPitcher[];
  explanation: string;
  strategy: string;
  opponent_weaknesses: OpponentWeaknesses;
}

export default function CounterLineupPage() {
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const opponentTeamId = search.get("opponentTeamId");
  const teamId = search.get("teamId");

  const [lineupData, setLineupData] = useState<CounterLineupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!opponentTeamId || !teamId) {
      setError("Missing team IDs.");
      setLoading(false);
      return;
    }

    const fetchCounterLineup = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/opponent/${opponentTeamId}/counter-lineup/${teamId}`
        );
        if (!res.ok) throw new Error("Failed to fetch counter lineup");
        const data = await res.json();
        setLineupData(data);
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchCounterLineup();
  }, [opponentTeamId, teamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
        <p className="text-lg">Building optimal counter lineup...</p>
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

  if (!lineupData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-10 text-gray-900">
      <h1 className="text-4xl font-bold mb-4 text-green-600">
        Counter Lineup Strategy
      </h1>

      <div className="w-full max-w-3xl mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
        <h2 className="text-2xl font-bold mb-3 text-green-700">
          📊 Opponent Scouting Summary
        </h2>
        <p className="text-lg mb-2">
          <strong>Weaknesses Identified:</strong> {lineupData.opponent_weaknesses.summary}
        </p>
        <p className="text-sm text-gray-700">
          Avg K%: {lineupData.opponent_weaknesses.avg_k}% | 
          Avg ERA: {lineupData.opponent_weaknesses.avg_era}
        </p>
      </div>

      <div className="w-full max-w-3xl mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <h2 className="text-2xl font-bold mb-3 text-blue-700">
          🎯 Counter-Strategy Explanation
        </h2>
        <p className="text-sm mb-2">
          <strong>Selected Strategy:</strong>{" "}
          <span className="text-blue-600 font-bold uppercase">
            {lineupData.strategy}
          </span>
        </p>
        <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
          {lineupData.explanation}
        </pre>
      </div>

      <h2 className="text-2xl font-bold mb-4">Recommended Starting Rotation</h2>

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-green-50 shadow mb-8">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-green-200">
            <tr>
              <th className="px-3 py-2 font-semibold">Rank</th>
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Position</th>
              <th className="px-3 py-2 font-semibold text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {lineupData.lineup.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  No lineup recommendations available.
                </td>
              </tr>
            ) : (
              lineupData.lineup.map((p, index) => (
                <tr key={index} className="border-t bg-white">
                  <td className="px-3 py-2 font-bold text-green-600">
                    #{p.rank}
                  </td>
                  <td className="px-3 py-2 font-medium">{p.name}</td>
                  <td className="px-3 py-2 text-gray-700">{p.position}</td>
                  <td className="px-3 py-2 text-gray-700 text-right font-semibold">
                    {p.score}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <a
          href={`/opponent-weaknesses?opponentTeamId=${opponentTeamId}&teamId=${teamId}`}
          className="rounded-xl bg-red-600 text-white border border-red-600 px-6 py-2 text-sm font-semibold shadow hover:bg-red-700 transition-all"
        >
          View Opponent Weaknesses
        </a>
      </div>
    </div>
  );
}
