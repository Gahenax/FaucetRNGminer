/**
 * GAHENAX ORACLE // KERNEL v7.0 (PRODUCTION)
 * Sovereign Deterministic Engine | Zero-Debt Architecture
 */
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'state.json');

// --- 1. BUNKER SERVICE (EARTH) ---
class Bunker {
    constructor(filePath) {
        this.path = filePath;
        this.defaults = {
            metadata: { version: "7.0.0", status: "IDLE", mission_count: 0 },
            config: { server: "", client: "", current_nonce: 0 },
            session: { profit: 0, rounds: 0, last_mode: "IDLE", last_heartbeat: 0 },
            radar: { forecast: [], history: [] }
        };
    }

    load() {
        if (!fs.existsSync(this.path)) return this.defaults;
        try {
            const saved = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            // Deep merge while protecting code-level version
            const merged = { ...this.defaults, ...saved };
            merged.metadata.version = this.defaults.metadata.version; 
            return merged;
        } catch(e) { return this.defaults; }
    }

    save(state) {
        try {
            const data = JSON.stringify(state, null, 2);
            // Atomic write: write to tmp then rename
            const tmpPath = `${this.path}.tmp`;
            fs.writeFileSync(tmpPath, data, 'utf8');
            fs.renameSync(tmpPath, this.path);
        } catch(e) { console.error("[BUNKER] Atomic Write Failed", e); }
    }
}

// --- 2. ORACLE ENGINE (FIRE) ---
class OracleEngine {
    constructor(state) {
        this.state = state;
    }

    calculateOutcome(nonce) {
        const { server, client } = this.state.config;
        if (!server || !client) return null;
        
        const message = `${client}:${nonce}`;
        const hmac = crypto.createHmac('sha256', server).update(message).digest('hex');
        const val = parseInt(hmac.substring(0, 8), 16) % 1000000 / 10000;
        
        let type = "GAP";
        if (val > 90.0) type = "BIG_WIN";
        else if (val > 50.49) type = "WIN";
        
        return { nonce, val: val.toFixed(2), type };
    }

    recomputeRadar() {
        const { current_nonce } = this.state.config;
        this.state.radar.forecast = [];
        for (let i = 1; i <= 6; i++) {
            const outcome = this.calculateOutcome(current_nonce + i);
            if (outcome) this.state.radar.forecast.push(outcome);
        }
    }

    sync(payload) {
        const { seeds, telemetry } = payload;
        this.state.session.last_heartbeat = Date.now();

        if (seeds) {
            const isNewMission = seeds.server !== this.state.config.server;
            this.state.config = { 
                server: seeds.server, 
                client: seeds.client, 
                current_nonce: parseInt(seeds.nonce || 0) 
            };
            if (isNewMission) {
                this.state.metadata.status = "CALIBRATED";
                this.state.metadata.mission_count++;
                this.state.radar.history = [];
            }
        }

        if (telemetry) {
            const { profit, nonce, mode } = telemetry;
            this.state.session.profit = profit ?? this.state.session.profit;
            this.state.session.last_mode = mode ?? this.state.session.last_mode;
            this.state.session.rounds++;
            
            if (nonce) {
                this.state.config.current_nonce = nonce;
                const outcome = this.calculateOutcome(nonce);
                if (outcome) {
                    this.state.radar.history.push(outcome);
                    if (this.state.radar.history.length > 30) this.state.radar.history.shift();
                }
            }
        }
        this.recomputeRadar();
    }
}

// --- 3. INFRASTRUCTURE & STARTUP ---
const bunker = new Bunker(STATE_FILE);
const oracle = new OracleEngine(bunker.load());

app.use(cors());
app.use(express.json());
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

app.post('/api/sync', (req, res) => {
    oracle.sync(req.body);
    bunker.save(oracle.state);
    res.json({ status: "OK", server_time: Date.now() });
});

app.get('/api/oracle', (req, res) => res.json({ ...oracle.state, server_time: Date.now() }));

// --- 4. PREMIUM PRODUCTION DASHBOARD (AIR) ---
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GAHENAX ORACLE v7.0</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root { 
                --cyan: #22d3ee; --pink: #f472b6; --bg: #050505; --card: rgba(20,20,20,0.8);
                --border: rgba(255,255,255,0.05); --neon: #00ff66;
            }
            * { box-sizing: border-box; }
            body { 
                background: var(--bg); color: #fff; font-family: 'Outfit', sans-serif; 
                margin: 0; min-height: 100vh; display: flex; overflow-x: hidden;
                background-image: radial-gradient(circle at 50% -20%, #1e293b 0%, transparent 50%);
            }
            /* Sidebar Layout */
            sidebar {
                width: 320px; border-right: 1px solid var(--border);
                background: rgba(10,10,10,0.9); backdrop-filter: blur(20px);
                display: flex; flex-direction: column; padding: 40px 20px;
            }
            main { flex: 1; padding: 60px; overflow-y: auto; }
            
            /* Glassmorphism Components */
            .card {
                background: var(--card); border: 1px solid var(--border);
                border-radius: 24px; padding: 32px; backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0,0,0,0.8);
            }
            .stat-label { 
                font-size: 11px; color: #64748b; font-weight: 800; 
                text-transform: uppercase; letter-spacing: 2.5px; margin-bottom: 8px;
            }
            .stat-value { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 800; }
            
            .header-info { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; }
            .logo { 
                width: 48px; height: 48px; background: var(--cyan); border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
            }
            
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
            .node { 
                padding: 16px; border-radius: 16px; background: rgba(255,255,255,0.02);
                border: 1px solid var(--border); transition: 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .node:hover { transform: translateY(-4px); background: rgba(255,255,255,0.05); }

            .radar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 24px; }
            
            /* Logic Indication */
            .led { width: 10px; height: 10px; border-radius: 50%; background: #ef4444; }
            .led.on { background: var(--neon); box-shadow: 0 0 10px var(--neon); }
            
            .win-BIG_WIN { color: var(--pink); text-shadow: 0 0 10px rgba(244,114,182,0.3); }
            .win-WIN { color: var(--cyan); }
            .win-GAP { color: #334155; }

            button {
                background: var(--cyan); color: #000; border: none; padding: 18px;
                border-radius: 16px; font-weight: 800; text-transform: uppercase;
                letter-spacing: 1.5px; cursor: pointer; transition: 0.3s; width: 100%;
                font-size: 13px; margin-top: 20px;
            }
            button:hover { filter: brightness(1.2); transform: scale(1.02); }
            input {
                width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--border);
                padding: 14px; border-radius: 12px; color: #fff; margin-bottom: 12px;
                font-family: inherit; font-size: 14px;
            }
        </style>
    </head>
    <body>
        <sidebar>
            <div class="header-info">
                <div class="logo">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                </div>
                <div>
                    <div style="font-weight: 800; letter-spacing: 1px;">GAHENAX</div>
                    <div style="font-size: 10px; color: #64748b; font-weight: 600;">ORACLE KERNEL v7.0</div>
                </div>
            </div>

            <div class="card" style="padding: 20px; margin-bottom: 24px;">
                <div class="stat-label">Connection Status</div>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px;">
                    <div id="led" class="led"></div>
                    <div id="status-text" style="font-size: 12px; font-weight: 600; color: #64748b;">OFFLINE</div>
                </div>
            </div>

            <div class="stat-group" style="padding: 0 10px;">
                <div class="stat-label">Mission Control</div>
                <input type="password" id="s-seed" placeholder="Server Seed">
                <input type="text" id="c-seed" placeholder="Client Seed">
                <input type="number" id="nonce" placeholder="Current Nonce">
                <button onclick="calibrate()">Engage Calibrator</button>
            </div>
            
            <div style="margin-top: auto; font-size: 10px; color: #334155; text-align: center;">
                Sovereign Node #314799704 // PHASE VII
            </div>
        </sidebar>

        <main>
            <div class="grid">
                <div class="card">
                    <div class="stat-label">Tactical Profit</div>
                    <div id="disp-profit" class="stat-value" style="color: var(--neon);">0.00000000</div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 8px;">ROUNDS: <span id="disp-rounds" style="color: #fff;">0</span></div>
                </div>
                <div class="card" style="grid-column: span 2;">
                    <div class="stat-label">Foresight Radar</div>
                    <div id="radar-row" class="radar-grid"></div>
                </div>
            </div>

            <div class="card" style="margin-top: 24px;">
                <div class="stat-label">Live Operation Stream</div>
                <div id="log-stream" style="height: 200px; overflow-y: auto; font-family: 'JetBrains Mono'; font-size: 11px; color: #475569;">
                    [INIT] Kernel v7.0 Ready for Synchronous Extraction...
                </div>
            </div>
        </main>

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
                    
                    const timeDiff = (data.server_time - data.session.last_heartbeat) / 1000;
                    const led = document.getElementById('led');
                    const st = document.getElementById('status-text');
                    
                    if (timeDiff < 10 && data.session.last_heartbeat > 0) {
                        led.classList.add('on');
                        st.innerText = "MISSION ACTIVE";
                        st.style.color = "var(--neon)";
                    } else {
                        led.classList.remove('on');
                        st.innerText = "WAITING FOR PULSE";
                        st.style.color = "#64748b";
                    }

                    if (data.radar.forecast) {
                        document.getElementById('radar-row').innerHTML = data.radar.forecast.map(f => \`
                            <div class="node">
                                <div style="font-size: 10px; color: #334155; font-weight: 800; margin-bottom: 4px;">#\${f.nonce}</div>
                                <div class="win-\${f.type}" style="font-family: 'JetBrains Mono'; font-weight: 800; font-size: 18px;">\${f.val}</div>
                                <div style="font-size: 9px; opacity: 0.5; font-weight: 700; margin-top: 4px;">\${f.type}</div>
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

app.listen(PORT, () => console.log(`GAHENAX KERNEL v7.0 PRODUCTION LIVE ON ${PORT}`));
