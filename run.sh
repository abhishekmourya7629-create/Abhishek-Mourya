#!/usr/bin/env bash
set -e

# ==============================================================================
# JanaSetu — Multilingual Citizen Demand Intelligence Platform
# Digital Public Good for BRICS Nations
# Single-Command Launcher
# ==============================================================================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "============================================================"
echo " Starting JanaSetu (जनसेतु) — Sovereign BRICS DPG Node "
echo "============================================================"

# 1. Setup Backend Python Environment if needed
if [ ! -d "backend/venv" ]; then
    echo "[1/4] Creating Python virtual environment..."
    python3 -m venv backend/venv
    backend/venv/bin/pip install --upgrade pip
    backend/venv/bin/pip install -r backend/requirements.txt
fi

# 2. Check and Seed Synthetic Database
echo "[2/4] Verifying synthetic BRICS dataset (~1,500 citizen requests)..."
backend/venv/bin/python3 -m backend.app.data.seed_generator

# 3. Setup Frontend if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "[3/4] Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# 4. Launch Services Concurrently
echo "[4/4] Launching FastAPI Backend (Port 8000) and Vite Frontend (Port 5173)..."

# Trap exit signals to kill child processes
cleanup() {
    echo ""
    echo "Shutting down JanaSetu services..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start backend
backend/venv/bin/uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be live
echo "Waiting for backend API on port 8000..."
sleep 2

# Start frontend
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd ..

echo ""
echo "============================================================"
echo " JanaSetu Platform is LIVE!"
echo " 👉 Policy Dashboard: http://localhost:5173"
echo " 👉 Backend API:      http://localhost:8000"
echo " 👉 Interactive Docs: http://localhost:8000/docs"
echo "============================================================"
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait on background processes
wait $BACKEND_PID $FRONTEND_PID
