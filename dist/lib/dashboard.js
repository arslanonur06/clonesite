import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
export class BrandProtectionDashboard {
    port;
    app;
    server;
    wss;
    metrics;
    constructor(port = 3000) {
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.wss = new WebSocketServer({ server: this.server });
        this.metrics = {
            totalDomains: 0,
            activeDomains: 0,
            cloneCount: 0,
            riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
            recentAlerts: [],
            geographicDistribution: {},
            trendData: []
        };
        this.setupRoutes();
        this.setupWebSocket();
    }
    setupRoutes() {
        // Serve static files
        this.app.use(express.static('dashboard/public'));
        this.app.use(express.json());
        // API endpoints
        this.app.get('/api/metrics', (req, res) => {
            res.json(this.metrics);
        });
        this.app.get('/api/domains', async (req, res) => {
            try {
                // Load domain data from database
                const domains = await this.loadDomainData();
                res.json(domains);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to load domain data' });
            }
        });
        this.app.get('/api/threats', async (req, res) => {
            try {
                const threats = await this.loadThreatData();
                res.json(threats);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to load threat data' });
            }
        });
        this.app.post('/api/takedown', async (req, res) => {
            try {
                const { domain, type } = req.body;
                // Trigger takedown process
                const result = await this.triggerTakedown(domain, type);
                res.json(result);
            }
            catch (error) {
                res.status(500).json({ error: 'Takedown request failed' });
            }
        });
        // Main dashboard page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../../dashboard/public/index.html'));
        });
    }
    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            console.log('Dashboard client connected');
            // Send initial metrics
            ws.send(JSON.stringify({
                type: 'metrics',
                data: this.metrics
            }));
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleWebSocketMessage(ws, data);
                }
                catch (error) {
                    console.error('Invalid WebSocket message:', error);
                }
            });
            ws.on('close', () => {
                console.log('Dashboard client disconnected');
            });
        });
    }
    handleWebSocketMessage(ws, data) {
        switch (data.type) {
            case 'subscribe':
                // Subscribe to real-time updates
                break;
            case 'scan':
                // Trigger new scan
                this.triggerScan(data.brand);
                break;
            case 'takedown':
                // Trigger takedown
                this.triggerTakedown(data.domain, data.type);
                break;
        }
    }
    async loadDomainData() {
        try {
            // Load from SQLite database
            const { openDb } = await import('./db.js');
            const db = openDb('data/monitor.db');
            return db.prepare('SELECT * FROM variants ORDER BY lastChecked DESC LIMIT 100').all();
        }
        catch (error) {
            console.error('Failed to load domain data:', error);
            return [];
        }
    }
    async loadThreatData() {
        try {
            // Load threat intelligence data
            const threatFiles = await fs.readdir('data/threats', { withFileTypes: true });
            const threats = [];
            for (const file of threatFiles.filter(f => f.isFile() && f.name.endsWith('.json'))) {
                const threatData = JSON.parse(await fs.readFile(path.join('data/threats', file.name), 'utf8'));
                threats.push(threatData);
            }
            return threats;
        }
        catch (error) {
            console.error('Failed to load threat data:', error);
            return [];
        }
    }
    async triggerScan(brand) {
        try {
            // Trigger comprehensive scan
            const { generateDomainVariants } = await import('./variants.js');
            const { checkDomains } = await import('./check.js');
            const variants = generateDomainVariants(brand);
            const results = await checkDomains(variants.map(v => v.domain), 10);
            // Update metrics
            this.updateMetrics({
                totalDomains: variants.length,
                activeDomains: results.filter(r => r.isRegistered).length
            });
            // Broadcast update to all connected clients
            this.broadcastUpdate('scan_complete', { brand, results: results.length });
        }
        catch (error) {
            console.error('Scan trigger failed:', error);
        }
    }
    async triggerTakedown(domain, type) {
        try {
            const { createTakedownRequest, sendTakedownRequest } = await import('./legal-automation.js');
            const request = await createTakedownRequest(domain, type, []);
            const sent = await sendTakedownRequest(request, 'Brand');
            if (sent) {
                this.addAlert({
                    domain,
                    type: 'takedown_sent',
                    severity: 'info',
                    timestamp: new Date().toISOString()
                });
            }
            return { success: sent, request };
        }
        catch (error) {
            console.error('Takedown trigger failed:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }
    updateMetrics(updates) {
        this.metrics = { ...this.metrics, ...updates };
        this.broadcastUpdate('metrics', this.metrics);
    }
    addAlert(alert) {
        this.metrics.recentAlerts.unshift(alert);
        this.metrics.recentAlerts = this.metrics.recentAlerts.slice(0, 50); // Keep last 50
        this.broadcastUpdate('alert', alert);
    }
    broadcastUpdate(type, data) {
        const message = JSON.stringify({ type, data });
        this.wss.clients.forEach(client => {
            if (client.readyState === 1) { // WebSocket.OPEN
                client.send(message);
            }
        });
    }
    start() {
        return new Promise((resolve) => {
            this.server.listen(this.port, () => {
                console.log(`Dashboard server running on http://localhost:${this.port}`);
                resolve();
            });
        });
    }
    stop() {
        return new Promise((resolve) => {
            this.server.close(() => {
                console.log('Dashboard server stopped');
                resolve();
            });
        });
    }
}
// Dashboard HTML template
export const dashboardHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Brand Protection Dashboard</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: #f5f5f5; }
        .header { background: #1a1a1a; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .metric-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2rem; font-weight: bold; color: #2563eb; }
        .metric-label { color: #6b7280; font-size: 0.875rem; text-transform: uppercase; }
        .alerts { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
        .alert-item { padding: 0.75rem; border-left: 4px solid #ef4444; background: #fef2f2; margin-bottom: 0.5rem; }
        .domains-table { background: white; border-radius: 8px; overflow: hidden; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #f9fafb; font-weight: 600; }
        .status-badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 500; }
        .status-high { background: #fee2e2; color: #991b1b; }
        .status-medium { background: #fef3c7; color: #92400e; }
        .status-low { background: #dcfce7; color: #166534; }
        .btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem; }
        .btn-primary { background: #2563eb; color: white; }
        .btn-danger { background: #dc2626; color: white; }
        .connected { color: #10b981; }
        .disconnected { color: #ef4444; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Brand Protection Dashboard</h1>
        <div>Status: <span id="connection-status" class="disconnected">Disconnected</span></div>
    </div>
    
    <div class="container">
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value" id="total-domains">0</div>
                <div class="metric-label">Total Domains</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="active-domains">0</div>
                <div class="metric-label">Active Domains</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="clone-count">0</div>
                <div class="metric-label">Detected Clones</div>
            </div>
            <div class="metric-card">
                <div class="metric-value" id="high-risk">0</div>
                <div class="metric-label">High Risk</div>
            </div>
        </div>
        
        <div class="alerts">
            <h2>Recent Alerts</h2>
            <div id="alerts-container">
                <p>No recent alerts</p>
            </div>
        </div>
        
        <div class="domains-table">
            <h2 style="padding: 1rem;">Domain Monitoring</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>Status</th>
                        <th>Risk Level</th>
                        <th>Last Checked</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="domains-tbody">
                    <tr><td colspan="5">Loading...</td></tr>
                </tbody>
            </table>
        </div>
    </div>
    
    <script>
        const ws = new WebSocket(\`ws://\${location.host}\`);
        const statusEl = document.getElementById('connection-status');
        
        ws.onopen = () => {
            statusEl.textContent = 'Connected';
            statusEl.className = 'connected';
        };
        
        ws.onclose = () => {
            statusEl.textContent = 'Disconnected';
            statusEl.className = 'disconnected';
        };
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleMessage(message);
        };
        
        function handleMessage(message) {
            switch (message.type) {
                case 'metrics':
                    updateMetrics(message.data);
                    break;
                case 'alert':
                    addAlert(message.data);
                    break;
                case 'scan_complete':
                    console.log('Scan complete:', message.data);
                    break;
            }
        }
        
        function updateMetrics(metrics) {
            document.getElementById('total-domains').textContent = metrics.totalDomains;
            document.getElementById('active-domains').textContent = metrics.activeDomains;
            document.getElementById('clone-count').textContent = metrics.cloneCount;
            document.getElementById('high-risk').textContent = metrics.riskDistribution.high + metrics.riskDistribution.critical;
        }
        
        function addAlert(alert) {
            const container = document.getElementById('alerts-container');
            const alertEl = document.createElement('div');
            alertEl.className = 'alert-item';
            alertEl.innerHTML = \`<strong>\${alert.domain}</strong> - \${alert.type} (\${alert.severity}) - \${new Date(alert.timestamp).toLocaleString()}\`;
            container.insertBefore(alertEl, container.firstChild);
        }
        
        function triggerTakedown(domain, type) {
            fetch('/api/takedown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain, type })
            }).then(response => response.json())
              .then(data => console.log('Takedown result:', data));
        }
        
        // Load initial data
        fetch('/api/domains')
            .then(response => response.json())
            .then(domains => {
                const tbody = document.getElementById('domains-tbody');
                tbody.innerHTML = domains.map(domain => \`
                    <tr>
                        <td>\${domain.domain}</td>
                        <td>\${domain.status}</td>
                        <td><span class="status-badge status-\${domain.riskLevel || 'low'}">\${domain.riskLevel || 'Low'}</span></td>
                        <td>\${domain.lastChecked ? new Date(domain.lastChecked).toLocaleString() : 'Never'}</td>
                        <td>
                            <button class="btn btn-danger" onclick="triggerTakedown('\${domain.domain}', 'phishing')">Takedown</button>
                        </td>
                    </tr>
                \`).join('');
            });
    </script>
</body>
</html>
`;
export async function startDashboard(port = 3000) {
    // Create dashboard directory
    await fs.mkdir('dashboard/public', { recursive: true });
    await fs.writeFile('dashboard/public/index.html', dashboardHtml);
    const dashboard = new BrandProtectionDashboard(port);
    await dashboard.start();
    return dashboard;
}
