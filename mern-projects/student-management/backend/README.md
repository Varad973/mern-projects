# Student Management - Backend

Express.js REST API for the Student Record Management System.

## Tech Stack

- Node.js + Express.js
- MongoDB Atlas (Mongoose ODM)
- dotenv for environment variables

## API Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | /api/students       | Get all student records  |
| GET    | /api/students/:id   | Get a single student     |
| POST   | /api/students       | Add a new student        |
| PUT    | /api/students/:id   | Update a student         |
| DELETE | /api/students/:id   | Delete a student         |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/studentdb?retryWrites=true&w=majority
```

### 3. Run the server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Project Structure

```
backend/
├── package.json
├── README.md
└── src/
    ├── server.js                # Entry point
    ├── config/
    │   └── db.js                # MongoDB connection
    ├── controllers/
    │   └── studentController.js # Student route handlers
    ├── middlewares/
    │   └── errorHandler.js      # Error handling middleware
    ├── models/
    │   └── Student.js           # Student Mongoose model
    └── routes/
        └── studentRoutes.js     # Student API routes
```

## AWS Deployment

1. Launch an Ubuntu EC2 instance
2. SSH into the instance
3. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
4. Clone the repo and `cd backend`
5. Run `npm install`
6. Set environment variables
7. Start with PM2: `pm2 start src/server.js --name student-api`
