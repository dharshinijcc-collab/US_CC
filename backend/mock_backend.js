const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const CONFIG_PATH = path.join(__dirname, 'config.json');

const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Access-Control-Allow-Origin');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    console.log(`${req.method} ${req.url}`);

    if (req.url === '/server/api/content' && req.method === 'GET') {
        try {
            const configData = fs.readFileSync(CONFIG_PATH, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: "success",
                payload: JSON.parse(configData)
            }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: "error", payload: err.message }));
        }
    } else if (req.url === '/server/api/test-db' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "success", data: { id: 1, name: "Mock Database" } }));
    } else if (req.url === '/server/api/seed-db' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "success", payload: "Mock database seeded successfully." }));
    } else if (req.url === '/server/api/auth/admin-login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const { email, password } = JSON.parse(body);
                // Hardcoded credentials — same as Python models.py
                if (email === 'admin@ccus.com' && password === 'admin123') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        status: "success",
                        payload: { user: { email }, token: "mock-admin-token" }
                    }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: "error", payload: "Invalid email or password" }));
                }
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "error", payload: "Invalid request body" }));
            }
        });
    } else if (req.url === '/server/api/content/update' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (!data || !data.payload) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: "error", payload: "Missing payload" }));
                    return;
                }
                // Write to config.json
                const configData = JSON.stringify(data.payload, null, 2);
                fs.writeFileSync(CONFIG_PATH, configData, 'utf-8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "success", payload: "Content updated successfully" }));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "error", payload: e.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", payload: "Not Found" }));
    }
});

server.listen(PORT, () => {
    console.log(`Mock backend server running at http://localhost:${PORT}/`);
});
