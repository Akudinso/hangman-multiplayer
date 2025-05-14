// // src/components/Leaderboard.tsx
// import { useEffect, useState } from "react";
// import { socket } from "@/lib/socket";

// interface LeaderboardEntry {
//   wallet: string;
//   wins: number;
//   losses: number;
// }

// export default function Leaderboard() {
//   const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);

//   useEffect(() => {
//     socket.emit("get_leaderboard");

//     socket.on("leaderboard_data", (data) => {
//       setLeaders(data);
//     });

//     return () => {
//       socket.off("leaderboard_data");
//     };
//   }, []);

//   return (
//     <div style={{ marginTop: "3rem", textAlign: "center" }}>
//       <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🏆 Top Players</h2>
//       {leaders.length === 0 ? (
//         <p>No leaderboard data yet.</p>
//       ) : (
//         <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
//           <thead>
//             <tr>
//               <th style={thStyle}>#</th>
//               <th style={thStyle}>Wallet</th>
//               <th style={thStyle}>Wins</th>
//               <th style={thStyle}>Losses</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leaders.map((entry, idx) => (
//               <tr key={entry.wallet}>
//                 <td style={tdStyle}>{idx + 1}</td>
//                 <td style={tdStyle}>{shortWallet(entry.wallet)}</td>
//                 <td style={tdStyle}>{entry.wins}</td>
//                 <td style={tdStyle}>{entry.losses}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// const thStyle = {
//   border: "1px solid #ccc",
//   padding: "0.5rem",
//   backgroundColor: "#f3f4f6",
//   fontWeight: "bold" as const,
// };

// const tdStyle = {
//   border: "1px solid #ccc",
//   padding: "0.5rem",
// };

// function shortWallet(address: string) {
//   return address.slice(0, 6) + "..." + address.slice(-4);
// }
