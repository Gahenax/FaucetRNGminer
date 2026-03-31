/**
 * GAHENAX HYBRID v5.0.3 - "STORAGE BRIDGE" EDITION
 * Optimizado para entornos aislados (Sandbox) usando localStorage.
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

// 2. INICIALIZACIÓN
if (isFirstBet) {
    globals.currentBet = CONFIG.baseBet;
    globals.sessionProfit = 0;
    globals.roundCounter = 0;
    globals._0xnonce = 1;
    console.log("Gahenax Hybrid Memory-Sync Ready.");
} else {
    globals.sessionProfit += lastBetResult.profit;
    globals._0xnonce++;
    if (lastBetResult.win) {
        globals.currentBet = CONFIG.baseBet;
        globals.roundCounter = 0;
    } else {
        globals.roundCounter++;
        globals.currentBet = (parseFloat(globals.currentBet) * CONFIG.multiLoss).toFixed(8);
    }
}

// 3. MATRIZ HÍBRIDA (MEMORY BRIDGE)
var finalBet = globals.currentBet;
var currentChance = CONFIG.chance;
var betType = "high";

try {
    // Intentamos recuperar la misión desde el almacenamiento del navegador
    var ga_mission_str = localStorage.getItem('__ga_mission');
    if (ga_mission_str) {
        var MISSION = JSON.parse(ga_mission_str);
        if (MISSION.wins && MISSION.wins.includes(globals._0xnonce)) {
            finalBet = CONFIG.baseBet; 
            // Si es Big Win, strike x10
            if (MISSION.big_wins && MISSION.big_wins.includes(globals._0xnonce)) {
                finalBet = (CONFIG.baseBet * 10).toFixed(8);
            }
        } else {
            finalBet = 0.00000001; // GAP EVASION
        }
    }
} catch(e) {
    // Si localStorage está bloqueado, jugamos con la base por seguridad
    finalBet = globals.currentBet;
}

// 4. GOBERNANZA
if (globals.sessionProfit >= CONFIG.targetProfit || globals.sessionProfit <= -CONFIG.maxLoss) { stop(); }
if (globals.roundCounter >= CONFIG.maxSessionRounds && !lastBetResult.win) {
    globals.currentBet = CONFIG.baseBet;
    globals.roundCounter = 0;
}

// 5. CAPA STEALTH
if (Math.random() < CONFIG.stealthLevel) {
    currentChance = (35 + Math.random() * 30).toFixed(2);
    betType = Math.random() > 0.5 ? "high" : "low";
}

// 6. TELEMETRÍA
try {
    localStorage.setItem('__ga_inbox', JSON.stringify({
        profit: globals.sessionProfit,
        streak: globals._0xnonce
    }));
} catch(e) {}

// 7. EJECUCIÓN
bet = {
    amount: finalBet,
    chance: Number(currentChance),
    type: betType
};
