import { Server } from "hapi";
import { rateConversion } from "./routes/rate-conversion";

const server = new Server({
    port: 8080,
    host: "0.0.0.0",
});

server.route(rateConversion);

export const init = async () => {
  await server.initialize();

  return server;
};

export const start = async () => {
  await server.start();

  return server;
};
