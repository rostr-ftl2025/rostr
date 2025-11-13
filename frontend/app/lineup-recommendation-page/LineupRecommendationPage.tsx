import React, { useEffect, useState } from "react";

interface Pitcher {
  name: string;
  position: string;
  score?: number;
  rank?: number;
}

export default function LineupRecommendationPage() {
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const teamId = search.get("teamId");
  const [lineup, setLineup] = useState<Pitcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setError("No team selected.");
      setLoading(false);
      return;
    }

    const fetchLineup = async () => {
      try {
        const res = await fetch(
          `http://localhost:5006/api/teams/${teamId}/recommend-lineup`
        );
        if (!res.ok) throw new Error("Failed to fetch lineup recommendations");
        const data = await res.json();
        setLineup(data);
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchLineup();
  }, [teamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5DBD5] text-gray-900">
        <p className="text-lg">Generating lineup suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5DBD5] text-gray-900">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
        <p>{error}</p>
        <a
          href="/"
          className="mt-6 bg-[#562424] text-white px-4 py-2 rounded-xl hover:bg-[#734343]"
        >
          Back to Team Maker
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5DBD5] py-10 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Recommended Starting Lineup</h1>

      <div className="w-full max-w-2xl bg-white shadow rounded-2xl p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 font-semibold text-center">Rank</th>
              <th className="py-2 px-4 font-semibold">Name</th>
              <th className="py-2 px-4 font-semibold">Position</th>
              <th className="py-2 px-4 font-semibold text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {lineup.map((p, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4 text-center font-bold text-[#562424]">
                  {index + 1}
                </td>
                <td className="py-2 px-4">{p.name}</td>
                <td className="py-2 px-4">{p.position}</td>
                <td className="py-2 px-4 text-right font-semibold text-[#562424]">
                  {p.score?.toFixed(2) ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={() =>
            window.location.href = `/grading-display?teamId=${teamId}`
          }
          className="bg-[#562424] text-white px-4 py-2 rounded-xl hover:bg-[#734343]"
        >
          Back to Grades
        </button>
      </div>
    </div>
  );
}
