#!/bin/bash
set -e
echo "=== Vercel Build ==="
npm run setup
npm run build

# Copy server build into api/ so serverless function can import it
cp build/server/index.js api/build-server.js
echo "=== Build complete ==="
