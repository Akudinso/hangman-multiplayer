"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGameSocket = void 0;
const rooms_1 = require("../state/rooms");
const wallets_1 = require("../state/wallets");
const wordBank_1 = require("../utils/wordBank");
const distributeReward_1 = require("../rewards/distributeReward");
const leaderboard_1 = require("../state/leaderboard");
const thirdweb_1 = require("../config/thirdweb");
const setupGameSocket = (socket, io) => {
    socket.on("register_wallet", ({ wallet }) => {
        wallets_1.socketToWalletMap[socket.id] = wallet;
        console.log(`🔗 Registered wallet ${wallet} for ${socket.id}`);
    });
    socket.on("create_room", ({ roomId, difficulty }) => {
        const random = (0, wordBank_1.generateWord)(difficulty || "easy");
        const newRoom = {
            players: [{ id: socket.id, role: "player1" }],
            word: random.word,
            hint: random.hint,
            guessedLetters: [],
            currentTurn: socket.id,
            maxTries: difficulty === "easy" ? 8 : difficulty === "medium" ? 6 : 4,
            failedTries: { [socket.id]: 0 },
            correctGuesses: { [socket.id]: 0 }, // ✅ Initialize here
            gameOver: false,
            difficulty,
        };
        rooms_1.rooms[roomId] = newRoom;
        socket.join(roomId);
        console.log(`Room ${roomId} created by ${socket.id} with difficulty: ${difficulty}`);
        socket.emit("room_created", { roomId });
    });
    socket.on("join_room", ({ roomId }) => {
        const room = rooms_1.rooms[roomId];
        if (!room)
            return socket.emit("error", { message: "Room does not exist" });
        if (room.players.length >= 2) {
            return socket.emit("error", { message: "Room full" });
        }
        room.failedTries[socket.id] = 0;
        room.correctGuesses[socket.id] = 0; // ✅ Initialize here
        room.players.push({ id: socket.id, role: "player2" });
        console.log(`🎯 Word for room ${roomId}: ${room.word}`);
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
        console.log(`📣 Broadcasting game_started to both players in room ${roomId}`);
        // 🧠 EMIT TO WHOLE ROOM!
        io.to(roomId).emit("game_started", {
            players: room.players,
            word: room.word,
            guessedLetters: room.guessedLetters,
            failedTries: room.failedTries,
            currentTurn: room.currentTurn,
            gameOver: room.gameOver,
            difficulty: room.difficulty,
            hint: room.hint,
        });
    });
    socket.on("guess_letter", async ({ roomId, letter }) => {
        const room = rooms_1.rooms[roomId];
        if (!room)
            return;
        // 🛑 Prevent further input if game is already over
        if (room.gameOver)
            return;
        if (room.currentTurn !== socket.id) {
            socket.emit("error", { message: "Not your turn!" });
            return;
        }
        const normalizedLetter = letter.toLowerCase();
        if (room.guessedLetters.includes(normalizedLetter)) {
            socket.emit("error", { message: "Letter already guessed" });
            return;
        }
        // ✅ Add new letter to guessed letters
        room.guessedLetters.push(normalizedLetter);
        const isCorrect = room.word.includes(normalizedLetter);
        if (isCorrect) {
            room.correctGuesses[socket.id] += 1; // ✅ Track correct guesses
        }
        else {
            room.failedTries[socket.id] += 1;
        }
        const allLettersGuessed = [...new Set(room.word.split(""))].every((char) => room.guessedLetters.includes(char));
        const gameLost = room.failedTries[socket.id] >= room.maxTries;
        let winnerId = null;
        let loserId = null;
        if (allLettersGuessed) {
            winnerId = socket.id;
            loserId = room.players.find((p) => p.id !== socket.id)?.id || null;
        }
        else if (gameLost) {
            loserId = socket.id;
            winnerId = room.players.find((p) => p.id !== socket.id)?.id || null;
        }
        if (allLettersGuessed || gameLost) {
            room.gameOver = true;
            const [player1, player2] = room.players;
            const player1Score = room.correctGuesses[player1.id] || 0;
            const player2Score = room.correctGuesses[player2.id] || 0;
            let winnerId = null;
            if (player1Score > player2Score) {
                winnerId = player1.id;
            }
            else if (player2Score > player1Score) {
                winnerId = player2.id;
            }
            else {
                // Tie: fallback to the player who guessed last correct move
                winnerId = socket.id;
            }
            // 🎁 Reward the winner
            if (winnerId) {
                const winnerWallet = wallets_1.socketToWalletMap[winnerId];
                console.log("🏆 Winner ID:", winnerId);
                console.log("🏦 Winner Wallet:", winnerWallet);
                if (!winnerWallet) {
                    console.error("❌ No wallet found for winner!");
                }
                else {
                    console.log("🚀 Starting reward process...");
                    await (0, distributeReward_1.distributeReward)(winnerWallet);
                    console.log("✅ Reward sent successfully");
                    (0, leaderboard_1.recordWin)(winnerWallet);
                }
            }
            // 🎯 Send personalized game over message
            room.players.forEach((player) => {
                const status = player.id === winnerId ? "won" : "lost";
                if (status === "lost") {
                    const wallet = wallets_1.socketToWalletMap[player.id];
                    if (wallet)
                        (0, leaderboard_1.recordLoss)(wallet);
                }
                io.to(player.id).emit("game_update", {
                    guessedLetters: room.guessedLetters,
                    failedTries: room.failedTries,
                    nextTurn: null,
                    gameOver: true,
                    winner: winnerId,
                    word: room.word,
                    status,
                });
            });
            // 🧠 NEW: After game ends, broadcast updated leaderboard
            const topPlayers = (0, leaderboard_1.getLeaderboard)();
            io.emit("leaderboard_data", topPlayers); // 🔥 broadcast to everyone
            return;
        }
        // 🔁 Continue game - switch turn
        const nextPlayer = room.players.find((p) => p.id !== socket.id);
        // After switching turn:
        if (nextPlayer) {
            room.currentTurn = nextPlayer.id;
        }
        // 🔥 Emit full updated game state
        io.to(roomId).emit("game_update", {
            players: room.players,
            word: room.word,
            guessedLetters: room.guessedLetters,
            failedTries: room.failedTries,
            currentTurn: room.currentTurn,
            gameOver: room.gameOver,
        });
    });
    socket.on("get_balance", async () => {
        const wallet = wallets_1.socketToWalletMap[socket.id];
        if (!wallet) {
            socket.emit("balance_data", { balance: 0 });
            return;
        }
        try {
            const tokenAddress = process.env.TOKEN_CONTRACT;
            const tokenContract = await thirdweb_1.sdk.getContract(tokenAddress, "token");
            const balance = await tokenContract.erc20.balanceOf(wallet);
            socket.emit("balance_data", { balance: balance.displayValue });
        }
        catch (err) {
            console.error("❌ Failed to fetch balance:", err);
            socket.emit("balance_data", { balance: 0 });
        }
    });
    socket.on("get_leaderboard", () => {
        const topPlayers = (0, leaderboard_1.getLeaderboard)();
        socket.emit("leaderboard_data", topPlayers);
    });
    socket.on("disconnect", () => {
        console.log(`🔴 Player disconnected: ${socket.id}`);
        // TODO: Cleanup
    });
};
exports.setupGameSocket = setupGameSocket;
