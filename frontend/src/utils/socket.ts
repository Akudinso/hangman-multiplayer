import { io } from "socket.io-client";

const socket = io("https://hangman-multiplayer.onrender.com"); // Update if deploying backend

export default socket;
