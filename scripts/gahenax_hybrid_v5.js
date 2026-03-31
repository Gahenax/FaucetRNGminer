/**
 * GAHENAX HYBRID v5.0.2 - "SCRIPT #2" EDITION
 * Optimizado para compatibilidad total con el motor de FaucetPay.
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
    console.log("Gahenax Hybrid Ready.");
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

// 3. GOBERNANZA
if (globals.sessionProfit >= CONFIG.targetProfit || globals.sessionProfit <= -CONFIG.maxLoss) {
    stop();
}

// 4. MATRIZ HÍBRIDA (RADAR SYNC)
var finalBet = globals.currentBet;
var currentChance = CONFIG.chance;
var betType = "high";
var mode = "NORMAL";

// Intentamos leer del Radar si está inyectado en la ventana global
if (window.MISSION && window.MISSION.active) {
    var isWin = window.MISSION.wins && window.MISSION.wins.includes(globals._0xnonce);
    var isBigWin = window.MISSION.big_wins && window.MISSION.big_wins.includes(globals._0xnonce);

    if (isBigWin) {
        finalBet = (CONFIG.baseBet * 10).toFixed(8);
        mode = "STRIKE";
    } else if (isWin) {
        finalBet = CONFIG.baseBet;
        mode = "PREDICTED";
    } else {
        finalBet = 0.00000001; // GAP EVASION
        mode = "GAP";
    }
}

// 5. RESET DE SEGURIDAD
if (globals.roundCounter >= CONFIG.maxSessionRounds && !lastBetResult.win) {
    globals.currentBet = CONFIG.baseBet;
    globals.roundCounter = 0;
}

// 6. CAPA STEALTH
if (Math.random() < CONFIG.stealthLevel) {
    currentChance = (35 + Math.random() * 30).toFixed(2);
    betType = Math.random() > 0.5 ? "high" : "low";
}

// 7. TELEMETRÍA (SIN BLOQUEO)
try {
    localStorage.setItem('__ga_inbox', JSON.stringify({
        profit: globals.sessionProfit,
        streak: globals._0xnonce,
        mode: mode
    }));
} catch(e) {}

// 8. EJECUCIÓN (CAMPOS ESTÁNDAR)
bet = {
    amount: finalBet,
    chance: Number(currentChance),
    type: betType
};
