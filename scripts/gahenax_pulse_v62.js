/**
 * GAHENAX PULSE v6.2 - LOOP EDITION
 * Active polling to guarantee capture even in the same tab.
 */
(function() {
    const CLOUD_URL = "https://gahenaxaisolutions.online";
    let lastProcessedStreak = -1;

    console.log("%c [GAHENAX] PULSE v6.2 (LOOP) ACTIVO. ", "background: #000; color: #00ff66; font-weight: bold;");

    setInterval(async () => {
        try {
            const raw = localStorage.getItem('__ga_inbox');
            if (!raw) return;

            const data = JSON.parse(raw);
            
            if (data.streak !== lastProcessedStreak) {
                lastProcessedStreak = data.streak;

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
            }
        } catch(err) {}
    }, 1000);
})();
