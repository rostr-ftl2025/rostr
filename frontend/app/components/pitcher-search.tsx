import React, { useState } from "react";

export default function PlayerSearch() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playerWar, setPlayerWar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPlayers([]);
    setPlayerWar(null);

    try {
      const response = await fetch(
        `http://127.0.0.1:6969/api/search-player?first_name=${encodeURIComponent(
          firstName
        )}&last_name=${encodeURIComponent(lastName)}`
      );
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPitcherWar = async (playerFullName) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:6969/api/get-pitcher-war?full_name=${encodeURIComponent(
          playerFullName
        )}&start_year=${encodeURIComponent(startYear)}&end_year=${encodeURIComponent(
          endYear
        )}`
      );
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setPlayerWar(data[0]);
      } else {
        setPlayerWar(null);
      }
    } catch (error) {
      console.error("Error fetching pitcher WAR:", error);
    }
  };

  return (
    <div>
      <h1>Search MLB Player</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : players.length > 0 ? (
        <div>
          <div>
            <input
              type="text"
              placeholder="Start Year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
            />
            <input
              type="text"
              placeholder="End Year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Player Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, idx) => {
                const fullName = `${player.name_first} ${player.name_last}`;
                return (
                  <tr key={idx}>
                    <td>{fullName}</td>
                    <td>
                      <button onClick={() => getPitcherWar(fullName)}>
                        Show WAR
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No players found.</p>
      )}

      {playerWar !== null && (
        <div>
          <h2>WAR</h2>
          <p>{playerWar}</p>
        </div>
      )}
    </div>
  );
}
