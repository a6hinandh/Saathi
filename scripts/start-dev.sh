#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "Start frontend: cd frontend && npm run dev"
echo "Start backend: cd backend && uvicorn app.main:app --reload --port 8000"
