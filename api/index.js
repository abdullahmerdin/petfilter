import { createRequestHandler } from "@react-router/express";

const handler = createRequestHandler({
  build: await import("../build/server/index.js"),
  mode: process.env.NODE_ENV,
});

export default handler;
