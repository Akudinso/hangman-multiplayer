// src/lib/socket.ts
import { io } from "socket.io-client";

const URL = "http://localhost:4000"; // Your server URL

export const socket = io(URL, { autoConnect: false });
