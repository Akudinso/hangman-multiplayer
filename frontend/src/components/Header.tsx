// import { ConnectWallet } from "@thirdweb-dev/react";
// import { useDarkMode } from "@/context/DarkModeContext";
// import { useEffect, useState } from "react";
// import { socket } from "@/lib/socket";

// const Header = () => {
//   const { darkMode, toggleDarkMode } = useDarkMode();
//   const [tokenBalance, setTokenBalance] = useState("0");
//   const [balanceHistory, setBalanceHistory] = useState<string[]>([]);
//   const [showHistory, setShowHistory] = useState(false);

//   useEffect(() => {
//     socket.on("balance_data", ({ balance }) => {
//       setBalanceHistory(prev => [balance, ...prev.slice(0, 4)]);
//       setTokenBalance(balance);
//     });

//     socket.emit("get_balance");

//     return () => {
//       socket.off("balance_data");
//     };
//   }, []);

//   return (
//     <header
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         padding: "1rem 2rem",
//         backgroundColor: darkMode ? "#111" : "#f9f9f9",
//         borderBottom: "1px solid #ccc",
//       }}
//     >
//       <h1 className="logo-title" style={{ fontSize: "2rem" }}>
//         🎮 Web3 Hangman
//       </h1>

//       <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
//         {/* 💰 Token Balance */}
//         <div style={{ position: "relative" }}>
//           <button
//             onClick={() => setShowHistory(!showHistory)}
//             style={{
//               backgroundColor: "#16a34a",
//               color: "#fff",
//               padding: "0.5rem 1rem",
//               borderRadius: "6px",
//               fontWeight: "bold",
//               border: "none",
//               cursor: "pointer",
//               transition: "transform 0.3s ease",
//               transform: showHistory ? "scale(1.05)" : "scale(1)",
//             }}
//           >
//             💰 {tokenBalance} Tokens
//           </button>

//           {showHistory && (
//             <div
//               style={{
//                 position: "absolute",
//                 top: "120%",
//                 left: 0,
//                 backgroundColor: darkMode ? "#222" : "#fff",
//                 color: darkMode ? "#fff" : "#111",
//                 border: "1px solid #ccc",
//                 borderRadius: "6px",
//                 padding: "0.5rem 1rem",
//                 minWidth: "160px",
//                 zIndex: 10,
//                 boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
//               }}
//             >
//               <p style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>🔁 Token History</p>
//               <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//                 {balanceHistory.map((b, i) => (
//                   <li key={i} style={{ marginBottom: "0.25rem" }}>
//                     {i === 0 ? "🔹 Current: " : `🔸 Prev ${i}: `}{b}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* 🔌 Wallet Connect */}
//         <ConnectWallet />

//         {/* 🌙 Dark Mode Toggle */}
//         <button
//           onClick={toggleDarkMode}
//           style={{
//             backgroundColor: darkMode ? "#f5f5f5" : "#111",
//             color: darkMode ? "#111" : "#f5f5f5",
//             border: "none",
//             padding: "0.5rem 1rem",
//             borderRadius: "6px",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           {darkMode ? "☀️ Light" : "🌙 Dark"}
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;
