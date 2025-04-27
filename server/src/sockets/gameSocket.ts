// src/sockets/gameSocket.ts
import { Socket, Server } from "socket.io";
import { rooms } from "../state/rooms";
import { socketToWalletMap } from "../state/wallets";
import { generateWord } from "../utils/wordBank";
import { distributeReward } from "../rewards/distributeReward";
import { GameRoom } from "../types/game";
import { recordWin, recordLoss, getLeaderboard } from "../state/leaderboard";
import { sdk } from "../config/thirdweb"; 




export const setupGameSocket = (socket: Socket, io: Server) => {
    socket.on("register_wallet", ({ wallet }: { wallet: string }) => {
        socketToWalletMap[socket.id] = wallet;
        console.log(`🔗 Registered wallet ${wallet} for ${socket.id}`);
    });

    socket.on("create_room", ({ roomId, difficulty }: { roomId: string, difficulty: "easy" | "medium" | "hard" }) => {
        const random = generateWord(difficulty || "easy");
        const newRoom: GameRoom = {
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

        rooms[roomId] = newRoom;

        socket.join(roomId);
        console.log(`Room ${roomId} created by ${socket.id} with difficulty: ${difficulty}`);
        socket.emit("room_created", { roomId });
    });

    socket.on("join_room", ({ roomId }: { roomId: string }) => {
        const room = rooms[roomId];
        if (!room) return socket.emit("error", { message: "Room does not exist" });

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




    socket.on("guess_letter", async ({ roomId, letter }: { roomId: string; letter: string }) => {
        const room = rooms[roomId];
        if (!room) return;

        // 🛑 Prevent further input if game is already over
        if (room.gameOver) return;

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
        } else {
            room.failedTries[socket.id] += 1;
        }


        const allLettersGuessed = [...new Set(room.word.split(""))].every((char) =>
            room.guessedLetters.includes(char)
        );

        const gameLost = room.failedTries[socket.id] >= room.maxTries;

        let winnerId: string | null = null;
        let loserId: string | null = null;

        if (allLettersGuessed) {
            winnerId = socket.id;
            loserId = room.players.find((p) => p.id !== socket.id)?.id || null;
        } else if (gameLost) {
            loserId = socket.id;
            winnerId = room.players.find((p) => p.id !== socket.id)?.id || null;
        }

        if (allLettersGuessed || gameLost) {
            room.gameOver = true;


            const [player1, player2] = room.players;
            const player1Score = room.correctGuesses[player1.id] || 0;
            const player2Score = room.correctGuesses[player2.id] || 0;

            let winnerId: string | null = null;

            if (player1Score > player2Score) {
                winnerId = player1.id;
            } else if (player2Score > player1Score) {
                winnerId = player2.id;
            } else {
                // Tie: fallback to the player who guessed last correct move
                winnerId = socket.id;
            }

            // 🎁 Reward the winner
            if (winnerId) {
                const winnerWallet = socketToWalletMap[winnerId];
              
                console.log("🏆 Winner ID:", winnerId);
                console.log("🏦 Winner Wallet:", winnerWallet);
              
                if (!winnerWallet) {
                  console.error("❌ No wallet found for winner!");
                } else {
                  console.log("🚀 Starting reward process...");
                  await distributeReward(winnerWallet);
                  console.log("✅ Reward sent successfully");
                  recordWin(winnerWallet);
                }
              }
              

            // 🎯 Send personalized game over message
            room.players.forEach((player) => {
                const status = player.id === winnerId ? "won" : "lost";

                if (status === "lost") {
                    const wallet = socketToWalletMap[player.id];
                    if (wallet) recordLoss(wallet);
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
            const topPlayers = getLeaderboard();
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
        const wallet = socketToWalletMap[socket.id];
        if (!wallet) {
          socket.emit("balance_data", { balance: 0 });
          return;
        }
      
        try {
          const tokenAddress = process.env.TOKEN_CONTRACT!;
          const tokenContract = await sdk.getContract(tokenAddress, "token");
          const balance = await tokenContract.erc20.balanceOf(wallet);
          socket.emit("balance_data", { balance: balance.displayValue });
        } catch (err) {
          console.error("❌ Failed to fetch balance:", err);
          socket.emit("balance_data", { balance: 0 });
        }
      });
      

    socket.on("get_leaderboard", () => {
        const topPlayers = getLeaderboard();
        socket.emit("leaderboard_data", topPlayers);
    });



    socket.on("disconnect", () => {
        console.log(`🔴 Player disconnected: ${socket.id}`);
        // TODO: Cleanup
    });
};
