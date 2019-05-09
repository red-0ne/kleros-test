import { Server } from "hapi";
import { rateConversion } from "./lib/routes/rate-conversion";

const server = new Server({
    port: 8080,
    host: "localhost",
});

server.route(rateConversion);

export const start = async () => {
  await server.start();

  return server;
};
