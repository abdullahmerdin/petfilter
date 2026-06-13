import { createRequestHandler } from "@react-router/express";
import * as build from "./build-server.js";

export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
