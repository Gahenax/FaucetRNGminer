/**
 * GAHENAX PULSE v6.0 - UNIFIED TELEMETRY BRIDGE
 * Compatible with Kernel v6.0 Sync API
 */
(function() {
    const CLOUD_URL = "https://gahenaxaisolutions.online";
    console.log("%c [SYNC] PULSE v6.0 ACTIVO. ", "color: #00ff66; font-weight: bold;");

    window.addEventListener('storage', async (e) => {
        if (e.key === '__ga_inbox') {
            const data = JSON.parse(e.newValue);
            try {
                await fetch(`${CLOUD_URL}/api/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        telemetry: { 
                            profit: data.profit, 
                            nonce: data.streak, 
                            mode: data.mode 
                        } 
                    })
                });
            } catch(err) { console.error("[SYNC] Sync Failed"); }
        }
    });
})();
