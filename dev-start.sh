#!/bin/bash
cd "C:/Software Dev/shopify/my-app"
npx shopify app dev --no-tunnel > /tmp/shopify-dev.log 2>&1
echo "EXIT_CODE=$?" >> /tmp/shopify-dev.log
