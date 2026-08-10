@echo off
set PATH=C:\Users\ndarn\AppData\Local\Programs\nodejs;%PATH%
cd /d "%~dp0"
call npm run dev -- --port 5173 --strictPort
