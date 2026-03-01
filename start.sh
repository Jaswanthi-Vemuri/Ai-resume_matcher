#!/bin/bash

# AI Resume Matcher - Complete Startup Script
# This script starts all three components: Endee server, Backend, and Frontend

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}AI Resume Matcher - Startup Script${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to check if a port is available
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}Port $port is already in use${NC}"
    return 1
  fi
  return 0
}

# Check environment
echo -e "\n${YELLOW}Checking environment...${NC}"

# Check frontend
if [ ! -d "frontend" ]; then
  echo -e "${RED}Error: frontend directory not found${NC}"
  exit 1
fi

# Check backend
if [ ! -d "backend" ]; then
  echo -e "${RED}Error: backend directory not found${NC}"
  exit 1
fi

# Check backend .env
if [ ! -f "backend/.env" ]; then
  echo -e "${YELLOW}Warning: backend/.env not found. Creating from .env.example${NC}"
  if [ -f "backend/.env.example" ]; then
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}Please update backend/.env with your OpenAI API key${NC}"
  else
    echo -e "${RED}Error: backend/.env.example not found${NC}"
    exit 1
  fi
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
  echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
  cd frontend
  npm install
  cd ..
fi

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
  echo -e "\n${YELLOW}Installing backend dependencies...${NC}"
  cd backend
  npm install
  cd ..
fi

# Check ports
echo -e "\n${YELLOW}Checking ports...${NC}"
check_port 8000 || { echo -e "${RED}Please free port 8000${NC}"; exit 1; }
check_port 5000 || { echo -e "${RED}Please free port 5000${NC}"; exit 1; }
check_port 3000 || { echo -e "${RED}Please free port 3000${NC}"; exit 1; }

# Start Endee server
echo -e "\n${GREEN}Starting Endee server (port 8000)...${NC}"
cd backend
npm run endee &
ENDEE_PID=$!
echo -e "${YELLOW}Endee PID: $ENDEE_PID${NC}"
sleep 2

# Start Backend
echo -e "\n${GREEN}Starting Backend (port 5000)...${NC}"
npm start &
BACKEND_PID=$!
echo -e "${YELLOW}Backend PID: $BACKEND_PID${NC}"
sleep 2
cd ..

# Start Frontend
echo -e "\n${GREEN}Starting Frontend (port 3000)...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}"
cd ..

sleep 3

# Summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}All services started successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Frontend: ${YELLOW}http://localhost:3000${NC}"
echo -e "Backend:  ${YELLOW}http://localhost:5000${NC}"
echo -e "Endee:    ${YELLOW}http://localhost:8000${NC}"
echo ""
echo -e "PIDs:"
echo -e "  Endee:    $ENDEE_PID"
echo -e "  Backend:  $BACKEND_PID"
echo -e "  Frontend: $FRONTEND_PID"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Trap to kill all processes on exit
trap 'kill $ENDEE_PID $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT

wait
