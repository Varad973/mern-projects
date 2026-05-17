# MERN Stack Deployment on AWS EC2

A complete step-by-step guide to deploy a MERN (MongoDB Atlas, Express, React, Node.js) blog application on two AWS EC2 instances.

## Architecture Overview

| Component       | Platform                  |
|-----------------|---------------------------|
| **Frontend**    | EC2 Instance 2 (Nginx)    |
| **Backend**     | EC2 Instance 1 (Node.js + PM2) |
| **Database**    | MongoDB Atlas (Cloud)     |

---

## Prerequisites

- AWS Account with 2 EC2 instances (Ubuntu) launched
- MongoDB Atlas cluster created
- GitHub repository with your MERN project
- Security Groups configured:
  - **Backend Instance:** Inbound rules for Port `22` (SSH), Port `5000` (API)
  - **Frontend Instance:** Inbound rules for Port `22` (SSH), Port `80` (HTTP)

---

## Part 1 — MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and sign in.
2. Create a cluster (free tier works).
3. Go to **Database Access** → Add a database user with username and password.
4. Go to **Network Access** → Click **Add IP Address** → Select **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Go to **Database** → Click **Connect** → Choose **Connect your application** → Copy the connection string.

Your connection string will look like:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
```

---

## Part 2 — Backend Deployment (EC2 Instance 1)

### Step 1: Connect to Instance

Go to **AWS Console → EC2 → Instances → Select Backend Instance → Click "Connect" → EC2 Instance Connect → Click "Connect"**

### Step 2: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:

```bash
node -v
npm -v
```

### Step 4: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### Step 5: Clone the Repository

```bash
git clone https://github.com/Vivek-026/Cloud-Computing.git
cd Cloud-Computing/mern-projects/blog-app/backend
```

### Step 6: Install Dependencies

```bash
npm install
```

### Step 7: Create Environment File

```bash
nano .env
```

Add the following (replace with your actual values):

```env
mongodb+srv://mernuser:mern1234@cluster0.e6i6uo0.mongodb.net/merndb?appName=Cluster0
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

### Step 8: Start Backend with PM2

```bash
pm2 start src/server.js --name backend
```

### Step 9: Verify Backend is Running

```bash
pm2 status
```

You should see the `backend` process with status `online`.

Test in browser:

```
http://<backend-public-ip>:5000
```

### Step 10: Enable PM2 Auto-Start on Reboot

```bash
pm2 startup
pm2 save
```

---

## Part 3 — Frontend Deployment (EC2 Instance 2)

### Step 1: Connect to Instance

Go to **AWS Console → EC2 → Instances → Select Frontend Instance → Click "Connect" → EC2 Instance Connect → Click "Connect"**

### Step 2: Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 4: Install Nginx

```bash
sudo apt install -y nginx
```

### Step 5: Clone the Repository

```bash
git clone https://github.com/Vivek-026/Cloud-Computing.git
cd Cloud-Computing/mern-projects/blog-app/frontend
```

### Step 6: Configure API URL

```bash
nano .env
```

Add (replace with your **backend** instance's public IP):

```env
VITE_API_URL=http://<backend-public-ip>:5000
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

> **Note:** If your app uses `REACT_APP_` prefix, check your source code for the correct variable name.

### Step 7: Install Dependencies and Build

```bash
npm install
npm run build
```

This creates a `dist/` folder (Vite) with the production build.

### Step 8: Copy Build to Nginx

```bash
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
```

### Step 9: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

**Delete everything** in the file (`Ctrl+K` repeatedly) and paste:

```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;
    server_name _;

    location / {
        try_files $uri /index.html;
    }
}
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

### Step 10: Test and Restart Nginx

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Step 11: Verify Frontend

Open in browser:

```
http://<frontend-public-ip>
```

Your React application should now be live and connected to the backend.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection refused | Atlas → Network Access → Add `0.0.0.0/0` |
| API calls failing from frontend | Verify `.env` has correct backend public IP and port |
| Port not reachable | Check EC2 Security Group inbound rules |
| Nginx shows default page | Ensure `dist/*` was copied to `/var/www/html/` |
| App crashes after terminal disconnect | Backend should be running under PM2 (`pm2 status`) |
| CORS errors | In Express backend, add `cors({ origin: "http://<frontend-public-ip>" })` |
| `build/*` not found | Vite uses `dist/` folder, not `build/` |
| PM2 script not found | Check `package.json` for correct entry path (e.g., `src/server.js`) |

---

## Useful Commands Reference

| Command | Description |
|---------|-------------|
| `pm2 status` | Check backend process status |
| `pm2 logs backend` | View backend logs |
| `pm2 restart backend` | Restart backend |
| `pm2 stop backend` | Stop backend |
| `sudo systemctl status nginx` | Check Nginx status |
| `sudo systemctl restart nginx` | Restart Nginx |
| `sudo nginx -t` | Test Nginx config |

---

## Exam Demo Order

1. Show **MongoDB Atlas** dashboard — cluster, collections, network access settings
2. Show **Backend EC2** — run `pm2 status`, open API endpoint in browser
3. Show **Frontend EC2** — open the website, demonstrate CRUD operations
4. Walk through **source code** — folder structure, routes, models, React components
5. Explain the **architecture** — how frontend calls backend, backend connects to Atlas

---

## Author

**Vivek** — Cloud Computing Practical Exam
