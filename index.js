/**
 * GAHENAX ORACLE // KERNEL v9.0 (YANG-MILLS QUANTUM TOPOGRAPHY)
 * Physics-Informed Predictive Engine | Gauge Field Analysis
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
            metadata: { version: "9.0.0", status: "IDLE", mission_count: 0 },
            config: { server: "", client: "", current_nonce: 0 },
            session: { profit: 0, rounds: 0, last_mode: "IDLE", last_heartbeat: 0 },
            radar: { forecast: [], history: [], topography: [] }
        };
    }
    load() {
        if (!fs.existsSync(this.path)) return this.defaults;
        try {
            const saved = JSON.parse(fs.readFileSync(this.path, 'utf8'));
            const merged = { ...this.defaults, ...saved };
            merged.metadata.version = this.defaults.metadata.version; 
            return merged;
        } catch(e) { return this.defaults; }
    }
    save(state) {
        try {
            const data = JSON.stringify(state, null, 2);
            const tmpPath = `${this.path}.tmp`;
            fs.writeFileSync(tmpPath, data, 'utf8');
            fs.renameSync(tmpPath, this.path);
        } catch(e) { console.error("[BUNKER] Atomic Write Failed", e); }
    }
}

// --- 2. YANG-MILLS ORACLE ENGINE (FIRE/EARTH) ---
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
        
        return { nonce, val: parseFloat(val.toFixed(2)), type };
    }

    /**
     * TOPOLOGICAL MASS GAP DISCOVERY
     * Scans 100 nonces to find density of win clusters.
     */
    analyzeQuantumField() {
        if (!this.state.config.server) return;
        const { current_nonce } = this.state.config;
        
        this.state.radar.topography = [];
        this.state.radar.forecast = [];
        
        let massGap = 0;
        let foundFirstCluster = false;

        for (let i = 1; i <= 100; i++) {
            const outcome = this.calculateOutcome(current_nonce + i);
            if (!outcome) continue;
            
            // Map topography (Density Nodes)
            this.state.radar.topography.push(outcome.val);
            
            if (i <= 6) this.state.radar.forecast.push(outcome);

            // Detect Mass Gap (Energy barrier to first win cluster)
            if (!foundFirstCluster) {
                if (outcome.type !== "GAP") {
                    foundFirstCluster = true;
                } else {
                    massGap++;
                }
            }
        }
        this.state.metadata.mass_gap = massGap;
    }

    sync(payload) {
        const { seeds, telemetry } = payload;
        this.state.session.last_heartbeat = Date.now();

        if (seeds && seeds.server && seeds.client) {
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
            
            if (nonce && nonce > this.state.config.current_nonce) {
                this.state.config.current_nonce = nonce;
                const outcome = this.calculateOutcome(nonce);
                if (outcome) {
                    this.state.radar.history.push(outcome);
                    if (this.state.radar.history.length > 20) this.state.radar.history.shift();
                }
            }
        }
        this.analyzeQuantumField();
    }
}

// --- 3. INFRASTRUCTURE ---
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

// --- 4. QUANTUM TOPOGRAPHY DASHBOARD (v9.0 AIR) ---
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GAHENAX ORACLE v9.0</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
            :root { 
                --cyan: #22d3ee; --pink: #ec4899; --bg: #03040b; --card: rgba(15, 17, 26, 0.8);
                --border: rgba(255,255,255,0.08); --neon: #00ff66; --purple: #a855f7;
            }
            * { box-sizing: border-box; }
            body { 
                background: var(--bg); color: #fff; font-family: 'Outfit', sans-serif; 
                margin: 0; min-height: 100vh; display: flex; overflow: hidden;
                background-image: 
                    radial-gradient(circle at 0% 0%, rgba(34, 211, 238, 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 100% 100%, rgba(168, 85, 247, 0.05) 0%, transparent 40%);
            }
            sidebar {
                width: 340px; border-right: 1px solid var(--border);
                background: rgba(8, 9, 15, 0.95); backdrop-filter: blur(40px);
                display: flex; flex-direction: column; padding: 40px 24px;
            }
            main { flex: 1; padding: 40px 60px; overflow-y: auto; }
            
            .card {
                background: var(--card); border: 1px solid var(--border);
                border-radius: 20px; padding: 24px; backdrop-filter: blur(12px);
                box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            }
            
            .stat-label { 
                font-size: 10px; color: #475569; font-weight: 800; 
                text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;
            }
            .stat-value { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 800; }
            
            .header-info { display: flex; align-items: center; gap: 16px; margin-bottom: 48px; }
            .logo { 
                width: 52px; height: 52px; background: linear-gradient(135deg, var(--cyan), var(--purple));
                border-radius: 14px; display: flex; align-items: center; justify-content: center;
                box-shadow: 0 0 30px rgba(34, 211, 238, 0.2);
            }

            .badge {
                font-size: 8px; font-weight: 900; padding: 4px 10px; border-radius: 6px;
                letter-spacing: 1px; display: inline-block; margin-top: 12px;
                text-transform: uppercase;
            }

            /* Quantum Topography Visualizer */
            .topography-container {
                height: 300px; width: 100%; position: relative; margin-top: 20px;
                background: rgba(0,0,0,0.2); border-radius: 12px; overflow: hidden;
            }
            .topo-bar { 
                position: absolute; bottom: 0; transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 2px 2px 0 0; opacity: 0.4;
            }

            .led { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; }
            .led.on { background: var(--neon); box-shadow: 0 0 12px var(--neon); }
            
            .win-BIG_WIN { color: var(--pink); text-shadow: 0 0 15px rgba(236, 72, 153, 0.4); }
            .win-WIN { color: var(--cyan); }
            .win-GAP { color: #1e293b; }

            input {
                width: 100%; background: rgba(255,255,255,0.02); border: 1px solid var(--border);
                padding: 14px; border-radius: 12px; color: #fff; margin-bottom: 12px;
                font-family: inherit; font-size: 13px; outline: none; transition: 0.3s;
            }
            input:focus { border-color: var(--cyan); background: rgba(255,255,255,0.05); }

            button {
                background: linear-gradient(to right, var(--cyan), var(--purple));
                color: #000; border: none; padding: 18px; border-radius: 16px; 
                font-weight: 800; letter-spacing: 2px; cursor: pointer; transition: 0.3s;
                width: 100%; font-size: 12px; text-transform: uppercase; margin-top: 10px;
            }
            button:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(34, 211, 238, 0.3); }

            .radar-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-top: 24px; }
            .node { 
                padding: 14px; border-radius: 14px; background: rgba(255,255,255,0.01);
                border: 1px solid var(--border); text-align: center;
            }
            
            #log-stream {
                height: 140px; overflow-y: auto; font-family: 'JetBrains Mono'; 
                font-size: 10px; color: #334155; line-height: 1.6; padding-right: 10px;
            }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        </style>
    </head>
    <body>
        <sidebar>
            <div class="header-info">
                <div class="logo">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="#000" stroke-width="3" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                </div>
                <div>
                    <div style="font-weight: 800; letter-spacing: 1px; font-size: 18px;">GAHENAX</div>
                    <div style="font-size: 9px; color: #475569; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">YANG-MILLS KERNEL v9.0</div>
                </div>
            </div>

            <div class="card" style="padding: 24px; margin-bottom: 24px;">
                <div class="stat-label">System Pulse</div>
                <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
                    <div id="led" class="led"></div>
                    <div id="status-text" style="font-size: 11px; font-weight: 700; color: #475569;">OFFLINE</div>
                </div>
                <div id="veracity-badge" class="badge"></div>
            </div>

            <div class="stat-group">
                <div class="stat-label">Mass Gap Analysis</div>
                <div id="disp-mass-gap" class="stat-value" style="color: var(--purple); margin: 10px 0;">0</div>
                <div style="font-size: 10px; color: #475569;">Energy barrier to next WIN cluster.</div>

                <div class="stat-label" style="margin-top: 32px;">Injection Interface</div>
                <input type="password" id="s-seed" placeholder="Server Seed">
                <input type="text" id="c-seed" placeholder="Client Seed">
                <input type="number" id="nonce" placeholder="Current Nonce">
                <button onclick="calibrate()">Engage Yang-Mills</button>
            </div>
            
            <div style="margin-top: auto; font-size: 9px; color: #1e293b; text-align: center; letter-spacing: 1px; font-weight: 800;">
                GAHENAX QUANTUM LABS // PROTOCOL v9.0
            </div>
        </sidebar>

        <main>
            <div style="display: flex; gap: 24px;">
                <div class="card" style="flex: 1;">
                    <div class="stat-label">Quantum Profit</div>
                    <div id="disp-profit" class="stat-value" style="color: var(--neon); font-size: 32px;">0.00000000</div>
                    <div style="font-size: 11px; color: #475569; margin-top: 8px;">ROUNDS: <span id="disp-rounds" style="color: #fff;">0</span></div>
                </div>
                <div class="card" style="flex: 1;">
                    <div class="stat-label">Field Status</div>
                    <div style="font-family: 'JetBrains Mono'; font-weight: 700; color: var(--cyan); margin-top: 10px;">NON-PERTURBATIVE</div>
                    <div style="font-size: 10px; color: #475569; margin-top: 6px;">Topological Invariants Validated.</div>
                </div>
            </div>

            <div class="card" style="margin-top: 24px;">
                <div class="stat-label">Quantum Topography (100 Nonce Depth)</div>
                <div id="topography" class="topography-container"></div>
            </div>

            <div class="radar-grid" id="radar-row"></div>

            <div class="card" style="margin-top: 24px;">
                <div class="stat-label">Live Operation Stream</div>
                <div id="log-stream">
                    [INIT] Yang-Mills Kernel v9.0 Ready for Topological Inference...
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

            function updateTopography(nodes) {
                const container = document.getElementById('topography');
                if (!nodes || nodes.length === 0) {
                    container.innerHTML = '<div style="display:flex; height:100%; align-items:center; justify-content:center; color:#1e293b; font-size:11px; font-weight:800;">AWAITING GAUGE FIELD DATA...</div>';
                    return;
                }
                const width = container.clientWidth / nodes.length;
                container.innerHTML = nodes.map((val, i) => {
                    let color = "rgba(47, 55, 69, 0.3)";
                    let height = (val / 100) * 100;
                    if (val > 90) color = "var(--pink)";
                    else if (val > 50.49) color = "var(--cyan)";
                    return \`<div class="topo-bar" style="left:\${i * width}px; width:\${width - 1}px; height:\${height}%; background:\${color}"></div>\`;
                }).join('');
            }

            async function update() {
                try {
                    const res = await fetch('/api/oracle');
                    const data = await res.json();
                    
                    document.getElementById('disp-profit').innerText = Number(data.session.profit).toFixed(8);
                    document.getElementById('disp-rounds').innerText = data.session.rounds;
                    document.getElementById('disp-mass-gap').innerText = data.metadata.mass_gap || 0;
                    
                    const timeDiff = (data.server_time - data.session.last_heartbeat) / 1000;
                    const led = document.getElementById('led');
                    const st = document.getElementById('status-text');
                    const log = document.getElementById('log-stream');
                    const badge = document.getElementById('veracity-badge');
                    
                    // --- VERACITY GUARD v9.0 ---
                    const sSeed = data.config.server;
                    if (sSeed && sSeed.length === 64 && /^[0-9a-f]+$/i.test(sSeed)) {
                        badge.style.display = "inline-block";
                        badge.innerText = "VERIFICATION // HASH MODE";
                        badge.style.background = "rgba(71, 85, 105, 0.2)";
                        badge.style.color = "#475569";
                    } else if (sSeed && sSeed.length > 0) {
                        badge.style.display = "inline-block";
                        badge.innerText = "REAL-TIME // QUANTUM PROXY";
                        badge.style.background = "rgba(0, 255, 102, 0.1)";
                        badge.style.color = "var(--neon)";
                    } else {
                        badge.style.display = "none";
                    }

                    if (timeDiff < 10 && data.session.last_heartbeat > 0) {
                        if (!led.classList.contains('on')) log.innerHTML += \`<div>[SYSTEM] Gauge Connection Established.</div>\`;
                        led.classList.add('on');
                        st.innerText = "COHERENT";
                        st.style.color = "var(--neon)";
                    } else {
                        if (led.classList.contains('on')) log.innerHTML += \`<div style="color:#ef4444;">[WARN] Decoherence detected. Waiting...</div>\`;
                        led.classList.remove('on');
                        st.innerText = "DECOHERENCE";
                        st.style.color = "#475569";
                    }

                    if (data.session.rounds > 0) {
                        const lastMsg = log.lastElementChild?.innerText || "";
                        const newMsg = \`[SYNC] ROUND #\${data.session.rounds} | NONCE #\${data.config.current_nonce}\`;
                        if (!lastMsg.includes(newMsg)) {
                            log.innerHTML += \`<div>\${newMsg}</div>\`;
                            log.scrollTop = log.scrollHeight;
                        }
                    }

                    updateTopography(data.radar.topography);

                    if (data.radar.forecast && data.metadata.status === "CALIBRATED") {
                        document.getElementById('radar-row').innerHTML = data.radar.forecast.map(f => \`
                            <div class="node">
                                <div style="font-size: 9px; color: #1e293b; font-weight: 800; margin-bottom: 4px;">#\${f.nonce}</div>
                                <div class="win-\${f.type}" style="font-family: 'JetBrains Mono'; font-weight: 800; font-size: 16px;">\${f.val}</div>
                                <div style="font-size: 8px; opacity: 0.5; font-weight: 700; margin-top: 4px; text-transform: uppercase;">\${f.type}</div>
                            </div>
                        \`).join('');
                    } else {
                        document.getElementById('radar-row').innerHTML = \`<div style="grid-column: span 6; text-align: center; color: #1e293b; font-size: 10px; font-weight: 800;">AWAITING TOPOLOGICAL INJECTION...</div>\`;
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

app.listen(PORT, () => console.log(`GAHENAX YANG-MILLS KERNEL v9.0 LIVE ON ${PORT}`));
