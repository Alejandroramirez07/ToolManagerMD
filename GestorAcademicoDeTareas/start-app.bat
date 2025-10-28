@echo off
echo Starting TaskManager Application...

echo Starting NestJS backend on port 3000...
cd GestorAcademicoDeTareas
start "Backend" cmd /k "npm run start:dev"

timeout /t 3 /nobreak >nul

echo Starting React frontend on port 5173...
cd frontend
start "Frontend" cmd /k "npm run dev"

echo.
echo ✅ Application started successfully!
echo 📊 Backend API: http://localhost:3000
echo 🌐 Frontend UI: http://localhost:5173
echo.
echo Demo accounts:
echo   Professor: professor@example.com / password
echo   Student: student@example.com / password
echo.
pause
