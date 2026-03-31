/**
 * GAHENAX HYBRID v6.0 - KERNEL SYNC EDITION
 * Minimalist, high-performance deterministic engine.
 */

// 1. CONFIGURACIÓN POOL 2
var CONFIG = {
    baseBet: 0.000020,         
    multiLoss: 2.5,            
    targetProfit: 0.20,        
    maxLoss: 1.20,             
    maxSessionRounds: 5,       
    chance: 49.5,              
    stealthLevel: 0.15         
};

// 2. INICIALIZACIÓN (v6 Atomic State)
if (isFirstBet) {
    globals.currentBet = CONFIG.baseBet;
    globals.sessionProfit = 0;
    globals.roundCounter = 0;
    globals._nonce = 1; 
    console.log("Gahenax Kernel v6.0 Active.");
} else {
    globals.sessionProfit += lastBetResult.profit;
    globals._nonce++;
    if (lastBetResult.win) {
        globals.currentBet = CONFIG.baseBet;
        globals.roundCounter = 0;
    } else {
        globals.roundCounter++;
        globals.currentBet = (parseFloat(globals.currentBet) * CONFIG.multiLoss).toFixed(8);
    }
}

// 3. RADAR SYNC (STREAGE BRIDGE)
var finalBet = globals.currentBet;
var currentChance = CONFIG.chance;
var betType = "high";
var mode = "NORMAL";

try {
    var raw = localStorage.getItem('__ga_mission');
    if (raw) {
        var mission = JSON.parse(raw);
        var match = mission.find(m => m.nonce === globals._nonce);
        if (match) {
            if (match.type === "BIG_WIN") {
                finalBet = (CONFIG.baseBet * 10).toFixed(8); // STRIKE x10
                mode = "STRIKE";
            } else if (match.type === "WIN") {
                finalBet = CONFIG.baseBet;
                mode = "WIN_PREDICTION";
            } else {
                finalBet = 0.00000001; // GAP EVASION
                mode = "GAP";
            }
        }
    }
} catch(e) {}

// 4. GOBERNANZA & STEALTH
if (globals.sessionProfit >= CONFIG.targetProfit || globals.sessionProfit <= -CONFIG.maxLoss) { stop(); }
if (globals.roundCounter >= CONFIG.maxSessionRounds && !lastBetResult.win) {
    globals.currentBet = CONFIG.baseBet;
    globals.roundCounter = 0;
}
if (Math.random() < CONFIG.stealthLevel) {
    currentChance = (35 + Math.random() * 30).toFixed(2);
    betType = Math.random() > 0.5 ? "high" : "low";
}

// 5. TELEMETRÍA (v6 Sync)
try {
    localStorage.setItem('__ga_inbox', JSON.stringify({
        profit: globals.sessionProfit,
        streak: globals._nonce,
        mode: mode
    }));
} catch(e) {}

// 6. EJECUCIÓN
bet = {
    amount: finalBet,
    chance: Number(currentChance),
    type: betType
};
