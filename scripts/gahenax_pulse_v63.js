/**
 * GAHENAX PULSE v6.3 - AUTO-SYNC ORACLE EDITION
 * Autonomous DOM Extraction + Heartbeat Loop
 */
(function() {
    const CLOUD_URL = "https://gahenaxaisolutions.online";
    let lastProcessedStreak = -1;
    let lastKnownServerSeed = "";

    console.log("%c [GAHENAX] PULSE v6.3 (AUTO-SYNC) ACTIVO. ", "background: #1e293b; color: #22d3ee; font-weight: 800; padding: 4px;");

    /**
     * DOM EXTRACTOR MODULE (WATER)
     * Scans for Provably Fair seeds and Nonces.
     */
    function extractSeeds() {
        try {
            // FaucetPay Selectors (Dynamic Discovery)
            const serverSeedEl = document.querySelector('input[name="server_seed"], #server_seed, .server-seed-value');
            const clientSeedEl = document.querySelector('input[name="client_seed"], #client_seed, .client-seed-value');
            const nonceEl = document.querySelector('.current-nonce, #nonce_stats, .stats-nonce');

            if (serverSeedEl && clientSeedEl) {
                const sSeed = serverSeedEl.value || serverSeedEl.innerText;
                const cSeed = clientSeedEl.value || clientSeedEl.innerText;
                const nonceValue = nonceEl ? parseInt(nonceEl.innerText || nonceEl.value) : 0;

                if (sSeed !== lastKnownServerSeed) {
                    lastKnownServerSeed = sSeed;
                    console.log("%c [EXTRACTOR] Nueva Misión Detectada. Calibrando Kernel... ", "color: #f472b6;");
                    syncWithCloud({ 
                        seeds: { server: sSeed, client: cSeed, nonce: nonceValue } 
                    });
                }
            }
        } catch(e) { /* Extraction Silence */ }
    }

    async function syncWithCloud(payload) {
        try {
            await fetch(`${CLOUD_URL}/api/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } catch(err) { console.error("[GAHENAX] Cloud Sync Failed"); }
    }

    // MAIN TELEMETRY LOOP
    setInterval(async () => {
        // 1. Check for Seed Changes (Calibration)
        extractSeeds();

        // 2. Check for Bet Activity (Telemetry)
        try {
            const raw = localStorage.getItem('__ga_inbox');
            if (raw) {
                const data = JSON.parse(raw);
                if (data.streak !== lastProcessedStreak) {
                    lastProcessedStreak = data.streak;
                    await syncWithCloud({ 
                        telemetry: { 
                            profit: data.profit, 
                            nonce: data.streak, 
                            mode: data.mode 
                        } 
                    });
                    console.log(`%c [PULSE] Transmisión v7 OK | Stake: #${data.streak} `, "color: #22d3ee;");
                }
            }
        } catch(err) {}
    }, 1500);
})();
