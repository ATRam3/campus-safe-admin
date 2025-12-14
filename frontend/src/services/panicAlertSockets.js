import { socket_namespace } from "./socket";

const panicAlertSocket = socket_namespace("location_updates");

const connectPanicAlertSocket = (token) => {
  panicAlertSocket.auth = { token };
  panicAlertSocket.connect();
  console.log("Panic alert socket connecting with token:", token);
};

const disconnectPanicAlertSocket = () => {
  panicAlertSocket.disconnect();
};

export {
  panicAlertSocket,
  connectPanicAlertSocket,
  disconnectPanicAlertSocket,
};
