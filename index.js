const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// ESTADO GLOBAL - PREDICTIVE ORACLE STATE (v40.2)
let STATE = {
    usdc_profit: 0.0,
    packet_count: 0,
    mode: "WAITING_INJECTION",
    calibrated: false,
    active_seeds: { server: "", client: "", nonce: 0 },
    history: [], // Last 10 actual results from telemetry
    forecast: [], // Next 5 predicted outcomes
};

/**
 * CORE DETERMINISTIC ENGINE
 */
function calculateRaw(serverSeed, clientSeed, nonce) {
    const message = `${clientSeed}:${nonce}`;
    const hmac = crypto.createHmac('sha256', serverSeed).update(message).digest('hex');
    return parseInt(hmac.substring(0, 8), 16) % 1000000 / 10000;
}

function getOutcomeType(val) {
    if (val > 90.0) return "BIG_WIN";
    if (val > 50.49) return "WIN";
    return "GAP";
}

function updateForecast(serverSeed, clientSeed, currentNonce) {
    const forecast = [];
    for (let i = 1; i <= 5; i++) {
        const nextNonce = currentNonce + i;
        const val = calculateRaw(serverSeed, clientSeed, nextNonce);
        forecast.push({
            nonce: nextNonce,
            value: val.toFixed(2),
            type: getOutcomeType(val)
        });
    }
    return forecast;
}

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>GAHENAX GROUND CONTROL v40.2 (Predictive Radar)</title>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root { --neon-green: #00ff66; --bg-dark: #0a0a0a; --panel-bg: #151515; --accent: #ff00ff; --text: #e0e0e0; }
            body { background: var(--bg-dark); color: var(--text); font-family: 'JetBrains Mono', monospace; padding: 20px; display: flex; flex-direction: column; align-items: center; }
            .dashboard { width: 1000px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .panel { background: var(--panel-bg); border: 1px solid #333; padding: 20px; border-radius: 8px; position: relative; box-shadow: 0 10px 40px rgba(0,0,0,0.8); }
            .panel::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: var(--accent); opacity: 0.5; }
            .full-width { grid-column: span 2; }
            
            .label { font-size: 0.7em; color: #666; letter-spacing: 2px; margin-bottom: 5px; }
            .profit { font-size: 3em; color: var(--neon-green); text-shadow: 0 0 10px var(--neon-green); }
            
            /* RADAR STYLES */
            .radar-row { display: flex; justify-content: space-between; margin-top: 15px; }
            .radar-node { 
                flex: 1; margin: 0 5px; background: #222; border: 1px solid #444; border-radius: 4px; padding: 10px; text-align: center;
                transition: transform 0.3s;
            }
            .radar-node.active { transform: scale(1.05); border-color: var(--accent); }
            .val-WIN { color: var(--neon-green); }
            .val-BIG_WIN { color: var(--accent); font-weight: bold; }
            .val-GAP { color: #555; }
            
            /* HISTORY LOG */
            .history-log { background: #000; border: 1px solid #333; height: 200px; overflow-y: auto; font-size: 0.85em; padding: 10px; border-radius: 4px; }
            .log-entry { border-bottom: 1px solid #222; padding: 4px 0; display: flex; justify-content: space-between; }
            
            button { width: 100%; padding: 15px; background: var(--accent); border: none; color: white; cursor: pointer; text-transform: uppercase; letter-spacing: 2px; margin-top: 10px; }
            input { width: 100%; background: #000; border: 1px solid #333; color: var(--neon-green); padding: 10px; box-sizing: border-box; }
        </style>
    </head>
    <body>
        <h1 style="letter-spacing: 10px; margin-bottom: 30px;">ORACLE <span style="color:var(--accent)">RADAR</span> v40.2</h1>
        
        <div class="dashboard">
            <div class="panel">
                <div class="label">LIVE TELEMETRY // PROFIT</div>
                <div id="profit" class="profit">0.00000000</div>
                <div class="label" style="margin-top:20px; color:#ff4444;">SAFE MARGIN (STOP-LOSS): -0.50 USDC</div>
                <div class="label" style="margin-top:5px;">PACKETS RECEIVED: <span id="packets" style="color:var(--accent)">0</span></div>
            </div>

            <div class="panel">
                <div class="label">FORECAST RADAR // NEXT 5 NONCES</div>
                <div id="radar" class="radar-row">
                    <div class="radar-node">--</div><div class="radar-node">--</div>
                    <div class="radar-node">--</div><div class="radar-node">--</div>
                    <div class="radar-node">--</div>
                </div>
            </div>

            <div class="panel full-width">
                <div id="status-tag" style="font-size:0.7em; margin-bottom:10px; color:var(--accent)">MODE: WAITING_INJECTION</div>
                <div class="history-log" id="history">
                    <div style="color:#555;">>> INITIALIZING SECURE LINK... WAITING FOR TELEMETRY</div>
                </div>
            </div>

            <div class="panel full-width">
                <div class="label">SEED INTEGRATION</div>
                <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <input type="text" id="in-server" placeholder="SERVER SEED (REVEALED)">
                        <input type="text" id="in-client" placeholder="CLIENT SEED">
                    </div>
                    <input type="number" id="in-nonce" value="0">
                </div>
                <button onclick="injectSeeder()">INJECT TO ORACLE NODE</button>
            </div>
        </div>

        <script>
            async function injectSeeder() {
                const data = {
                    server: document.getElementById('in-server').value,
                    client: document.getElementById('in-client').value,
                    nonce: parseInt(document.getElementById('in-nonce').value)
                };
                await fetch('/api/seeds', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                console.log("Seeder Injected Successfully");
            }

            async function updateRadar() {
                try {
                    const res = await fetch('/api/status');
                    const data = await res.json();
                    
                    document.getElementById('profit').innerText = data.usdc_profit.toFixed(8);
                    document.getElementById('packets').innerText = data.packet_count;
                    document.getElementById('status-tag').innerText = "MODE: " + data.mode;

                    // Update History
                    const histDiv = document.getElementById('history');
                    histDiv.innerHTML = data.history.map(h => \`
                        <div class="log-entry">
                            <span>NONCE #\${h.nonce}</span>
                            <span class="val-\${h.type}">\${h.value} // \${h.type}</span>
                        </div>
                    \`).reverse().join('') || '<div style="color:#555;">WAITING DATA...</div>';

                    // Update Forecast Radar
                    if (data.calibrated && data.forecast) {
                        const radarDiv = document.getElementById('radar');
                        radarDiv.innerHTML = data.forecast.map(f => \`
                            <div class="radar-node">
                                <div style="font-size:0.6em; color:#666;">#\${f.nonce}</div>
                                <div class="val-\${f.type}">\${f.value}</div>
                                <div style="font-size:0.5em; opacity:0.5;">\${f.type}</div>
                            </div>
                        \`).join('');
                    }
                } catch(e) {}
            }
            setInterval(updateRadar, 1500);
        </script>
    </body>
    </html>
    `);
});

app.post('/api/telemetry', (req, res) => {
    const { profit, streak, mode } = req.body;
    if (streak !== undefined && STATE.calibrated) {
        const val = calculateRaw(STATE.active_seeds.server, STATE.active_seeds.client, streak);
        const type = getOutcomeType(val);
        
        // Feed history
        STATE.history.push({ nonce: streak, value: val.toFixed(2), type });
        if (STATE.history.length > 15) STATE.history.shift();

        STATE.usdc_profit = profit || STATE.usdc_profit;
        STATE.active_seeds.nonce = streak;
        STATE.mode = mode || STATE.mode;
        STATE.packet_count++;
        
        // Update forecast window instantly
        STATE.forecast = updateForecast(STATE.active_seeds.server, STATE.active_seeds.client, streak);
    }
    res.json({ status: "ok" });
});

app.get('/api/status', (req, res) => res.json(STATE));

app.post('/api/seeds', (req, res) => {
    const { server, client, nonce } = req.body;
    if (server && client) {
        STATE.active_seeds = { server, client, nonce: parseInt(nonce || 0) };
        STATE.calibrated = true;
        STATE.mode = "RADAR_ARMED";
        STATE.forecast = updateForecast(server, client, STATE.active_seeds.nonce);
        STATE.history = []; // Reset history for new session
        res.json({ status: "calibrated" });
    } else {
        res.status(400).json({ error: "Invalid seeds" });
    }
});

app.get('/api/mission', (req, res) => {
    if (!STATE.calibrated) return res.status(403).json({ error: "Cold start" });
    // Keep compatibility with Thin Client
    const mission = updateForecast(STATE.active_seeds.server, STATE.active_seeds.client, STATE.active_seeds.nonce);
    res.json({ wins: [], big_wins: [], gaps: [] }); // Stub for now, actual logic moved to server-side radar
});

app.listen(port, () => console.log(`GAHENAX RADAR LIVE ON PORT ${port}`));
