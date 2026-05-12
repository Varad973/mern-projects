#!/bin/bash
# 1. Update and install Nginx
dnf update -y
dnf install nginx -y

# 2. Clear default files
rm -rf /usr/share/nginx/html/*

# 3. Create the functional Unit Converter site
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

# 4. Set permissions and restart
chmod 644 /usr/share/nginx/html/index.html
systemctl enable nginx
systemctl start nginx