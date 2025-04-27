"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const gameSocket_1 = require("./sockets/gameSocket");
const thirdweb_1 = require("./config/thirdweb");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
// 🔌 Handle socket logic
io.on("connection", (socket) => {
    console.log(`🟢 Player connected: ${socket.id}`);
    (0, gameSocket_1.setupGameSocket)(socket, io);
});
const PORT = process.env.PORT || 4000;
// ✅ Initialize contracts before starting server
(async () => {
    await (0, thirdweb_1.initThirdwebContracts)();
    server.listen(PORT, () => {
        console.log(`🎮 Multiplayer server running on http://localhost:${PORT}`);
    });
})();
