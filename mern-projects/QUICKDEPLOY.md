# MERN Quick Deploy

Only replace `YOUR_BACKEND_PUBLIC_IP` before pasting.

---

## BACKEND

```bash
sudo apt update && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs git nginx
git clone https://github.com/Vivek-026/Cloud-Computing.git
cd Cloud-Computing/mern-projects/event-app/backend
npm install
cat <<'EOF' > .env
MONGODB_URI=mongodb+srv://vkbhamare26_db_user:lEML4pbtAI6KrMfo@cluster0.sspjpor.mongodb.net/?appName=Cluster0
PORT=5000
EOF
sudo npm install -g pm2
pm2 start src/server.js --name backend
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
cat <<'EOF' | sudo tee /etc/nginx/sites-available/backend
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
EOF
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl enable nginx && sudo systemctl restart nginx
```

---

## FRONTEND

```bash
sudo apt update && curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs git nginx
git clone https://github.com/Vivek-026/Cloud-Computing.git
cd Cloud-Computing/mern-projects/event-app/frontend
cat <<'EOF' > .env
VITE_API_URL=http://YOUR_BACKEND_PUBLIC_IP/api
EOF
npm install && npm run build
sudo rm -rf /var/www/html/* && sudo cp -r dist/* /var/www/html/
cat <<'EOF' | sudo tee /etc/nginx/sites-available/frontend
server {
    listen 80;
    root /var/www/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl enable nginx && sudo systemctl restart nginx
```
