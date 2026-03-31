/**
 * GAHENAX PULSE v40.3 - RISK CALIBRATED (200 // 0.50)
 * Logic: Precise 200-Nonce Window
 * Safety: Automatic 0.50 Stop-Loss
 */

var _0xYM = { 
    baseBet: 0.000005, 
    excitedBet: 0.00015,
    seriesSize: 200, // CALIBRADO: 200
    chance: 49.5 
};

// --- MISSION BUFFER ---
var MISSION = {
    wins: [],
    big_wins: [],
    gaps: [],
    active: false
};

async function syncGahenaxMission() {
    console.log("%c [ORACLE] SYNCING MISSION (200-WINDOW)... ", "background: #111; color: #ff0;");
    try {
        const res = await fetch("https://gahenaxaisolutions.online/api/mission");
        const data = await res.json();
        if (data.wins) {
            MISSION.wins = data.wins;
            MISSION.big_wins = data.big_wins;
            MISSION.gaps = data.gaps;
            MISSION.active = true;
            console.log("%c [ORACLE] MISSION ARMED: CALIBRATED 200 MODE. ", "color: #0f0; font-weight: bold;");
        }
    } catch(e) {
        console.log("%c [ORACLE] SYNC FAILED: WAITING FOR INJECTION...", "color: #f00;");
    }
}

if (typeof globals._0xnonce === 'undefined' || isFirstBet) {
    globals._0xnonce = 0; 
    globals._0xlastStop = 0;
    globals._0xprofit = 0;
    globals._0xmode = "WAITING_INJECTION";
    syncGahenaxMission();
} else {
    globals._0xprofit += lastBetResult.profit;
    globals._0xnonce++;
}

// --- SAFETY PROTOCOL (STOP-LOSS 0.50) ---
if (globals._0xprofit <= -0.50) {
    console.log("%c [CRITICAL] STOP-LOSS ALCANZADO (-0.50). SUSPENDIENDO... ", "background: #f00; color: #fff; font-weight: bold;");
    stop();
}

// --- DETERMINISTIC ENGINE ---
var currentAmt = _0xYM.baseBet;

if (!MISSION.active) {
    console.log("%c [SUSPENDED] WAITING FOR MANUAL INJECTION IN DASHBOARD ", "color: #666;");
    stop();
} else {
    if (MISSION.big_wins.includes(globals._0xnonce)) {
        globals._0xmode = "EXCITED";
        currentAmt = _0xYM.excitedBet;
        console.log("[PEAK] BIG WIN: Nonce " + globals._0xnonce);
    } else if (MISSION.wins.includes(globals._0xnonce)) {
        globals._0xmode = "NORMAL";
        currentAmt = _0xYM.baseBet;
    } else {
        globals._0xmode = "VACUUM";
        currentAmt = _0xYM.baseBet; 
    }
}

// --- TELEMETRY BRIDGE ---
try {
    localStorage.setItem('__ga_inbox', JSON.stringify({
        profit: globals._0xprofit,
        streak: globals._0xnonce,
        mode: globals._0xmode
    }));
} catch(e) {}

bet = { 
    betAmount: currentAmt, 
    chance: _0xYM.chance, 
    type: "high" 
};
