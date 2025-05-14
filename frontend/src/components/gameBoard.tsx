// src/components/gameBoard.tsx
import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { useAddress } from "@thirdweb-dev/react";
import { shortenAddress } from "@/utils/shorten";
import { useDarkMode } from "@/context/DarkModeContext"; // <== NEW


interface Player {
    id: string;
    role: "player1" | "player2";
}

interface GameData {
    players: Player[];
    word: string;
    guessedLetters: string[];
    failedTries: Record<string, number>;
    correctGuesses?: Record<string, number>;
    currentTurn: string;
    gameOver: boolean;
    status?: "won" | "lost";
    difficulty?: "easy" | "medium" | "hard";
    hint?: string;
}

export default function GameBoard() {
    const address = useAddress();
    const [walletRegistered, setWalletRegistered] = useState(false);

    const [roomId, setRoomId] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
    const [playerId, setPlayerId] = useState("");
    const [game, setGame] = useState<GameData | null>(null);
    const [guess, setGuess] = useState("");
    const [status, setStatus] = useState("");
    const [leaderboard, setLeaderboard] = useState<{ wallet: string; wins: number }[]>([]);
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [streak, setStreak] = useState(0);
    const [replaying, setReplaying] = useState(false);
    const [joining, setJoining] = useState(false);
    const [creating, setCreating] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<{ roomId: string; difficulty: string }[]>([]);
    const [tokenBalance, setTokenBalance] = useState("0");
    const [balanceHistory, setBalanceHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);







    // 🧠 Utility
    const displayWord = () =>
        game?.word
            ?.split("")
            .map((ch) => (game.guessedLetters.includes(ch) ? ch : "_"))
            .join(" ") || "_ _ _";

    // 🚀 Lifecycle
    useEffect(() => {
        if (!socket.connected) socket.connect();

        socket.on("connect", () => {
            console.log("🟢 Connected:", socket.id);
            setPlayerId(socket.id ?? "");
        });

        // ✅ Emit register_wallet as soon as address is available
        if (address) {
            socket.emit("register_wallet", { wallet: address });
            console.log("🔗 Wallet registered:", address);
            setWalletRegistered(true);
        }

        socket.on("balance_data", ({ balance }) => {
            setBalanceHistory(prev => [balance, ...prev.slice(0, 4)]); // Store last 5 balances
            setTokenBalance(balance);
          });
          
          socket.emit("get_balance"); // Fetch on mount
          



        socket.on("room_created", ({ roomId }) => {
            setRoomId(roomId);
            setStatus("Waiting for opponent...");
        });

        socket.on("game_started", (data: GameData) => {
            console.log("🎯 Game started:", data);
            setGame(data);
            setStatus("");
            setCreating(false);
            setJoining(false);
            setReplaying(false); // ✅ Reset button state

        });
        socket.on("game_update", (data: GameData) => setGame(data));
        socket.emit("get_balance"); // update after game update
        socket.on("leaderboard_data", (data) => setLeaderboard(data));
        socket.on("joinable_rooms", (rooms) => {
            setAvailableRooms(rooms);
        });

        socket.on("error", (data) => setStatus(data.message || "Something went wrong."));
        socket.on("streak_data", ({ streak }) => {
            setStreak(streak);
        });


        // 🕒 Auto-refresh every 5s
        const interval = setInterval(() => {
            socket.emit("get_public_rooms");
        }, 5000);

        // Initial fetch
        socket.emit("get_public_rooms");


        return () => {
            socket.off("connect");
            socket.off("room_created");
            socket.off("game_started");
            socket.off("game_update");
            socket.off("leaderboard_data");
            socket.off("error");
            socket.off("streak_data");
            socket.off("joinable_rooms");
            clearInterval(interval); // 🧹 clear on unmount

        };
    }, [address]);

    // ✨ Actions
    const createRoom = () => {
        if (!walletRegistered) return setStatus("Please wait, wallet connecting...");
        // if (!roomId) return setStatus("Please enter a Room ID!");

        setCreating(true);
        socket.emit("create_room", { difficulty });
        setStatus("Creating room...");
    };

    const joinRoom = (id?: string) => {
        const targetRoom = id || roomId;
        if (!walletRegistered) return setStatus("Please wait, wallet connecting...");
        if (!targetRoom) return setStatus("Please enter a Room ID!");

        setRoomId(targetRoom); // ✅ store the selected room ID in state
        setJoining(true);
        socket.emit("join_room", { roomId: targetRoom });
        setStatus("Joining room...");
    };

    const submitGuess = () => {
        if (guess.length !== 1) return;
        socket.emit("guess_letter", { roomId, letter: guess });
        setGuess("");
    };

    const replayGame = () => {
        if (!roomId) return;
        setReplaying(true);
        socket.emit("replay_room", { roomId, difficulty });
        setGame(null);
        setGuess("");
        setStatus("Replaying...");
    };

    const leaveRoom = () => {
        socket.disconnect();
        setGame(null);
        setRoomId("");
        setGuess("");
        setStatus("You left the room.");
        setLeaderboard([]);
    };

    const refreshRooms = () => {
        socket.emit("get_public_rooms");
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "2rem",
            backgroundColor: darkMode ? "#0a0a0a" : "#ffffff",
            color: darkMode ? "#f5f5f5" : "#111111",
        }}>

        


            {!game ? (
                <>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Start a Game</h2>

                    {roomId && (
                        <p style={{ marginTop: "1rem", color: "#4b5563" }}>
                            🆔 Your Room ID: <strong>{roomId}</strong>
                        </p>
                    )}


                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                        style={inputStyle}
                    >
                        <option value="easy">🟢 Easy</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="hard">🔴 Hard</option>
                    </select>

                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                        <button
                            onClick={createRoom}
                            disabled={creating}
                            style={{
                                ...btnStyle("#2563eb"),
                                opacity: creating ? 0.6 : 1,
                                cursor: creating ? "not-allowed" : "pointer",
                            }}
                        >
                            {creating ? "Creating..." : "Create"}
                        </button>

                        <button
                            onClick={() => joinRoom()}
                            disabled={joining}
                            style={{
                                ...btnStyle("#10b981"),
                                opacity: joining ? 0.6 : 1,
                                cursor: joining ? "not-allowed" : "pointer",
                            }}
                        >
                            {joining ? "Joining..." : "Join"}
                        </button>

                    </div>

                    {status && <p style={{ color: "red", marginTop: "1rem" }}>{status}</p>}
                </>
            ) : (
                <>
                    {/* 🧠 Game Started */}
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🎯 Room: {roomId}</h2>

                    <p style={{ fontSize: "1rem", color: "#6b7280" }}>
                        🧠 Difficulty: {game.difficulty?.toUpperCase()}
                    </p>

                    {game.hint && (
                        <div style={hintStyle}>
                            💡 <b>Hint:</b> {game.hint}
                        </div>
                    )}

                    <p style={{ fontSize: "2rem", fontFamily: "monospace", letterSpacing: 6, marginBottom: "1rem" }}>
                        {displayWord()}
                    </p>

                    <p style={{
                        marginTop: "1rem",
                        fontWeight: "bold",
                        color: streak >= 3 ? "#22c55e" : "#f59e0b",
                        fontSize: "1.1rem",
                    }}>
                        🔥 NFT Win Streak: {streak} / 3
                    </p>


                    <p>❌ Tries: {game.failedTries?.[playerId] || 0}</p>

                    {game.currentTurn === playerId && !game.gameOver ? (
                        <div style={{ ...turnStyle, color: "#22c55e" }}>🎯 Your Turn!</div>
                    ) : (
                        <div style={{ marginTop: "1rem", fontSize: "1.25rem" }}>⌛ Waiting for opponent...</div>
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
                            <button onClick={submitGuess} style={btnStyle("#7c3aed")}>Guess</button>
                        </div>
                    )}

                    {game.gameOver && (
                        <div style={{ marginTop: "2rem", fontSize: "1.25rem" }}>
                            {game.status === "won" ? (
                                <>
                                    🏆 You won the game! <br />
                                    💸 10 Tokens sent to wallet!
                                </>
                            ) : (
                                <>💀 You lost the game.</>
                            )}
                            <p style={{ marginTop: "1rem" }}>
                                The word was: <strong>{game.word}</strong>
                            </p>

                            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
                                <button
                                    onClick={replayGame}
                                    disabled={replaying}
                                    style={{
                                        ...btnStyle("#3b82f6"),
                                        opacity: replaying ? 0.6 : 1,
                                        cursor: replaying ? "not-allowed" : "pointer",
                                    }}
                                >
                                    🔄 {replaying ? "Waiting..." : "Replay"}
                                </button>

                                <button onClick={leaveRoom} style={btnStyle("#ef4444")}>🚪 Leave</button>
                            </div>
                        </div>
                    )}
                </>
            )}


            {!game && (
                <>
                    <div style={{ marginTop: "2rem", textAlign: "left", width: "100%", maxWidth: "600px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>🌍 Public Rooms</h3>
                            <button onClick={refreshRooms} style={btnStyle("#64748b")}>🔄 Refresh</button>
                        </div>

                        {availableRooms.length === 0 ? (
                            <p style={{ color: "#888", marginTop: "1rem" }}>No public rooms available.</p>
                        ) : (
                            <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "1rem" }}>
                                {availableRooms.map((room, idx) => (
                                    <li key={idx} style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "0.75rem 1rem",
                                        backgroundColor: "#f3f4f6",
                                        borderRadius: "8px",
                                        marginBottom: "0.75rem"
                                    }}>
                                        <span>
                                            🎯 Room ID: <b>{room.roomId}</b> |{" "}
                                            <span style={{
                                                padding: "2px 8px",
                                                borderRadius: "12px",
                                                fontWeight: "bold",
                                                color: "#fff",
                                                backgroundColor:
                                                    room.difficulty === "easy" ? "#22c55e" :
                                                        room.difficulty === "medium" ? "#facc15" :
                                                            "#ef4444",
                                            }}>
                                                {room.difficulty.toUpperCase()}
                                            </span>
                                        </span>

                                        <button
                                            onClick={() => joinRoom(room.roomId)}
                                            style={{
                                                ...btnStyle("#10b981"),
                                                padding: "0.4rem 0.8rem",
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            Join
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}


            {/* 🏆 Leaderboard
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
            )} */}
        </div>
    );
}

// 🌟 Small reusables
const btnStyle = (bg: string) => ({
    padding: "0.5rem 1rem",
    backgroundColor: bg,
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
});

const inputStyle = {
    padding: "0.75rem",
    width: "100%",
    maxWidth: "300px",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
};

const hintStyle = {
    backgroundColor: "#e0f2fe",
    border: "1px solid #38bdf8",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1.5rem",
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#0369a1",
};

const turnStyle = {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginTop: "1rem",
};

