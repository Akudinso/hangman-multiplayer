// src/components/gameBoard.tsx
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useAddress } from "@thirdweb-dev/react";
import { shortenAddress } from "@/utils/shorten"; // You can create this tiny helper!

const GameBoard = () => {
  const address = useAddress();
  const [walletRegistered, setWalletRegistered] = useState(false);

  const [roomId, setRoomId] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [playerId, setPlayerId] = useState("");
  const [status, setStatus] = useState("");
  const [game, setGame] = useState<any>(null);
  const [guess, setGuess] = useState("");
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // 🚀 Initial socket setup
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("🟢 Connected:", socket.id);
      setPlayerId(socket.id ?? "");

      if (address) {
        socket.emit("register_wallet", { wallet: address });
        console.log("🔗 Wallet registered:", address);
        setWalletRegistered(true);
      }
    });

    socket.on("room_created", () => {
      console.log("🏠 Room created!");
      setStatus("Waiting for opponent...");
    });

    socket.on("game_started", (data) => {
      console.log("🎯 Game started:", data);
      setGame(data);
      setStatus("");
    });

    socket.on("game_update", (data) => {
      setGame(data);
    });

    socket.on("leaderboard_data", (data) => {
      console.log("🏆 Leaderboard updated:", data);
      setLeaderboard(data);
    });

    socket.on("error", (data) => {
      setStatus(data.message || "Something went wrong.");
    });

    return () => {
      socket.off("connect");
      socket.off("room_created");
      socket.off("game_started");
      socket.off("game_update");
      socket.off("leaderboard_data");
      socket.off("error");
    };
  }, [address]);

  // 🔥 Gameplay Actions
  const createRoom = () => {
    if (!walletRegistered) {
      setStatus("Please wait, wallet connecting...");
      return;
    }
    if (!roomId) return setStatus("Please enter a Room ID!");
    socket.emit("create_room", { roomId, difficulty });
    setStatus("Creating room...");
  };

  const joinRoom = () => {
    if (!walletRegistered) {
      setStatus("Please wait, wallet connecting...");
      return;
    }
    if (!roomId) return setStatus("Please enter a Room ID!");
    socket.emit("join_room", { roomId });
    setStatus("Joining room...");
  };

  const submitGuess = () => {
    if (!guess || guess.length !== 1) return;
    socket.emit("guess_letter", { roomId, letter: guess });
    setGuess("");
  };

  const replayGame = () => {
    // 🚀 Replay: Reset game state in room
    socket.emit("create_room", { roomId, difficulty });
    setStatus("Replaying game...");
    setGame(null);
    setGuess("");
  };

  const leaveRoom = () => {
    // 🚪 Disconnect and reset all
    socket.disconnect();
    setGame(null);
    setGuess("");
    setRoomId("");
    setLeaderboard([]);
    setStatus("You left the room.");
  };

  const displayWord = () => {
    if (!game || !game.word) return "_ _ _";
    return game.word
      .split("")
      .map((ch: string) => (game.guessedLetters?.includes(ch) ? ch : "_"))
      .join(" ");
  };

  // 🧠 Fetch leaderboard manually if needed
  const fetchLeaderboard = () => {
    socket.emit("get_leaderboard");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      {/* 🌟 Create/Join Room */}
      {!game ? (
        <>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Start a Game</h2>

          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            style={{
              padding: "0.75rem",
              width: "100%",
              maxWidth: "300px",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
            style={{
              padding: "0.5rem",
              width: "100%",
              maxWidth: "300px",
              marginBottom: "1rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            <option value="easy">🟢 Easy</option>
            <option value="medium">🟡 Medium</option>
            <option value="hard">🔴 Hard</option>
          </select>

          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <button onClick={createRoom} style={btnStyle("#2563eb")}>
              Create
            </button>
            <button onClick={joinRoom} style={btnStyle("#10b981")}>
              Join
            </button>
          </div>

          {status && <p style={{ color: "red", marginTop: "1rem" }}>{status}</p>}
        </>
      ) : (
        <>
          {/* 🌟 Game UI */}
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🎯 Room: {roomId}</h2>

          <p style={{ fontSize: "1.25rem", color: "#6b7280", marginBottom: "1rem" }}>
            🧠 Difficulty: {game?.difficulty?.toUpperCase()}
          </p>

          {game?.hint && (
            <div
              style={{
                backgroundColor: "#e0f2fe",
                border: "1px solid #38bdf8",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
                fontWeight: "500",
                color: "#0369a1",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              💡 <b>Hint:</b> {game.hint}
            </div>
          )}

          <p style={{ fontSize: "2rem", fontFamily: "monospace", letterSpacing: 6 }}>
            {displayWord()}
          </p>

          <p>❌ Tries: {game.failedTries?.[playerId] || 0}</p>

          {game.currentTurn === playerId && !game.gameOver ? (
            <div style={{ color: "#22c55e", fontWeight: "bold", fontSize: "1.5rem", marginTop: "1rem" }}>
              🎯 Your Turn!
            </div>
          ) : (
            <p style={{ marginTop: "1rem", fontSize: "1.25rem" }}>⌛ Waiting for opponent...</p>
          )}

          {!game.gameOver && game.currentTurn === playerId && (
            <div style={{ marginTop: "1rem" }}>
              <input
                maxLength={1}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                style={{
                  padding: "0.5rem",
                  width: "3rem",
                  textAlign: "center",
                  fontSize: "1.25rem",
                  marginRight: "0.5rem",
                }}
              />
              <button
                onClick={submitGuess}
                style={btnStyle("#7c3aed")}
              >
                Guess
              </button>
            </div>
          )}

          {game.gameOver && (
            <div style={{ marginTop: "2rem", fontSize: "1.25rem" }}>
              {game.status === "won" ? (
                <>
                  🏆 You won the game!
                  <br />
                  💸 10 Tokens have been sent to your wallet!
                </>
              ) : (
                <>
                  💀 You lost the game.
                </>
              )}
              <p style={{ marginTop: "1rem" }}>
                The word was: <strong>{game.word}</strong>
              </p>

              {/* 🎮 Replay or Leave */}
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button onClick={replayGame} style={btnStyle("#3b82f6")}>🔄 Replay</button>
                <button onClick={leaveRoom} style={btnStyle("#ef4444")}>🚪 Leave</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 🏆 Leaderboard */}
      {leaderboard.length > 0 && (
        <div style={{ marginTop: "3rem", textAlign: "left" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🏆 Top Players</h3>
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {leaderboard.map((player, idx) => (
              <li key={idx} style={{ marginBottom: "0.75rem", fontSize: "1.1rem" }}>
                {idx + 1}. {shortenAddress(player.wallet)} - {player.wins} wins
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const btnStyle = (bg: string) => ({
  padding: "0.5rem 1rem",
  backgroundColor: bg,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
});

export default GameBoard;
