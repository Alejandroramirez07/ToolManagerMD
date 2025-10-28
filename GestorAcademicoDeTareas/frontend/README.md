# TaskManager Frontend

A modern React frontend for the Academic Task Management System built with Vite, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: Overview of tasks, grades, and user statistics
- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Grade Management**: Assign grades to students for tasks with performance tracking
- **User Management**: Manage professors and students with role-based access
- **Authentication**: Login system with demo accounts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Demo Accounts

The application includes demo accounts for testing:

- **Professor Account**: `professor@example.com` / `password`
- **Student Account**: `student@example.com` / `password`

## Project Structure

```
src/
├── components/          # Reusable components
│   └── Layout.tsx      # Main layout with sidebar navigation
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard overview
│   ├── Tasks.tsx       # Task management
│   ├── Grades.tsx      # Grade management
│   ├── Users.tsx       # User management
│   └── Login.tsx       # Authentication
├── services/           # API services
│   └── api.ts         # Axios configuration and API calls
├── App.tsx            # Main app component with routing
├── main.tsx           # Application entry point
└── index.css          # Tailwind CSS imports
```

## API Integration

The frontend communicates with the NestJS backend through REST APIs:

- **Tasks API**: `/tasks` - CRUD operations for tasks
- **Grades API**: `/grades` - Grade management and student averages
- **Users API**: `/users` - User management with role-based access
- **Auth API**: `/auth` - Authentication (currently mocked)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Overview

### Dashboard
- Statistics cards showing total tasks, grades, users, and completion rate
- Recent tasks and grades lists
- Student performance overview

### Task Management
- Create new tasks with title, description, and due date
- Mark tasks as complete/incomplete
- Edit and delete existing tasks
- Visual indicators for task status

### Grade Management
- Assign grades (0-5 scale) to students for specific tasks
- View student performance averages
- Track all grades with filtering by student
- Color-coded grade indicators

### User Management
- Add new professors and students
- Edit user information
- Role-based access control
- User statistics and overview

## Styling

The application uses Tailwind CSS with a custom color palette:
- Primary blue colors for buttons and accents
- Responsive grid layouts
- Modern card-based design
- Consistent spacing and typography

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
