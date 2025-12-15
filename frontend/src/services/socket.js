import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});
export const socket_namespace = (namespace) => {
  return io(`${SOCKET_URL}/${namespace}`, {
    autoConnect: false,
    transports: ["websocket"],
  });
};

export const connectSocket = (token) => {
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
