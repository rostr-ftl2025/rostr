import React, { useState } from "react";

interface PitcherData {
  IDfg: string;
  Name: string;
  Team: string;
  Age: number;
  W: number;
  L: number;
  start?: number;
  end?: number;
  loadingYears?: boolean;
  errorYears?: string;
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

  const handleFindYears = async (idfg: string, index: number) => {
    setData((prev) => {
      const newData = [...prev];
      newData[index] = { ...newData[index], loadingYears: true, errorYears: undefined };
      return newData;
    });

    try {
      const res = await fetch(`http://127.0.0.1:6969/api/get-player-years?fangraph_id=${idfg}`);
      if (!res.ok) throw new Error("Failed to fetch years");
      const json: { start: number; end: number } = await res.json();
      setData((prev) => {
        const newData = [...prev];
        newData[index] = { ...newData[index], start: json.start, end: json.end, loadingYears: false };
        return newData;
      });
    } catch (err) {
      console.error("Error fetching player years", err);
      setData((prev) => {
        const newData = [...prev];
        newData[index] = { ...newData[index], loadingYears: false, errorYears: "Error loading years" };
        return newData;
      });
    }
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
              <th>Years Played</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td>{row.Name}</td>
                <td>{row.Team}</td>
                <td>{row.Age}</td>
                <td>{row.W}</td>
                <td>{row.L}</td>
                <td>
                  {row.start && row.end ? (
                    <span>
                      {row.start} - {row.end}
                    </span>
                  ) : row.loadingYears ? (
                    <span>Loading...</span>
                  ) : row.errorYears ? (
                    <span>{row.errorYears}</span>
                  ) : (
                    <button onClick={() => handleFindYears(row.IDfg, idx)}>
                      find years played
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}