import React, { useState } from "react";

interface PitcherData {
  Name: string;
  Team: string;
  Age: number;
  W: number;
  L: number;
}

export default function PitcherSearch() {
  const [season, setSeason] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<PitcherData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setData([]);
    try {
      const params = new URLSearchParams();
      if (season) params.append("season", season);
      if (name) params.append("name", name);

      const res = await fetch(`http://127.0.0.1:6969/api/search-pitcher?${params.toString()}`);
      if (!res.ok) throw new Error("Network response was not ok");

      const json: PitcherData[] = await res.json();
      if (json.length === 0) {
        setError("No pitchers found for the given criteria.");
      } else {
        setData(json);
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setError("Failed to fetch pitcher data. Please try again.");
    }
    setLoading(false);
  };

  const columns: (keyof PitcherData)[] = ["Name", "Team", "Age", "W", "L"];

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Season year"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
        />
        <input
          type="text"
          placeholder="Player name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}