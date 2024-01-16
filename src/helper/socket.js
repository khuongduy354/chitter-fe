import { io } from "socket.io-client";
let socket = null;

export const getSocket = () => {
  if (socket != null) {
    return socket;
  } else {
    socket = io(process.env.REACT_APP_WS_URL);
    return socket;
  }
};
