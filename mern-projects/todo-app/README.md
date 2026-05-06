# Cloud-Based To-Do List Manager - MERN Stack

A simple full-stack To-Do list management application built with the MERN stack (MongoDB, Express.js, React, Node.js) for demonstrating cloud deployment on AWS.

## Project Structure

```
todo-app/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express.js backend
└── README.md
```

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **API Communication:** Axios
- **Routing:** React Router DOM

## Features

- Create, Read, Update, Delete (CRUD) to-do tasks
- View all tasks on the home dashboard
- Mark tasks as Pending or Completed
- Set task priority (Low, Medium, High)
- Track due dates

## Prerequisites

- Node.js (v18+)
- npm
- MongoDB Atlas account
- AWS account (for deployment)

## Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tododb?retryWrites=true&w=majority
```

Start the backend server:

```bash
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## AWS Deployment Notes

### Frontend (S3 + CloudFront or EC2)

```bash
cd frontend
npm run build
```

Upload the `dist/` folder to S3 or serve via EC2.

### Backend (EC2)

1. Launch an EC2 instance (Ubuntu)
2. Install Node.js
3. Clone the repo and install dependencies
4. Set environment variables
5. Use PM2 to run the server: `pm2 start src/server.js`

## License

ISC
