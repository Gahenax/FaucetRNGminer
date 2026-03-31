/**
 * GAHENAX PREDICTIVE ORACLE // KERNEL v6.0 (PROFESSIONAL CLEANUP)
 * Unified Atomic State Architecture
 */
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');

// --- 1. CORE STATE MANAGEMENT ---
let STATE = {
    metadata: { version: "6.1", status: "IDLE", mission_count: 0 },
    config: { server: "", client: "", current_nonce: 0 },
    session: { profit: 0, rounds: 0, last_mode: "IDLE", last_heartbeat: 0 },
    radar: { forecast: [], history: [] }
};

function syncStorage() {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(STATE, null, 2), 'utf8');
    } catch(e) { console.error("[GAHENAX] Storage Sync Failure"); }
}

if (fs.existsSync(STATE_FILE)) {
    try {
        const saved = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        STATE = { ...STATE, ...saved };
        console.log(`[GAHENAX] Recovery: MISSION #${STATE.metadata.mission_count}`);
    } catch(e) { console.log("[GAHENAX] Fresh start initiated."); }
}

// --- 2. DETERMINISTIC ENGINE ---
function calculateOutcome(server, client, nonce) {
    const message = `${client}:${nonce}`;
    const hmac = crypto.createHmac('sha256', server).update(message).digest('hex');
    const val = parseInt(hmac.substring(0, 8), 16) % 1000000 / 10000;
    let type = "GAP";
    if (val > 90.0) type = "BIG_WIN";
    else if (val > 50.49) type = "WIN";
    return { nonce, val: val.toFixed(2), type };
}

function recomputeRadar() {
    if (!STATE.config.server || !STATE.config.client) return;
    STATE.radar.forecast = [];
    for (let i = 1; i <= 5; i++) {
        STATE.radar.forecast.push(calculateOutcome(STATE.config.server, STATE.config.client, STATE.config.current_nonce + i));
    }
}

// --- 3. MIDDLEWARE & API ---
app.use(cors());
app.use(express.json());
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Unified Sync Endpoint
app.post('/api/sync', (req, res) => {
    const { seeds, telemetry } = req.body;
    STATE.session.last_heartbeat = Date.now();

    if (seeds) {
        STATE.config = { server: seeds.server, client: seeds.client, current_nonce: seeds.nonce || 0 };
        STATE.metadata.status = "CALIBRATED";
        STATE.metadata.mission_count++;
        STATE.radar.history = [];
        console.log(`[GAHENAX] Mission #${STATE.metadata.mission_count} Calibrated.`);
    }

    if (telemetry) {
        const { profit, nonce, mode } = telemetry;
        STATE.session.profit = profit || STATE.session.profit;
        STATE.session.last_mode = mode || STATE.session.last_mode;
        STATE.session.rounds++;
        
        if (nonce) {
            STATE.config.current_nonce = nonce;
            const outcome = calculateOutcome(STATE.config.server, STATE.config.client, nonce);
            STATE.radar.history.push(outcome);
            if (STATE.radar.history.length > 20) STATE.radar.history.shift();
        }
    }

    recomputeRadar();
    syncStorage();
    res.json({ status: "OK", server_time: Date.now() });
});

app.get('/api/oracle', (req, res) => res.json({ ...STATE, server_time: Date.now() }));

app.get('/api/debug', (req, res) => {
    try {
        const testFile = path.join(__dirname, 'test.txt');
        fs.writeFileSync(testFile, `Test write at ${new Date().toISOString()}`, 'utf8');
        res.json({ status: "SUCCESS", dir: __dirname, files: fs.readdirSync(__dirname) });
    } catch(e) {
        res.status(500).json({ status: "ERROR", error: e.message });
    }
});

// --- 4. MINIMALIST DASHBOARD ---
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>GAHENAX KERNEL v6.1</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root { --neon: #00ff66; --accent: #ff00ff; --bg: #050505; --card: #111; --off: #ff4444; }
            body { background: var(--bg); color: #fff; font-family: 'Outfit', sans-serif; padding: 40px; margin: 0; display: flex; flex-direction: column; align-items: center; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; width: 1000px; max-width: 90vw; }
            .card { background: var(--card); border: 1px solid #222; padding: 25px; border-radius: 12px; box-shadow: 0 4px 30px rgba(0,0,0,0.5); }
            .full { grid-column: span 2; }
            .profit { font-size: 3.5em; color: var(--neon); font-weight: 700; }
            .label { font-size: 0.8em; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
            .status-box { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
            .led { width: 12px; height: 12px; border-radius: 50%; background: var(--off); box-shadow: 0 0 10px var(--off); transition: 0.3s; }
            .led.on { background: var(--neon); box-shadow: 0 0 15px var(--neon); }
            .tag { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 0.7em; background: #222; color: var(--accent); }
            input { width: 100%; background: #000; border: 1px solid #222; color: var(--neon); padding: 12px; border-radius: 6px; margin: 8px 0; box-sizing: border-box;}
            button { width: 100%; padding: 15px; border-radius: 6px; background: var(--accent); color: #fff; border: none; font-weight: 700; cursor: pointer; transition: 0.3s; }
            .node-row { display: flex; gap: 10px; margin-top: 15px; }
            .node { flex: 1; background: #0a0a0a; border: 1px solid #222; padding: 10px; text-align: center; border-radius: 8px; }
            .val-WIN { color: var(--neon); } .val-BIG_WIN { color: var(--accent); } .val-GAP { color: #444; }
        </style>
    </head>
    <body>
        <div style="text-align: center; margin-bottom: 40px;">
            <div class="tag">KERNEL v6.1 HEARTBEAT // MISSION CONTROL</div>
            <h1 style="letter-spacing: 15px; margin: 15px 0;">ORACLE</h1>
            <div class="status-box">
                <div id="led" class="led"></div>
                <div id="status-text" style="font-size: 0.8em; color: #555;">DISCONNECTED</div>
                <div id="last-sync" style="font-size: 0.7em; color: #333; margin-left: 10px;"></div>
            </div>
        </div>
        <div class="grid">
            <div class="card">
                <div class="label">Session Profit</div>
                <div id="disp-profit" class="profit">0.00000000</div>
                <div class="label" style="margin-top:15px;">Rounds: <span id="disp-rounds" style="color:#fff">0</span></div>
            </div>
            <div class="card">
                <div class="label">Forecast Radar</div>
                <div id="radar-row" class="node-row"></div>
            </div>
            <div class="card full">
                <div class="label">Seed Calibration</div>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="s-seed" placeholder="Server Seed">
                    <input type="text" id="c-seed" placeholder="Client Seed">
                    <input type="number" id="nonce" placeholder="Nonce" style="width: 100px;">
                </div>
                <button onclick="calibrate()">Inject Mission Control</button>
            </div>
        </div>
        <script>
            async function calibrate() {
                const data = {
                    seeds: {
                        server: document.getElementById('s-seed').value,
                        client: document.getElementById('c-seed').value,
                        nonce: parseInt(document.getElementById('nonce').value || 0)
                    }
                };
                await fetch('/api/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                location.reload();
            }
            async function update() {
                try {
                    const res = await fetch('/api/oracle');
                    const data = await res.json();
                    document.getElementById('disp-profit').innerText = Number(data.session.profit).toFixed(8);
                    document.getElementById('disp-rounds').innerText = data.session.rounds;
                    
                    // HEARBEAT LOGIC
                    const timeDiff = (data.server_time - data.session.last_heartbeat) / 1000;
                    const led = document.getElementById('led');
                    const st = document.getElementById('status-text');
                    if (timeDiff < 10 && data.session.last_heartbeat > 0) {
                        led.classList.add('on');
                        st.innerText = "CONNECTED [FAUCET_LIVE]";
                        st.style.color = "var(--neon)";
                    } else {
                        led.classList.remove('on');
                        st.innerText = "DISCONNECTED [WAITING_HEARTBEAT]";
                        st.style.color = "#555";
                    }
                    document.getElementById('last-sync').innerText = "LAST PACKET: " + timeDiff.toFixed(1) + "s AGO";

                    if (data.radar.forecast) {
                        document.getElementById('radar-row').innerHTML = data.radar.forecast.map(f => \`
                            <div class="node">
                                <div style="font-size:0.6em; color:#444;">#\${f.nonce}</div>
                                <div class="val-\${f.type}">\${f.val}</div>
                                <div style="font-size:0.5em; opacity:0.5;">\${f.type}</div>
                            </div>
                        \`).join('');
                    }
                } catch(e) {}
            }
            setInterval(update, 2000);
            update();
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => console.log(`GAHENAX KERNEL v6.0 LIVE ON ${PORT}`));
