@echo off
REM Start FastAPI backend
start cmd /k "cd backend\ai-service && python -m uvicorn main:app --reload --port 4000"
REM Start frontend (assumes npm is installed and frontend is in project root)
start cmd /k "npm run dev"

REM Start AR Service (Express)
start cmd /k "cd backend\ar-service && npm start"

REM Start Blockchain Listener (Express)
start cmd /k "cd backend\blockchain-listener && node index.js"
 
REM Start GIS Service (Node) - install deps and run
start cmd /k "cd backend\gis-service && npm install --no-audit --no-fund && npm start"
