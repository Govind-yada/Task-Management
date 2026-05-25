# TaskFlow — MERN Stack Task Management App

A full-stack, production-grade task management application built with the MERN stack, JWT authentication, and Tailwind CSS.

---

## 🗂 Project Structure

```
taskflow/
├── server/                     # Node.js + Express backend
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, GetMe
│   │   └── taskController.js   # CRUD + toggle + pagination
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt hashed)
│   │   └── Task.js             # Task schema with indexes
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   └── tasks.js            # /api/tasks/*
│   ├── .env.example
│   ├── index.js                # Express app entry
│   └── package.json
│
├── client/                     # React.js frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── tasks/
│   │   │   │   ├── Dashboard.jsx   # Main page
│   │   │   │   ├── TaskCard.jsx    # Task item
│   │   │   │   ├── TaskModal.jsx   # Create/Edit modal
│   │   │   │   ├── TaskFilters.jsx # Search + filter bar
│   │   │   │   ├── StatsBar.jsx    # Stat cards
│   │   │   │   └── Pagination.jsx  # Page controls
│   │   │   └── ui/
│   │   │       └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state (useReducer)
│   │   │   └── TaskContext.jsx     # Task state (useReducer)
│   │   ├── hooks/
│   │   │   ├── useDarkMode.js
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance + interceptors
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                # Root — runs both with concurrently
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone <repo-url>
cd taskflow
npm run install:all
```

### 2. Configure Environment

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Run in Development

```bash
npm run dev
```

- **API** → http://localhost:5000
- **Frontend** → http://localhost:3000

---

## 🔌 API Reference

### Auth

| Method | Endpoint              | Access | Description         |
|--------|-----------------------|--------|---------------------|
| POST   | /api/auth/register    | Public | Register new user   |
| POST   | /api/auth/login       | Public | Login, get JWT      |
| GET    | /api/auth/me          | Private| Get current user    |

### Tasks

| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| GET    | /api/tasks            | Private | Get all tasks (paginated, filtered) |
| POST   | /api/tasks            | Private | Create task          |
| PUT    | /api/tasks/:id        | Private | Update task          |
| DELETE | /api/tasks/:id        | Private | Delete task          |
| PATCH  | /api/tasks/:id/toggle | Private | Toggle completion    |

#### GET /api/tasks — Query Params

| Param    | Example        | Description                   |
|----------|----------------|-------------------------------|
| search   | `search=bug`   | Full-text search (title+desc) |
| status   | `status=todo`  | Filter by status              |
| priority | `priority=high`| Filter by priority            |
| page     | `page=2`       | Pagination page               |
| limit    | `limit=10`     | Results per page              |
| sortBy   | `sortBy=dueDate` | Field to sort by            |
| sortOrder| `sortOrder=asc`| `asc` or `desc`               |

---

## ✨ Features

### Authentication
- JWT-based auth stored in localStorage
- Auto token verification on app load
- Protected routes (redirect to /login if unauthenticated)
- Global 401 interceptor — auto logout on token expiry

### Task Management
- Create, edit, delete tasks
- Toggle completion (todo ↔ completed)
- Priority: Low / Medium / High / Urgent
- Status: Todo / In Progress / Completed
- Due date with overdue detection
- Tags support
- Real-time search with 400ms debounce

### UI/UX
- Dark mode (persisted, respects OS preference)
- Responsive (mobile-first)
- Animated skeleton loaders
- Staggered list animations
- Toast notifications (react-hot-toast)
- Stat cards with clickable filter shortcuts
- Pagination with smart page range display

### Code Quality
- MVC pattern on the backend
- useReducer + Context API for state management
- Axios interceptors for auth headers + error handling
- Express-validator for input validation
- Mongoose indexes for query performance
- Global error handler middleware
- Environment variables via dotenv

---

## 🛠 Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React 18, React Router 6       |
| Styling   | Tailwind CSS 3, react-icons    |
| State     | Context API + useReducer       |
| HTTP      | Axios                          |
| Backend   | Node.js, Express.js            |
| Database  | MongoDB, Mongoose              |
| Auth      | JWT (jsonwebtoken), bcryptjs   |
| Validation| express-validator              |
| Dev tools | nodemon, concurrently          |
