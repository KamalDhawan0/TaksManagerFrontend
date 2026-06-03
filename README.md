# Task Manager — Frontend

A clean, dark-mode React frontend for the Task Manager REST API built with Express, Prisma, and SQLite.

## Tech Stack

- React (Create React App)
- Axios
- CSS (custom dark theme)

## Features

- View all tasks with live stats (total, active, done)
- Add tasks with title and description
- Toggle tasks between active and completed
- Edit tasks inline
- Delete tasks
- Filter by all / active / completed
- Loading spinner on fetch
- Toast notifications for all actions

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/KamalDhawan0/TaksManagerFrontend.git
cd TaksManagerFrontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variable

Create a `.env` file in the root of the project:

```env
REACT_APP_BASE_URL=https://your-backend.onrender.com
```

### 4. Run the app

```bash
npm start
```

App runs on `http://localhost:3000`

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Fetch all tasks |
| POST | `/tasks` | Create a new task |
| PATCH | `/tasks/:id` | Update a task |
| PATCH | `/tasks/:id/toggle` | Toggle completed status |
| DELETE | `/tasks/:id` | Delete a task |

## Deployment

Deployed on **Vercel**. Every push to `main` triggers an auto-redeploy.

Make sure to add `REACT_APP_BASE_URL` in Vercel's environment variables before deploying.
