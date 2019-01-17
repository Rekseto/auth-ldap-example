import Server from "inra-server-http";

import {resolve} from "path";

import load from "call-dir";

import body from "koa-body";
import cors from "@koa/cors";
import logger from "koa-logger";
import Koa from "koa";
import Router from "koa-router";

import errors from "./errors";
import {initDatabase} from "./Database";

function initServer(dependencies, config) {
  if (!dependencies.logger) {
    dependencies.logger = console;
  }

  const server = new Server({
    host: config.SERVER_HOST,
    port: config.SERVER_PORT
  });
  server.config = config;

  server.setEngine(new Koa());
  server.setRouter(new Router());

  for (const dependency in dependencies) {
    server[dependency] = dependencies[dependency];
  }

  server.use(logger());
  server.use(body());
  server.use(cors());
  server.use(
    errors({
      httpStatus: 500,
      userMessage: "Internal Server Error"
    })
  );
  server.use(server.router.routes());
  server.use(server.router.allowedMethods());

  try {
    load(resolve(__dirname, "api/middlewares"), src => server.import(src));
    load(resolve(__dirname, "api/routes"), src => server.import(src));
  } catch (error) {
    dependencies.logger.error(error);
  }

  return server;
}

export default function(config) {
  const logger = console; // Just Set your fav logger here (Console for current purposes)

  const database = initDatabase({logger}, config); // Here i'm creating MongoDB

  const server = initServer({logger, database}, config);

  return new Promise((resolve, reject) => {
    database
      .connect()
      .then(res => {
        server.run(config.SERVER_PORT, function() {
          logger.log(`Server running on ${config.SERVER_PORT}`);

          resolve(server);
        });
      })
      .catch(err => {
        logger.error("A critial error occured on startup");
        logger.error(err);

        reject(err);
      });
  });
}
