import { createRequestHandler } from "@react-router/express";
import { installGlobals } from "@react-router/node";
import * as build from "../build/server/index.js";

installGlobals();

const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

export default handler;
