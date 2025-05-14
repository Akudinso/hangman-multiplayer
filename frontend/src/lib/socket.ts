// src/lib/socket.ts
import { io } from "socket.io-client";

// const URL = "https://hangman-multiplayer.onrender.com"; // Your server URL
const URL = "http://localhost:4000";

export const socket = io(URL, { autoConnect: false });
