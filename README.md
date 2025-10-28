# ToolManagerMD - Academic Task Management System

A comprehensive academic task management system built with NestJS backend and React frontend.

## 🚀 Quick Start

### Option 1: Start Everything at Once (Recommended)

**Windows:**
```bash
cd GestorAcademicoDeTareas
start-app.bat
```

**Linux/Mac:**
```bash
cd GestorAcademicoDeTareas
chmod +x start-app.sh
./start-app.sh
```

### Option 2: Manual Start

1. **Start Backend:**
```bash
cd GestorAcademicoDeTareas
npm install
npm run start:dev
```

2. **Start Frontend (in a new terminal):**
```bash
cd GestorAcademicoDeTareas/frontend
npm install
npm run dev
```

## 🌐 Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 👤 Demo Accounts

- **Professor**: `professor@example.com` / `password`
- **Student**: `student@example.com` / `password`

## 📋 Features

### Backend (NestJS)
- **Task Management**: CRUD operations for academic tasks
- **Grade Management**: Student grading with averages calculation
- **User Management**: Role-based access (Professor/Student)
- **Authentication**: JWT-based authentication system
- **Database**: MySQL with TypeORM

### Frontend (React + TypeScript)
- **Modern UI**: Built with Tailwind CSS and Lucide React icons
- **Dashboard**: Overview of tasks, grades, and statistics
- **Task Management**: Create, edit, delete, and track task completion
- **Grade Management**: Assign grades and view student performance
- **User Management**: Manage professors and students
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

### Backend
- **NestJS** - Node.js framework
- **TypeScript** - Type safety
- **TypeORM** - Database ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Class Validator** - DTO validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📁 Project Structure

```
ToolManagerMD/
├── GestorAcademicoDeTareas/          # Backend (NestJS)
│   ├── src/
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/               # Authentication
│   │   │   ├── tasks/              # Task management
│   │   │   ├── grades/             # Grade management
│   │   │   └── users/              # User management
│   │   ├── common/                  # Shared utilities
│   │   └── entities/               # Database entities
│   └── frontend/                   # Frontend (React)
│       ├── src/
│       │   ├── components/         # Reusable components
│       │   ├── pages/              # Page components
│       │   └── services/           # API services
│       └── public/                 # Static assets
└── README.md
```

## 🔧 Development

### Backend Development
```bash
cd GestorAcademicoDeTareas
npm run start:dev    # Development mode with hot reload
npm run build        # Build for production
npm run start:prod   # Start production build
```

### Frontend Development
```bash
cd GestorAcademicoDeTareas/frontend
npm run dev          # Development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🗄️ Database Setup

1. Install MySQL
2. Create a database named `task_manager`
3. Update environment variables in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=task_manager
```

## 📝 API Endpoints

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Grades
- `GET /grades` - Get all grades
- `POST /grades` - Create grade
- `PATCH /grades/:id` - Update grade
- `DELETE /grades/:id` - Delete grade
- `GET /grades/student/:id` - Get grades by student
- `GET /grades/student/:id/average` - Get student average

### Users
- `GET /users` - Get all users
- `POST /users` - Create user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🎨 UI Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: Consistent color scheme
- **Interactive Components**: Modals, forms, and navigation
- **Real-time Updates**: Live data from backend
- **Role-based UI**: Different views for professors and students

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to a static hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.