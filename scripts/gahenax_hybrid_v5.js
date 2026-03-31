/**
 * GAHENAX HYBRID STRIKE v5.0 - THE ORACLE FUSION
 * Template: POOL 2 USDT (Martingale/Safety)
 * Brain: Cloud Radar (Deterministic Prediction)
 * Target: gahenaxaisolutions.online
 */

(async function() {
    const CLOUD_URL = "https://gahenaxaisolutions.online";

    // --- CONFIGURACIÓN POOL 2 (PLANTILLA) ---
    var CONFIG = {
        baseBet: 0.000020,         
        multiLoss: 2.5,            
        targetProfit: 0.20,        
        maxLoss: 1.20,             
        maxSessionRounds: 5,       
        chance: 49.5,              
        stealthLevel: 0.15         
    };

    // --- BUFFER DE MISIÓN RADAR ---
    if (typeof MISSION === 'undefined') {
        window.MISSION = { wins: [], big_wins: [], gaps: [], active: false };
    }

    async function syncGahenaxMission() {
        console.log("%c [RADAR] SINCRONIZANDO CEREBRO DETERMINISTA... ", "color: #ff0;");
        try {
            const res = await fetch(`${CLOUD_URL}/api/mission`);
            const data = await res.json();
            // Para v5.0, el radar en la nube calcula la ventana de los próximos 200 nonces
            if (data.wins) {
                window.MISSION.wins = data.wins;
                window.MISSION.big_wins = data.big_wins;
                window.MISSION.active = true;
                console.log("%c [READY] MOTOR HÍBRIDO v5.0 ARMADO. ", "color: #0f0; font-weight: bold;");
            }
        } catch(e) { console.log("%c [WAIT] DASHBOARD NO INYECTADO. ", "color: #f00;"); }
    }

    // --- INICIALIZACIÓN DE SESIÓN (ESTADO) ---
    if (typeof globals._0xinitialized === 'undefined' || isFirstBet) {
        globals._0xinitialized = true;
        globals.currentBet = CONFIG.baseBet;
        globals.sessionProfit = 0;
        globals.roundCounter = 0;
        globals._0xnonce = 1;
        await syncGahenaxMission();
        console.log("Hybrid RNG Ready. Starting...");
    } else {
        globals.sessionProfit += lastBetResult.profit;
        globals._0xnonce++;
        
        if (lastBetResult.win) {
            globals.currentBet = CONFIG.baseBet;
            globals.roundCounter = 0;
        } else {
            // Martingala solo si no hay predicción activa o si decidimos arriesgar
            globals.roundCounter++;
            globals.currentBet = (parseFloat(globals.currentBet) * CONFIG.multiLoss).toFixed(8);
        }
    }

    // --- GOBERNANZA (LÍMITES POOL 2) ---
    if (globals.sessionProfit >= CONFIG.targetProfit) {
        console.log("%c [STOP] TARGET REACHED: " + globals.sessionProfit, "color: #0f0;");
        stop();
    }
    if (globals.sessionProfit <= -CONFIG.maxLoss) {
        console.log("%c [STOP] MAX LOSS REACHED. ", "color: #f00;");
        stop();
    }

    // --- MATRIZ DE DECISIÓN HÍBRIDA ---
    var finalBet = globals.currentBet;
    var currentChance = CONFIG.chance;
    var betType = "high";
    var mode = "NORMAL";

    if (window.MISSION.active) {
        // ¿El Radar dice que es un GAP (Hueco)? -> Quemamos nonce con mínima
        const isWin = window.MISSION.wins.includes(globals._0xnonce);
        const isBigWin = window.MISSION.big_wins.includes(globals._0xnonce);

        if (isBigWin) {
            finalBet = (CONFIG.baseBet * 10).toFixed(8); // STRIKE QUIRÚRGICO x10
            mode = "STRIKE";
        } else if (isWin) {
            finalBet = CONFIG.baseBet;
            mode = "PREDICTED_WIN";
        } else {
            finalBet = 0.00000001; // BURN GAP
            mode = "GAP_EVASION";
        }
    }

    // --- RESET DE SEGURIDAD (ANTI-RUIDO) ---
    if (globals.roundCounter >= CONFIG.maxSessionRounds && !lastBetResult.win) {
        globals.currentBet = CONFIG.baseBet;
        globals.roundCounter = 0;
    }

    // --- CAPA STEALTH ---
    if (Math.random() < CONFIG.stealthLevel) {
        currentChance = (35 + Math.random() * 30).toFixed(2);
        betType = Math.random() > 0.5 ? "high" : "low";
        mode += "_STEALTH";
    }

    // --- TELEMETRÍA ---
    localStorage.setItem('__ga_inbox', JSON.stringify({
        profit: globals.sessionProfit,
        streak: globals._0xnonce,
        mode: mode
    }));

    // --- EJECUCIÓN ---
    bet = {
        amount: finalBet,
        chance: currentChance,
        type: betType
    };
})();
