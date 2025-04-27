// src/state/rooms.ts
import { GameRoom } from "../types/game";

// 🧠 In-memory store for active game rooms
export const rooms: Record<string, GameRoom> = {};
