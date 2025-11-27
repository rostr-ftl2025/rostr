import React, { useEffect, useState } from "react";
import { API_URL } from "~/config";

interface OpponentPitcher {
  player_name: string;
  position: string;
  grade: number;
  weaknesses: string;
}

interface OpponentData {
  opponent_team_id: number;
  average_grade: number;
  pitchers: OpponentPitcher[];
}

export default function OpponentWeaknessesPage() {
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const opponentTeamId = search.get("opponentTeamId");
  const teamId = search.get("teamId");
  
  const [opponentData, setOpponentData] = useState<OpponentData | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!opponentTeamId) {
      setError("No opponent team ID provided.");
      setLoading(false);
      return;
    }

    const fetchOpponentWeaknesses = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/opponent/${opponentTeamId}/weaknesses`
        );
        if (!res.ok) throw new Error("Failed to fetch opponent weaknesses");
        const data = await res.json();
        setOpponentData(data);
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpponentWeaknesses();
  }, [opponentTeamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
        <p className="text-lg">Analyzing opponent team...</p>
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

  if (!opponentData) {
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-10 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">
        Opponent Team Analysis
      </h1>

      <p className="text-xl mb-6">
        <span className="font-semibold">Opponent Average Grade:</span>{" "}
        <span className="text-red-600 font-bold">{opponentData.average_grade}</span>
      </p>

      <div className="w-full max-w-2xl mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
        <h2 className="text-xl font-bold mb-2 text-red-700">
          Scouting Report
        </h2>
        <p className="text-sm text-gray-700">
          This page shows only the <strong>weaknesses</strong> of your opponent's pitchers.
          Use this intelligence to build a counter-strategy and exploit their vulnerabilities.
        </p>
      </div>

      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border bg-red-50 shadow mb-8">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-red-200 text-lg">
            <tr>
              <th className="px-3 py-2 font-semibold">Pitcher</th>
              <th className="px-3 py-2 font-semibold text-right">Grade</th>
              <th className="px-3 py-2 font-semibold text-right">Weaknesses</th>
            </tr>
          </thead>
          <tbody>
            {opponentData.pitchers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                  No opponent pitchers found.
                </td>
              </tr>
            ) : (
              opponentData.pitchers.map((p, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="border-t bg-white hover:cursor-pointer hover:bg-red-50"
                    onClick={() => setExpanded(expanded === index ? null : index)}
                  >
                    <td className="px-3 py-2 font-medium">{p.player_name}</td>
                    <td className="px-3 py-2 text-gray-700 text-right font-semibold text-red-600">
                      {p.grade}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <a className="text-red-600 hover:underline">
                        {expanded === index ? "Hide" : "View"}
                      </a>
                    </td>
                  </tr>

                  {expanded === index && p.weaknesses && (
                    <tr className="bg-red-50">
                      <td colSpan={3} className="px-3 py-4">
                        <div className="bg-white p-3 rounded border border-red-200">
                          <h4 className="font-bold text-red-700 mb-2">
                            Exploitable Weaknesses:
                          </h4>
                          <p className="whitespace-pre-wrap text-sm text-gray-700">
                            {p.weaknesses}
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

      <div className="mt-8 flex flex-col items-center gap-4">
        {teamId && (
          <a
            href={`/counter-lineup?opponentTeamId=${opponentTeamId}&teamId=${teamId}`}
            className="rounded-xl bg-green-600 text-white border border-green-600 px-6 py-2 text-sm font-semibold shadow hover:bg-green-700 transition-all"
          >
            Build Counter Lineup
          </a>
        )}
      </div>
    </div>
  );
}
