# Practical Exam Guide: Static Website Hosting on AWS EC2 (Nginx)

---

## What This Practical Is About

You are deploying a **static HTML website** (a Unit Converter tool) on an **AWS EC2 instance** running Amazon Linux, using **Nginx** as the web server. The script runs automatically on boot via **EC2 User Data** — no SSH or terminal required.

---

## Key Concepts to Know (Say This to Examiner)

| Term | What to Say |
|------|-------------|
| **EC2** | Elastic Compute Cloud — a virtual machine (server) provided by AWS in the cloud |
| **Nginx** | A lightweight, high-performance web server used to serve static files over HTTP |
| **Static Website** | A website with fixed HTML/CSS/JS content — no backend/database needed |
| **Security Group** | AWS firewall rules that control which ports are open to the internet |
| **User Data** | A script you give to EC2 at launch time — AWS runs it automatically as root on the first boot |
| **Public IP** | The IP address assigned to your EC2 instance, accessible from the internet |
| **`dnf`** | Package manager for Amazon Linux 2023 (like `apt` for Ubuntu) |
| **`/usr/share/nginx/html/`** | Default directory where Nginx looks for files to serve |
| **`systemctl`** | Linux tool to start/stop/enable system services like Nginx |

---

## Step 1 — Launch EC2 Instance

1. Go to AWS Console → **EC2** → **Launch Instance**
2. Fill in:
   - **Name:** `static-website-server`
   - **AMI:** `Amazon Linux 2023` (must be this — script uses `dnf`)
   - **Instance Type:** `t2.micro` (free tier)
   - **Key Pair:** `Proceed without key pair` (no SSH needed) — or create one if examiner may ask you to SSH

---

## Step 2 — Open Port 80 in Security Group

Under **Network Settings** → click **Edit**:

| Type | Protocol | Port | Source |
|------|----------|------|--------|
| HTTP | TCP | **80** | Anywhere `0.0.0.0/0` |

> Port 80 is mandatory — this is what lets the browser reach your website.
> No need to add SSH (port 22) unless you plan to connect to the terminal.

---

## Step 3 — Paste Script in User Data

1. Scroll down to **Advanced Details**
2. Find the **User Data** text box at the bottom
3. Paste the **entire script** below:

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

4. Click **Launch Instance**

---

## Step 4 — Wait for It to Boot

- Wait **2–3 minutes** for the instance to reach `Running` state
- The User Data script runs automatically during this boot time
- Copy the **Public IPv4 address** from the instance details page

> User Data runs as root automatically — no `sudo` needed, no SSH needed.

---

## Step 5 — Open the Website

In your browser, go to:

```
http://<YOUR_PUBLIC_IP>
```

> Always use `http://` not `https://` — we opened port 80, not 443.

You should see the **Quick Converter** page with working converters.

---

## What the Website Does (Explain to Examiner)

| Feature | How it Works |
|---------|-------------|
| Celsius → Fahrenheit | Formula: `F = (C × 9/5) + 32` — runs in browser JavaScript |
| Miles → Kilometers | Formula: `km = miles × 1.60934` — runs in browser JavaScript |
| No backend | All logic is client-side JavaScript, no server processing needed |
| Served by Nginx | Nginx reads `index.html` from `/usr/share/nginx/html/` and sends it to the browser |

---

## What Each Script Command Does (Explain to Examiner)

```bash
#!/bin/bash               # Tells the OS to run this as a bash shell script

dnf update -y             # Updates all installed packages
dnf install nginx -y      # Installs the Nginx web server

rm -rf /usr/share/nginx/html/*   # Removes the default Nginx welcome page

cat <<'EOF' > /usr/share/nginx/html/index.html
...
EOF
# Heredoc — writes everything between <<'EOF' and EOF into the file directly

chmod 644 /usr/share/nginx/html/index.html
# 644 = owner: read+write, group: read, others: read
# Nginx must be able to read the file to serve it

systemctl enable nginx    # Auto-start Nginx on every reboot
systemctl start nginx     # Start Nginx immediately right now
```

---

## What is User Data? (Examiner May Ask)

**User Data** is a feature of AWS EC2 that lets you pass a shell script to the instance at launch time. AWS automatically runs this script **once on the very first boot**, as the `root` user. This is used for:
- Installing software (Nginx, Node.js, etc.)
- Configuring the server
- Deploying application files

This means the entire setup is automated — the instance boots and the website is ready without any manual SSH or terminal work.

---

## Architecture Diagram (Draw This if Asked)

```
[Your Browser]
      |
      | HTTP Request → port 80
      |
[Internet]
      |
[AWS Security Group — Inbound port 80 open]
      |
[EC2 Instance — Amazon Linux 2023]
      |
      |-- User Data ran on boot → installed Nginx → created index.html
      |
[Nginx Web Server — listening on port 80]
      |
[/usr/share/nginx/html/index.html]
      |
[HTML + JS sent back → Browser renders the converter]
```

---

## Common Errors & Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Website not loading | Port 80 not open | EC2 → Security Group → Add HTTP rule (port 80, `0.0.0.0/0`) |
| Website shows default Nginx page | User Data didn't run or wrong script | Terminate and relaunch; make sure script starts with `#!/bin/bash` |
| Browser shows "This site can't be reached" | Instance still booting | Wait 2–3 more minutes and refresh |
| `https://` doesn't work | Port 443 not open (we only set up HTTP) | Use `http://` not `https://` |
| Wrong page or old content | Browser cache | Hard refresh: `Ctrl + Shift + R` |
| AMI mismatch | Used Ubuntu (uses `apt`, not `dnf`) | Relaunch with **Amazon Linux 2023** AMI |

---

## Examiner Questions & Answers

**Q: What is User Data in EC2?**
A: User Data is a script passed to EC2 at launch time. AWS runs it automatically on the first boot as root. It's used to automate server setup without needing to SSH.

**Q: Why use Nginx instead of Apache?**
A: Nginx is faster for serving static files, uses less memory, and handles many concurrent connections efficiently.

**Q: What is the difference between `systemctl enable` and `systemctl start`?**
A: `start` runs Nginx immediately. `enable` makes it start automatically on every reboot. We need both.

**Q: Why is `chmod 644` used?**
A: 644 means owner has read+write, group has read-only, others have read-only. Nginx needs read access to serve the file to users.

**Q: What is a static website?**
A: A website with fixed HTML/CSS/JS files. No database or backend server processes requests — the browser runs all the logic.

**Q: What port does HTTP use? What about HTTPS?**
A: HTTP uses port **80**. HTTPS uses port **443**.

**Q: What is a Security Group?**
A: A virtual firewall in AWS that controls inbound and outbound traffic to your EC2 instance. We opened port 80 so browsers can reach the website.

**Q: Where does Nginx serve files from by default?**
A: `/usr/share/nginx/html/` — the `index.html` in this folder is served when someone visits the server's IP on port 80.

**Q: Why `#!/bin/bash` at the top?**
A: It's called a shebang line — it tells the OS which interpreter to use to run the script (bash in this case).

---

## Checklist Before Showing Examiner

- [ ] AMI selected is **Amazon Linux 2023**
- [ ] Security group has **port 80 (HTTP)** open with source `0.0.0.0/0`
- [ ] User Data script is pasted correctly (starts with `#!/bin/bash`)
- [ ] Instance status is **Running** (green) in AWS console
- [ ] Waited **2–3 minutes** after Running status for boot script to finish
- [ ] Copied the **Public IPv4 address**
- [ ] Browser opens `http://<PUBLIC_IP>` — shows **Quick Converter** page
- [ ] Typed a number in Celsius field — result updates live
- [ ] Typed a number in Miles field — result updates live
