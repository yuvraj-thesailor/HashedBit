import { useEffect, useState } from "react";

const API_URL = "https://my-json-server.typicode.com/FreSauce/json-ipl/data";

export default function IPLPointsTable() {
  const [teams, setTeams] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

  useEffect(() => {
    let cancelled = false;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data].sort((a, b) => a.NRR - b.NRR);
        setTeams(sorted);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0B1C2C] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-10 w-1.5 rounded-full bg-[#F7B500]" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              IPL 2022 Points Table
            </h1>
            <p className="text-sm text-[#8FA3B8]">Sorted by Net Run Rate, lowest to highest</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#1E3A52] shadow-xl">
          {status === "loading" && (
            <div className="bg-[#0F2437] py-16 text-center text-[#8FA3B8]">
              Loading standings…
            </div>
          )}

          {status === "error" && (
            <div className="bg-[#0F2437] py-16 text-center text-[#F87171]">
              Couldn&apos;t load the points table. Please try again.
            </div>
          )}

          {status === "ready" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#123249] text-[#8FA3B8] text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Team</th>
                    <th className="px-4 py-3 font-semibold text-center">M</th>
                    <th className="px-4 py-3 font-semibold text-center">W</th>
                    <th className="px-4 py-3 font-semibold text-center">L</th>
                    <th className="px-4 py-3 font-semibold text-center">T</th>
                    <th className="px-4 py-3 font-semibold text-center">NRR</th>
                    <th className="px-4 py-3 font-semibold text-center">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, idx) => (
                    <tr
                      key={team.No}
                      className={`border-t border-[#1E3A52] text-sm ${
                        idx % 2 === 0 ? "bg-[#0F2437]" : "bg-[#0D2033]"
                      } hover:bg-[#173049] transition-colors`}
                    >
                      <td className="px-4 py-3 text-[#8FA3B8]">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-white">{team.Team}</td>
                      <td className="px-4 py-3 text-center text-[#C7D5E0]">{team.Matches}</td>
                      <td className="px-4 py-3 text-center text-[#4ADE80]">{team.Won}</td>
                      <td className="px-4 py-3 text-center text-[#F87171]">{team.Lost}</td>
                      <td className="px-4 py-3 text-center text-[#C7D5E0]">{team.Tied}</td>
                      <td
                        className={`px-4 py-3 text-center font-mono ${
                          team.NRR >= 0 ? "text-[#4ADE80]" : "text-[#F87171]"
                        }`}
                      >
                        {team.NRR > 0 ? "+" : ""}
                        {team.NRR.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-[#F7B500]">
                        {team.Points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
