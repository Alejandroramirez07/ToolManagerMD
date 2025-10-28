#!/bin/bash

# Start both backend and frontend servers
echo "Starting TaskManager Application..."

# Start backend in background
echo "Starting NestJS backend on port 3000..."
cd GestorAcademicoDeTareas
npm run start:dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting React frontend on port 5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo "📊 Backend API: http://localhost:3000"
echo "🌐 Frontend UI: http://localhost:5173"
echo ""
echo "Demo accounts:"
echo "  Professor: professor@example.com / password"
echo "  Student: student@example.com / password"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
wait $BACKEND_PID $FRONTEND_PID
