# Practical Exam Guide: Static Website Hosting on AWS EC2 (Nginx)

---

## What This Practical Is About

You are deploying a **static HTML website** (a Unit Converter tool) on an **AWS EC2 instance** running Amazon Linux, using **Nginx** as the web server. The site is accessible from a browser via the instance's public IP.

---

## Key Concepts to Know (Say This to Examiner)

| Term | What to Say |
|------|-------------|
| **EC2** | Elastic Compute Cloud — a virtual machine (server) provided by AWS in the cloud |
| **Nginx** | A lightweight, high-performance web server used to serve static files over HTTP |
| **Static Website** | A website with fixed HTML/CSS/JS content — no backend/database needed |
| **Security Group** | AWS firewall rules that control which ports are open to the internet |
| **Public IP** | The IP address assigned to your EC2 instance, accessible from the internet |
| **`dnf`** | Package manager for Amazon Linux 2023 (like `apt` for Ubuntu) |
| **`/usr/share/nginx/html/`** | Default directory where Nginx looks for files to serve |
| **`systemctl`** | Linux tool to start/stop/enable system services like Nginx |

---

## Step 1 — Launch an EC2 Instance on AWS

1. Go to [AWS Console](https://console.aws.amazon.com) → **EC2** → **Launch Instance**
2. Fill in the details:
   - **Name:** `static-website-server` (or any name)
   - **AMI (OS):** `Amazon Linux 2023` (uses `dnf` — matches the script)
   - **Instance Type:** `t2.micro` (free tier eligible)
   - **Key Pair:** Create a new key pair → download the `.pem` file (save it safely!)
3. **Security Group** — this is critical:
   - Click **Edit** under Network Settings
   - Add these **Inbound Rules**:

     | Type | Protocol | Port | Source |
     |------|----------|------|--------|
     | SSH  | TCP | 22 | My IP (or Anywhere) |
     | HTTP | TCP | **80** | Anywhere (0.0.0.0/0) |

   > Port 80 MUST be open or the website won't load in the browser.

4. Click **Launch Instance** → wait ~1 minute for it to start.
5. Note the **Public IPv4 address** from the instance details page.

---

## Step 2 — Connect to the EC2 Instance via SSH

### On Windows (using Command Prompt / PowerShell):

```bash
# Navigate to where your .pem file is (e.g., Downloads)
cd Downloads

# Set correct permissions (Windows — skip if using PuTTY)
icacls "your-key.pem" /inheritance:r /grant:r "%USERNAME%:R"

# SSH into the instance
ssh -i "your-key.pem" ec2-user@<YOUR_PUBLIC_IP>
```

### On Linux/Mac:
```bash
chmod 400 your-key.pem
ssh -i "your-key.pem" ec2-user@<YOUR_PUBLIC_IP>
```

> Replace `<YOUR_PUBLIC_IP>` with the actual public IP of your EC2 instance.
> The default username for Amazon Linux is **`ec2-user`**.

---

## Step 3 — Run the Setup Script

Once connected via SSH, you have two options:

### Option A — Copy-Paste the Script (Recommended in Exam)

Run this **entire block** in the terminal at once:

```bash
#!/bin/bash
# 1. Update and install Nginx
dnf update -y
dnf install nginx -y

# 2. Clear default files
rm -rf /usr/share/nginx/html/*

# 3. Create the Unit Converter website
cat <<'EOF' > /usr/share/nginx/html/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quick Converter Tool</title>
    <style>
        :root { --primary: #3b82f6; --bg: #f8fafc; --text: #1e293b; }
        body { font-family: system-ui, -apple-system, sans-serif; background: var(--bg); color: var(--text); display: flex; justify-content: center; padding: 2rem; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
        h1 { font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--primary); text-align: center; }
        .group { margin-bottom: 1.5rem; }
        label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.5rem; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
        .result { margin-top: 0.5rem; font-size: 0.9rem; color: #64748b; font-style: italic; }
        hr { border: 0; border-top: 1px solid #e2e8f0; margin: 2rem 0; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Quick Converter</h1>
        
        <div class="group">
            <label>Celsius to Fahrenheit</label>
            <input type="number" id="celsius" placeholder="Enter Celsius" oninput="convertTemp()">
            <div id="tempResult" class="result">Result: -- °F</div>
        </div>

        <hr>

        <div class="group">
            <label>Miles to Kilometers</label>
            <input type="number" id="miles" placeholder="Enter Miles" oninput="convertDist()">
            <div id="distResult" class="result">Result: -- km</div>
        </div>

        <p style="font-size: 0.7rem; text-align: center; margin-top: 2rem; color: #94a3b8;">
            Hosted on AWS EC2 • Running Nginx
        </p>
    </div>

    <script>
        function convertTemp() {
            const c = document.getElementById('celsius').value;
            const res = document.getElementById('tempResult');
            if (c === "") { res.innerHTML = "Result: -- °F"; return; }
            const f = (c * 9/5) + 32;
            res.innerHTML = `Result: ${f.toFixed(1)} °F`;
        }

        function convertDist() {
            const m = document.getElementById('miles').value;
            const res = document.getElementById('distResult');
            if (m === "") { res.innerHTML = "Result: -- km"; return; }
            const k = m * 1.60934;
            res.innerHTML = `Result: ${k.toFixed(2)} km`;
        }
    </script>
</body>
</html>
EOF

# 4. Set permissions and start Nginx
chmod 644 /usr/share/nginx/html/index.html
systemctl enable nginx
systemctl start nginx
```

### Option B — Create a Script File and Run It

```bash
# Create the script file
nano setup.sh

# Paste the script content, then press Ctrl+O → Enter → Ctrl+X to save

# Make it executable and run
chmod +x setup.sh
sudo ./setup.sh
```

> If you get "Permission denied" errors, prefix commands with `sudo`.

---

## Step 4 — Verify Everything is Working

### Check Nginx is Running:
```bash
systemctl status nginx
```
Expected output contains: `Active: active (running)`

### Check the HTML file exists:
```bash
ls -la /usr/share/nginx/html/
cat /usr/share/nginx/html/index.html
```

### Test locally on the server:
```bash
curl http://localhost
```
This should print the HTML content of your page.

---

## Step 5 — Access the Website in Browser

Open your browser and go to:
```
http://<YOUR_PUBLIC_IP>
```

> Use **http://** (not https) — port 80, not 443.

You should see the **Quick Converter** page with:
- Celsius to Fahrenheit converter
- Miles to Kilometers converter

---

## What the Website Does (Explain to Examiner)

The page is a **single-page static HTML application** with:

| Feature | How it Works |
|---------|-------------|
| Celsius → Fahrenheit | Formula: `F = (C × 9/5) + 32` — runs in browser JavaScript |
| Miles → Kilometers | Formula: `km = miles × 1.60934` — runs in browser JavaScript |
| No backend | All logic is client-side JavaScript, no server processing needed |
| Served by Nginx | Nginx reads `index.html` from `/usr/share/nginx/html/` and sends it to the browser |

---

## What Each Script Command Does (Explain to Examiner)

```bash
dnf update -y              # Updates all installed packages (keeps system secure)
dnf install nginx -y       # Installs the Nginx web server

rm -rf /usr/share/nginx/html/*   # Removes default Nginx demo page

cat <<'EOF' > /usr/share/nginx/html/index.html
...
EOF
# Creates our custom index.html using a heredoc (multi-line string redirect)

chmod 644 /usr/share/nginx/html/index.html
# Sets file permissions: owner can read/write, others can only read
# (required so Nginx can read and serve the file)

systemctl enable nginx     # Makes Nginx start automatically on every reboot
systemctl start nginx      # Starts Nginx right now
```

---

## Common Errors & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Website not loading in browser | Port 80 not open | Go to EC2 → Security Group → Add HTTP inbound rule (port 80) |
| `ssh: connection refused` | Port 22 not open | Add SSH inbound rule in Security Group |
| `dnf: command not found` | Wrong OS (not Amazon Linux 2023) | Use `yum` instead of `dnf`, or relaunch with Amazon Linux 2023 AMI |
| `Permission denied` on commands | Not running as root | Prefix commands with `sudo` |
| Nginx status shows `failed` | Config error or port in use | Run `sudo nginx -t` to check config errors |
| `curl http://localhost` shows nothing | Nginx not started | Run `sudo systemctl start nginx` |
| Browser shows old default Nginx page | Cache issue | Hard refresh: `Ctrl + Shift + R` |

---

## Quick Reference Commands

```bash
# Check Nginx status
sudo systemctl status nginx

# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx

# Enable Nginx on boot
sudo systemctl enable nginx

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs (shows who visited)
sudo tail -f /var/log/nginx/access.log

# Test Nginx config for syntax errors
sudo nginx -t

# Check what's running on port 80
sudo ss -tlnp | grep :80
```

---

## Architecture Diagram (Draw This if Asked)

```
[Your Laptop / Browser]
        |
        | HTTP Request (port 80)
        |
[Internet]
        |
[AWS Security Group — allows port 80]
        |
[EC2 Instance — Amazon Linux 2023]
        |
[Nginx Web Server — listens on port 80]
        |
[/usr/share/nginx/html/index.html]
        |
[HTML Response sent back to browser]
```

---

## Examiner Questions & Answers

**Q: Why use Nginx instead of Apache?**
A: Nginx is faster for serving static files, uses less memory, and handles many concurrent connections better than Apache.

**Q: What is the difference between `systemctl enable` and `systemctl start`?**
A: `start` runs the service immediately. `enable` makes it start automatically every time the server reboots. We need both.

**Q: Why is `chmod 644` used?**
A: 644 = owner has read+write (6), group has read-only (4), others have read-only (4). Nginx needs read access to serve the file.

**Q: What is a static website?**
A: A website that serves fixed HTML/CSS/JS files. No database, no server-side processing. The browser runs all logic (JavaScript).

**Q: How is this different from a dynamic website?**
A: Dynamic websites use backend servers (Node.js, PHP, Python) and databases to generate content on-the-fly. Static sites have pre-written files.

**Q: What port does HTTP use?**
A: Port **80**. HTTPS uses port **443**.

**Q: What is a Security Group in AWS?**
A: It's a virtual firewall that controls inbound and outbound traffic to your EC2 instance. Without opening port 80, the website is not accessible from the internet.

**Q: Where does Nginx store its default web files?**
A: `/usr/share/nginx/html/` — the `index.html` file in this directory is served when someone visits the server's IP.

---

## Checklist Before Showing Examiner

- [ ] EC2 instance is **Running** (green status in AWS console)
- [ ] Security group has **port 80 (HTTP)** open
- [ ] SSH is connected successfully
- [ ] Script ran without errors
- [ ] `systemctl status nginx` shows **active (running)**
- [ ] `curl http://localhost` returns the HTML
- [ ] Browser opens `http://<PUBLIC_IP>` and shows the converter page
- [ ] Converter works — type a number and see the result update live
