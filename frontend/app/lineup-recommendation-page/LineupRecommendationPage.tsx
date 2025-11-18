import React, { useEffect, useState } from "react";
import { API_URL } from "~/config";

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
  const selectedProfile = search.get("profile");
  const [lineup, setLineup] = useState<Pitcher[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setError("No team selected.");
      setLoading(false);
      return;
    }

    const fetchLineup = () => {
      fetch(`${API_URL}/api/teams/${teamId}/recommend-lineup?profile=${selectedProfile}`)
        .then((res) =>
          res.ok
            ? res.json()
            : res.json().then((err) => Promise.reject(new Error(err?.error || "Request failed")))
        )
        .then((data) => {
            setLineup(data.lineup || []);  
            setExplanation(data.explanation || "");
        })
        .catch((e: any) => setError(e.message || "Something went wrong."))
        .finally(() => setLoading(false));
    };

    fetchLineup();
  }, [teamId, selectedProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
        <p className="text-lg">Generating lineup suggestions...</p>
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-white py-10 text-gray-900">
      <h1 className="text-4xl font-bold mb-6">Recommended Starting Lineup</h1>

      {/* Explanation Section */}
      <p className="max-w-3xl text-center text-gray-700 leading-relaxed mb-10 mx-auto px-4">
        {explanation}
      </p>

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-sky-100 shadow mb-16">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sky-200">
            <tr>
              <th className="px-3 py-2 font-semibold text-center">Rank</th>
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Suggested Position</th>
            </tr>
          </thead>
          <tbody>
            {lineup.map((p, index) => (
              <tr key={index} className="border-t bg-white">
                <td className="px-3 py-2 text-center font-bold text-[#562424]">{index + 1}</td>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2 text-gray-700">{p.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}