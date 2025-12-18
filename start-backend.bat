@echo off
echo =========================================
echo  Carpool Connect - Backend Startup
echo =========================================
echo.
echo Starting MongoDB check...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL% == 0 (
    echo [OK] MongoDB is running
) else (
    echo [WARNING] MongoDB service not found or not running
    echo Please start MongoDB manually
)
echo.
echo Starting Backend Server on port 4000...
cd /d "%~dp0backend"
node index.js
