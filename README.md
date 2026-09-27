# TaskFlow – Modern SaaS Task Management System

TaskFlow is a modern, responsive, full-stack Task Management System designed for high productivity, clean aesthetics, and team collaboration.

![TaskFlow Dashboard](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&auto=format&fit=crop&q=80)

---

## 🌟 Key Features

### 1. User Dashboard
- **Greeting & Time of Day**: Personalized greeting based on local client time.
- **KPI Metrics Cards**: Total Tasks, Completed, Pending, Overdue, Due Today, Due This Week.
- **Interactive Productivity Chart**: 7-day visual area chart powered by **Recharts**.
- **Recent Tasks & Upcoming Deadlines**: Direct access to tasks approaching their target dates.
- **Project Progress Summaries**: Live progress bars calculated from task completion states.

### 2. Flexible Task Views
- **List View**: Searchable, filterable, and sortable table with inline completion checkboxes and priority badges.
- **Kanban Board**: Drag-and-drop workflow across **To Do**, **In Progress**, and **Completed** columns with optimistic status updates.
- **Calendar View**: Visual month calendar mapping tasks to due dates. Click any date to schedule a new task.

### 3. Task Management & Details
- **Full CRUD**: Create, edit, view, and delete tasks with confirmation dialogs.
- **Subtasks with Progress Bar**: Checklist with toggle states and percentage completion.
- **Priorities & Statuses**: Low, Medium, High, Urgent; Todo, In Progress, Completed, Cancelled.
- **Tags & Search**: Instant filter by project, priority, status, tags, and fuzzy text search.
- **Comments & Activity Log**: Real-time collaborative comment thread on each task.

### 4. Projects & Categories
- Custom project creation with color accents and team member assignments.
- Built-in sample categories: *Web Development*, *IoT Project*, *College*, *Personal*, *Learning*.
- Filter tasks by project with one click.

### 5. Productivity Analytics
- Tasks completed per day, week, and month.
- Priority distribution donut chart.
- Workload by project horizontal bar chart.
- Real-time completion rates and overdue counts.

### 6. Notifications & Security
- In-app notification center with unread count badges.
- Alerts for upcoming deadlines, overdue tasks, task assignments, and comments.
- **JWT Authentication**: Secure bcrypt password hashing, token validation, and protected REST routes.
- **Role-Based Access Control**: Admin and Standard User roles.
- **Admin Dashboard**: System telemetry, user management (promote/demote roles, enable/disable accounts, delete users).

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite |
| **Styling** | Tailwind CSS, Inter Font |
| **Icons** | Lucide React |
| **Data Visualizations** | Recharts |
| **HTTP Client** | Axios with JWT Interceptors |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), Bcrypt.js, CORS |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+ recommended, verified on v22)
- **MongoDB** running locally on port `27017` (or remote MongoDB Atlas URI)

### 1. Database & Seed Data
To populate the database with realistic sample projects, tasks with subtasks, users, and comments:

```bash
cd server
npm install
npm run seed
```

### 2. Start the Backend API
```bash
cd server
npm start
# Server starts at http://localhost:5000
```

### 3. Start the Frontend Application
```bash
cd client
npm install
npm run dev
# Vite client runs at http://localhost:5173
```

---

## 🔑 Pre-Configured Demo Accounts

For instant testing, use the **One-Click Demo Access** buttons on the Login page or log in with:

| Account Type | Email | Password | Role |
|---|---|---|---|
| **Administrator** | `admin@taskflow.com` | `Admin@12345` | System Admin |
| **Standard User** | `john@taskflow.com` | `User@12345` | Team Member |

---

## 📡 API Reference

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and receive JWT
- `POST /api/auth/logout` - Clear user session
- `GET /api/auth/me` - Get authenticated user profile
- `POST /api/auth/forgot-password` - Request password reset token
- `POST /api/auth/reset-password` - Reset password with token
- `PUT /api/auth/profile` - Update name, bio, avatar, theme
- `PUT /api/auth/change-password` - Change account password

### Tasks
- `GET /api/tasks` - List tasks (supports `search`, `status`, `priority`, `project`, `dueDateFilter`, `sortBy`)
- `GET /api/tasks/:id` - Get task details with comments
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update task details
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Quick update status (for Kanban drag & drop)
- `POST /api/tasks/:id/subtasks` - Add subtask to task
- `PATCH /api/tasks/:id/subtasks/:subtaskId` - Toggle subtask completed state
- `DELETE /api/tasks/:id/subtasks/:subtaskId` - Delete subtask

### Projects
- `GET /api/projects` - Get all projects with aggregated task metrics
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project details
- `DELETE /api/projects/:id` - Delete project (unlinks associated tasks)

### Comments
- `GET /api/tasks/:id/comments` - List comments for task
- `POST /api/tasks/:id/comments` - Add comment to task
- `DELETE /api/comments/:id` - Remove comment

### Notifications
- `GET /api/notifications` - Get user notifications & unread counter
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Clear all notifications

### Analytics & Admin
- `GET /api/analytics/dashboard` - Dashboard KPIs, recent tasks, deadlines, productivity chart
- `GET /api/analytics/productivity` - Detailed charts: daily, weekly, monthly, priority & project distribution
- `GET /api/analytics/admin/stats` - System telemetry, uptime, memory, user & task totals
- `GET /api/users` - Directory of team members
- `POST /api/users` - Admin: Provision new user
- `PUT /api/users/:id` - Admin or Self: Update profile or role/status
- `DELETE /api/users/:id` - Admin: Remove user account

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=taskflow_super_secret_jwt_key_2026_secure
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🎨 Theme & Accessibility
- **Light & Dark Mode**: Persistent toggle via top navigation bar and account settings.
- **Keyboard Navigation**: Modal dialogues support `Esc` light dismiss and outside backdrop dismissal.
- **Responsive Layout**: Collapsible sidebar on desktop and full off-canvas drawer on mobile screens.

---

## 📄 License & Author

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 **Kota Adbuth kumar**

