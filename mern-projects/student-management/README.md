# Cloud-Based Student Record Management System - MERN Stack

A simple full-stack student record management system built with the MERN stack (MongoDB, Express.js, React, Node.js) for demonstrating cloud deployment on AWS.

## Project Structure

```
krrish2906-student-management/
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

- Add new student records
- View all student records in a table
- View individual student details
- Update student information
- Delete student records
- Department and year-based organization

## Prerequisites

- Node.js (v18+)
- npm
- MongoDB Atlas account
- AWS account (for deployment)

## Quick Start

### 1. Clone the repository

```bash
git clone <repo-url>
cd krrish2906-student-management
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```
PORT=5000
MONGODB_URI=mongodb+srv://mernuser:mern1234@cluster0.e6i6uo0.mongodb.net/ecommdb?retryWrites=true&w=majority
```

Start the backend server:

```bash
npm run dev
```

### 3. Setup Frontend

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

### 4. Open the App

Visit `http://localhost:5173` in your browser.

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user with read/write access
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get the connection string and add it to `backend/.env`

## AWS Deployment Notes

### Frontend (S3 + CloudFront or EC2)

```bash
cd frontend
npm run build
```

Upload the `dist/` folder to S3 or serve via EC2.

### Backend (EC2)

1. Launch an EC2 instance (Ubuntu)
2. Install Node.js on the instance
3. Clone the repo and install dependencies
4. Set environment variables
5. Use PM2 to run the server: `pm2 start src/server.js`

### Environment Variables on AWS

Set the following on your EC2 instance:

- `PORT=5000`
- `MONGODB_URI=<your-atlas-connection-string>`
- `VITE_API_URL=http://<ec2-public-ip>:5000/api`

## License

ISC
