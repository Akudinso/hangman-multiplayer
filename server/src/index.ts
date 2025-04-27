// src/index.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { setupGameSocket } from "./sockets/gameSocket";
import { initThirdwebContracts } from "./config/thirdweb";

dotenv.config();

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 🔌 Handle socket logic
io.on("connection", (socket) => {
  console.log(`🟢 Player connected: ${socket.id}`);
  setupGameSocket(socket, io);
});


const PORT = process.env.PORT || 4000;

// ✅ Initialize contracts before starting server
(async () => {
  await initThirdwebContracts();
  server.listen(PORT, () => {
    console.log(`🎮 Multiplayer server running on http://localhost:${PORT}`);
  });
})();