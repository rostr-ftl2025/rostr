import React, { useEffect, useState } from "react";
import { API_URL } from "~/config";

interface Pitcher {
  player_name: string;
  position: string;
  grade?: number | string;
  analysis?: string;
}

export default function GradingDisplayPage() {
  const search =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const teamId = search.get("teamId");
  const [pitchers, setPitchers] = useState<Pitcher[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfileSelect, setShowProfileSelect] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("standard");

  const profiles = [
    { key: "standard", label: "Standard (Balanced)" },
    { key: "strikeout", label: "Strikeout" },
    { key: "control", label: "Control" },
    { key: "groundball", label: "Groundball" },
    { key: "clutch", label: "Clutch" },
    { key: "sabermetrics", label: "Sabermetrics" },
  ];

  useEffect(() => {
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

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-sky-100 shadow mb-16">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-sky-200">
            <tr>
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Position</th>
              <th className="px-3 py-2 font-semibold text-right">Grade</th>
              <th className="px-3 py-2 font-semibold text-right">Analysis</th>
            </tr>
          </thead>
          <tbody>
            {pitchers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                  No pitchers found for this team.
                </td>
              </tr>
            ) : (
              pitchers.map((p, index) => (
                <React.Fragment key={index}>
                  <tr
                    className="border-t bg-white hover:cursor-pointer"
                    onClick={() => setExpanded(expanded === index ? null : index)}
                  >
                    <td className="px-3 py-2 font-medium">{p.player_name}</td>
                    <td className="px-3 py-2 text-gray-700">{p.position}</td>
                    <td className="px-3 py-2 text-gray-700 text-right font-semibold text-[#562424]">
                      {p.grade ?? "N/A"}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {p.analysis ? (
                        <a className="text-[#562424] hover:underline">
                          {expanded === index ? "Hide" : "View"}
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>

                  {expanded === index && p.analysis && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-3 py-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700">
                          {p.analysis}
                        </pre>
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
        <table className="min-w-full text-left text-sm">
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
        <table className="min-w-full text-left text-sm">
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

      <div className="mt-8 flex flex-col items-center gap-4">
        {!showProfileSelect ? (
          <>
            <button
              onClick={() => setShowProfileSelect(true)}
              className="rounded-xl bg-sky-400 text-white border border-sky-400 px-6 py-2 text-sm font-semibold shadow hover:bg-sky-500 transition-all"
            >
              Suggest Lineup
            </button>

            <a
              href="/team-maker"
              className="rounded-xl bg-gray-200 text-black px-6 py-2 text-sm font-semibold shadow hover:bg-gray-300 transition-all"
            >
              Back to Team Maker
            </a>
          </>
        ) : (
          <div className="bg-sky-50 border rounded-2xl shadow p-4 flex flex-col items-center space-y-3">
            <label htmlFor="profile" className="font-semibold text-gray-800">
              Choose Your Lineup Strategy:
            </label>
            <select
              id="profile"
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="border rounded-lg p-2 bg-white text-gray-800 focus:outline-none"
            >
              {profiles.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.label}
                </option>
              ))}
            </select>

            <div className="flex gap-3 mt-3">
              <a
                href={`/lineup-recommendation?teamId=${teamId}&profile=${selectedProfile}`}
                className="rounded-xl bg-sky-400 text-white border border-sky-400 px-4 py-2 text-sm font-semibold shadow hover:bg-sky-500"
              >
                View Recommended Lineup
              </a>

              <button
                onClick={() => setShowProfileSelect(false)}
                className="rounded-xl bg-gray-200 text-black px-4 py-2 text-sm font-semibold shadow hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}