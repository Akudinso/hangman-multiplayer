import { io } from "socket.io-client";

// const socket = io("https://hangman-multiplayer.onrender.com"); // Update if deploying backend
const socket = io("http://localhost:4000");

export default socket;
