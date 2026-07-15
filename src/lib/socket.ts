import { io, Socket } from "socket.io-client";

const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3333";

export const socket: Socket = io(backendUrl, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
});
