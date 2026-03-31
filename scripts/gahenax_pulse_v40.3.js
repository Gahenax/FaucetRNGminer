/**
 * GAHENAX PULSE v40.3.1 - BULLETPROOF STANDALONE
 * Logic: Precise 200-Nonce Window
 * Compatibility: FaucetPay Scripting API Standard
 */

(async function() {
    const CLOUD_URL = "https://gahenaxaisolutions.online";
    
    // --- CONFIGURACIÓN DE RIESGO ---
    var _0xYM = { 
        baseBet: 0.00000001, // Bet mínima de seguridad mientras espera sync
        excitedBet: 0.00015,
        seriesSize: 200, 
        chance: 49.5 
    };

    // --- BUFFER DE MISIÓN ---
    if (typeof MISSION === 'undefined') {
        window.MISSION = { wins: [], big_wins: [], gaps: [], active: false };
    }

    async function syncGahenaxMission() {
        try {
            const res = await fetch(`${CLOUD_URL}/api/mission`);
            if (res.ok) {
                const data = await res.json();
                if (data.wins) {
                    window.MISSION.active = true;
                    console.log("%c [OK] RADAR SINCRONIZADO. ", "color: #0f0;");
                }
            }
        } catch(e) { /* Nodo offline o pendiente de inyección */ }
    }

    // --- LÓGICA DE JUEGO (EXECUTION) ---
    if (typeof globals._0xnonce === 'undefined' || isFirstBet) {
        globals._0xnonce = 1; 
        globals._0xprofit = 0;
        globals._0xmode = "ARMING";
        await syncGahenaxMission();
    } else {
        globals._0xprofit += lastBetResult.profit;
        globals._0xnonce++;
    }

    // --- STOP-LOSS ---
    if (globals._0xprofit <= -0.50) {
        console.log("%c [STOP] MARGEN DE PÉRDIDA ALCANZADO. ", "color: #f00;");
        stop();
    }

    // --- DETERMINISTIC ENGINE ---
    var currentAmt = _0xYM.baseBet;
    
    if (!window.MISSION.active) {
        console.log("%c [WAIT] ORACLE FRÍO: INYECTAR EN DASHBOARD. ", "color: #ff00ff;");
        // No detenemos el script, pero mantenemos apuesta mínima hasta recibir señal
        currentAmt = 0.00000001; 
    }

    // --- TELEMETRÍA ---
    try {
        localStorage.setItem('__ga_inbox', JSON.stringify({
            profit: globals._0xprofit,
            streak: globals._0xnonce,
            mode: globals._0xmode
        }));
    } catch(e) {}

    // --- OBJETO DE APUESTA ESTÁNDAR ---
    bet = { 
        amount: currentAmt, // Campo 'amount' es el estándar
        chance: _0xYM.chance, 
        type: "high" 
    };
})();
