# MERN Stack Deployment on AWS EC2 + MongoDB Atlas

---

## Architecture

```
[User Browser]
      │
      ▼
[EC2 Instance 1 — Frontend]       [EC2 Instance 2 — Backend]
  Nginx serves React build    ──►   Nginx → Node.js :5000
  /api requests proxied ──────────► Express API
                                         │
                                         ▼
                                  [MongoDB Atlas]
                                  (cloud database)
```

| Instance | What runs | Port exposed |
|----------|-----------|--------------|
| Frontend EC2 | Nginx serving React `dist/` | 80 |
| Backend EC2 | Nginx → Node.js (PM2) | 80 (proxies to 5000) |
| MongoDB Atlas | Cloud DB | 27017 (internal) |

---

## PHASE 1 — MongoDB Atlas Setup

### Step 1 — Create a Free Cluster

1. Go to [mongodb.com/cloud/atlas](https://cloud.mongodb.com) → **Sign up / Login**
2. Click **Create a deployment** → choose **M0 Free**
3. Provider: AWS, Region: `ap-south-1` (Mumbai) → Click **Create**

### Step 2 — Create Database User

1. Left panel → **Database Access** → **Add New Database User**
2. Fill in:

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `yourpassword` (save this) |
| Role | `Atlas admin` |

3. Click **Add User**

### Step 3 — Whitelist All IPs

1. Left panel → **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** → `0.0.0.0/0`
3. Click **Confirm**

> This allows your EC2 backend to connect to Atlas from any IP.

### Step 4 — Get Connection String

1. Left panel → **Database** → **Connect** → **Drivers**
2. Driver: `Node.js` → Copy the connection string:

```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

3. Replace `<password>` with your actual password → **save this string**

---

## PHASE 2 — Launch Two EC2 Instances

### Step 5 — Launch Backend Instance

1. EC2 → **Launch Instance**

| Setting | Value |
|---------|-------|
| Name | `mern-backend` |
| AMI | `Ubuntu Server 22.04 LTS` |
| Instance Type | `t2.micro` |
| Key pair | Proceed without (use EC2 Instance Connect) |

**Security Group — Backend:**

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | Anywhere |
| HTTP | 80 | Anywhere `0.0.0.0/0` |
| Custom TCP | 5000 | Anywhere `0.0.0.0/0` |

2. Launch instance → note the **Public IP** of backend

---

### Step 6 — Launch Frontend Instance

1. EC2 → **Launch Instance**

| Setting | Value |
|---------|-------|
| Name | `mern-frontend` |
| AMI | `Ubuntu Server 22.04 LTS` |
| Instance Type | `t2.micro` |
| Key pair | Proceed without |

**Security Group — Frontend:**

| Type | Port | Source |
|------|------|--------|
| SSH | 22 | Anywhere |
| HTTP | 80 | Anywhere `0.0.0.0/0` |

2. Launch instance → note the **Public IP** of frontend

---

## PHASE 3 — Backend EC2 Setup

Connect to `mern-backend` via **EC2 Instance Connect** (browser terminal).

### Step 7 — Install Node.js

```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### Step 8 — Install Git and Clone Project

```bash
sudo apt install -y git
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/backend
```

> If no GitHub repo, upload via SCP from your local machine:
> ```bash
> scp -r ./backend ubuntu@<BACKEND_PUBLIC_IP>:/home/ubuntu/
> ```

### Step 9 — Install Dependencies

```bash
npm install
```

### Step 10 — Create `.env` File

```bash
nano .env
```

Paste this (replace with your actual Atlas URI):

```
MONGODB_URI=mongodb+srv://admin:yourpassword@cluster0.xxxxx.mongodb.net/blogdb?retryWrites=true&w=majority
PORT=5000
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

### Step 11 — Install PM2 (Process Manager)

PM2 keeps Node.js running after you close the terminal.

```bash
sudo npm install -g pm2
```

### Step 12 — Start Backend with PM2

```bash
pm2 start src/server.js --name backend
pm2 save
pm2 startup
```

Run the command that `pm2 startup` outputs (it starts with `sudo env PATH=...`).

Verify it's running:

```bash
pm2 status
```

Expected:
```
┌─────┬──────────┬─────────┬──────┬───────────┐
│ id  │ name     │ status  │ cpu  │ memory    │
├─────┼──────────┼─────────┼──────┼───────────┤
│ 0   │ backend  │ online  │ 0%   │ 50mb      │
└─────┴──────────┴─────────┴──────┴───────────┘
```

Test it directly:

```bash
curl http://localhost:5000
```

Expected: `{"message":"Blog App API is running"}`

### Step 13 — Install and Configure Nginx (Backend)

```bash
sudo apt install -y nginx
```

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/backend
```

Paste:

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the config and remove the default:

```bash
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

Test and start Nginx:

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

Test via public IP:

```bash
curl http://localhost
```

Expected: `{"message":"Blog App API is running"}`

---

## PHASE 4 — Frontend EC2 Setup

Connect to `mern-frontend` via **EC2 Instance Connect**.

### Step 14 — Install Node.js

```bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

### Step 15 — Clone Project

```bash
sudo apt install -y git
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>/frontend
```

### Step 16 — Create `.env` File for Frontend

Every page in this project reads the backend URL from `VITE_API_URL`:
```js
const API_URL = import.meta.env.VITE_API_URL || "/api";
```

So just create a `.env` file in the frontend folder:

```bash
nano .env
```

Paste:

```
VITE_API_URL=http://<BACKEND_PUBLIC_IP>/api
```

Replace `<BACKEND_PUBLIC_IP>` with your actual backend EC2 public IP. Example:

```
VITE_API_URL=http://13.233.45.120/api
```

Save: `Ctrl+O` → Enter → `Ctrl+X`

> Vite bakes this value into the production build at build time — every axios call will go directly to your backend IP.

### Step 17 — Build the React App

```bash
npm install
npm run build
```

This creates a `dist/` folder with the production-ready static files.

Verify:

```bash
ls dist/
```

Expected: `index.html`, `assets/` folder

### Step 18 — Install Nginx and Serve the Build

```bash
sudo apt install -y nginx
```

Copy build files to Nginx web root:

```bash
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
```

Configure Nginx to handle React Router (single page app):

```bash
sudo nano /etc/nginx/sites-available/frontend
```

Paste:

```nginx
server {
    listen 80;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://<BACKEND_PUBLIC_IP>/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

> Replace `<BACKEND_PUBLIC_IP>` with actual backend IP.
> The `/api/` block proxies API calls from the frontend to the backend — no CORS issues.

Enable the config and remove the default:

```bash
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

Test and start:

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

---

## PHASE 5 — Verify Everything Works

### On Backend EC2:

```bash
# PM2 running
pm2 status

# API responding
curl http://localhost:5000

# Nginx proxying correctly
curl http://localhost
```

### On Frontend EC2:

```bash
# Files are in place
ls /var/www/html/

# Nginx running
sudo systemctl status nginx
```

### In Browser:

```
http://<FRONTEND_PUBLIC_IP>
```

The React app should load and be able to fetch data from the backend.

---

## PM2 Useful Commands

```bash
pm2 status              # See all running processes
pm2 logs backend        # Live logs of backend
pm2 restart backend     # Restart after code change
pm2 stop backend        # Stop the process
pm2 delete backend      # Remove from PM2
pm2 save                # Save process list (survives reboot)
```

---

## Common Errors & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| `curl localhost:5000` fails | PM2 not running | `pm2 restart backend` |
| MongoDB connection error | Wrong URI or IP not whitelisted | Check `.env` URI, whitelist `0.0.0.0/0` on Atlas |
| Frontend loads but API calls fail | Wrong backend IP in axios | Update `axios.defaults.baseURL` with correct backend IP |
| `npm run build` fails | Missing env or import errors | Check console, fix import paths |
| Nginx `test failed` | Config syntax error | Check `sudo nginx -t` output and fix the conf file |
| Page refreshes give 404 | React Router not configured in Nginx | Make sure `try_files $uri $uri/ /index.html` is in config |
| CORS error in browser | Backend not allowing frontend origin | Add `app.use(cors({ origin: 'http://<FRONTEND_IP>' }))` in server.js |

---

## Architecture Summary (Say This to Examiner)

```
Browser → http://FRONTEND_IP
            │
     [Nginx on Frontend EC2]
            │
     serves dist/index.html (React)
            │
     /api/* requests →
            │
     [Nginx on Backend EC2]
            │
     proxy_pass → localhost:5000
            │
     [Node.js / Express (PM2)]
            │
     Mongoose →
            │
     [MongoDB Atlas — cloud]
```

---

## Examiner Questions & Answers

**Q: Why two separate EC2 instances?**
A: Separation of concerns — frontend and backend scale independently. In production, you might have multiple backend instances behind a load balancer while keeping one frontend server.

**Q: What is PM2?**
A: A process manager for Node.js. It keeps the app running after the terminal closes, auto-restarts on crash, and starts the app on server reboot.

**Q: Why Nginx in front of Node.js?**
A: Nginx handles SSL termination, load balancing, serving static files efficiently, and acts as a reverse proxy. Node.js alone shouldn't be exposed directly on port 80.

**Q: What is a reverse proxy?**
A: A server (Nginx) that sits in front of your app server (Node.js) and forwards incoming requests to it. The client talks to Nginx on port 80 — Nginx forwards to Node.js on port 5000.

**Q: Why MongoDB Atlas instead of a local MongoDB?**
A: Atlas is managed — no setup, automatic backups, replication, and it's accessible from anywhere. Running MongoDB on EC2 would require manual maintenance and security hardening.

**Q: How does the frontend talk to the backend?**
A: The frontend React app makes HTTP requests to `/api/...`. Nginx on the frontend server proxies those requests to the backend EC2's public IP.

**Q: What does `npm run build` do?**
A: Vite compiles all React JSX files, bundles JavaScript, minifies CSS, and outputs a `dist/` folder of plain HTML/CSS/JS that any web server can serve.

---

## Checklist Before Showing Examiner

- [ ] MongoDB Atlas cluster created, user added, `0.0.0.0/0` whitelisted
- [ ] Backend EC2 running, port 80 and 5000 open in security group
- [ ] Node.js installed on backend EC2
- [ ] `.env` file created with correct `MONGODB_URI`
- [ ] `npm install` done on backend
- [ ] PM2 running backend — `pm2 status` shows `online`
- [ ] `curl http://localhost:5000` returns API response
- [ ] Nginx on backend proxying port 80 → 5000
- [ ] Frontend EC2 running, port 80 open
- [ ] Node.js installed on frontend EC2
- [ ] `.env` file created in frontend folder with `VITE_API_URL=http://<BACKEND_PUBLIC_IP>/api`
- [ ] `npm run build` completed — `dist/` folder exists
- [ ] `dist/` copied to `/usr/share/nginx/html/`
- [ ] Nginx on frontend configured with `try_files` for React Router
- [ ] Browser opens `http://<FRONTEND_IP>` and app loads
- [ ] App can fetch and display data (blogs/products/etc.)
