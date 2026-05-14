@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies with npm.cmd...
  call npm.cmd install
)
call npm.cmd run dev
