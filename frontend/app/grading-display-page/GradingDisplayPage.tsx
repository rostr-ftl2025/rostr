import React, { useEffect, useState } from "react";

interface Pitcher {
  player_name: string;
  position: string;
  grade?: number | string;
}

export default function GradingDisplayPage() {
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const teamId = search.get("teamId");
  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setError("No team selected.");
      setLoading(false);
      return;
    }

    const fetchPitchers = async () => {
      try {
        const res = await fetch(`http://localhost:5006/api/teams/${teamId}/players`);
        if (!res.ok) throw new Error("Failed to fetch pitchers");
        const data = await res.json();
        setPitchers(data);
      } catch (e: any) {
        setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPitchers();
  }, [teamId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F5DBD5] text-gray-900">
        <p className="text-lg">Loading pitcher grades...</p>
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
    <div className="flex flex-col items-center min-h-screen bg-[#F5DBD5] py-10 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">Pitcher Grades</h1>

      <p className="text-xl mb-6">
        <span className="font-semibold">Team Average Grade:</span>{" "}
        <span className="text-[#562424] font-bold">{avgGrade}</span>
      </p>

      <div className="w-full max-w-2xl bg-white shadow rounded-2xl p-6">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 px-4 font-semibold">Name</th>
              <th className="py-2 px-4 font-semibold">Position</th>
              <th className="py-2 px-4 font-semibold text-right">Grade</th>
            </tr>
          </thead>
          <tbody>
            {pitchers.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  No pitchers found for this team.
                </td>
              </tr>
            ) : (
              pitchers.map((p, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="py-2 px-4">{p.player_name}</td>
                  <td className="py-2 px-4">{p.position}</td>
                  <td className="py-2 px-4 text-right font-semibold text-[#562424]">
                    {p.grade ?? "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <a
        href="/"
        className="mt-8 bg-[#562424] text-white px-4 py-2 rounded-xl hover:bg-[#734343]"
      >
        Back to Team Maker
      </a>
    </div>
  );
}

