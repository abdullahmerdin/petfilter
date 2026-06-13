@echo off
cd /d "C:\Software Dev\shopify\my-app"
npx shopify app dev --no-tunnel > %TEMP%\shopify-dev.log 2>&1
echo EXIT_CODE=%ERRORLEVEL% >> %TEMP%\shopify-dev.log
