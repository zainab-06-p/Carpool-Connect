@echo off
echo =========================================
echo  Carpool Connect - ngrok Tunnel
echo =========================================
echo.
echo Starting ngrok tunnel on port 4000...
echo.
echo After ngrok starts, note the HTTPS URL
echo and update it in:
echo  1. vercel.json (env section)
echo  2. Or Vercel dashboard environment variables
echo.
echo Press Ctrl+C to stop ngrok
echo =========================================
echo.
ngrok http 4000
