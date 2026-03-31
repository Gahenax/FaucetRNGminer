from gahenax_spy_system.agents.seed_auditor import SeedAuditor

def assemble_final_script():
    server_seed = "6d38620f54737abe5aaa9b84f07f95c37f86c7d44cfa769c92624feba20b61c5"
    client_seed = "ZNlroeoesWbvZJiW7K9K7UJ5XBr8xxRFPMFXkY2cLUK08btMBO62eXrhuOGxLI1j"
    start_nonce = 407 # Siguiente es 408
    
    auditor = SeedAuditor()
    wins = []
    big_wins = []
    gaps = []
    
    for nonce in range(start_nonce + 1, start_nonce + 501):
        res = auditor.verify(server_seed, client_seed, nonce)
        num = res["result_number"]
        if num > 90.0:
            big_wins.append(nonce)
        elif num > 50.49: 
            wins.append(nonce)
        else:
            gaps.append(nonce)
            
    js_template = f"""
/**
 * GAHENAX PULSE v35.5 [HOTFIX - REFERENCE DEFINED]
 * Logic: Gauge Symmetry + Riemann Zeros
 * Status: RE-SYNCED COHERENCE
 */

var gahenax_pulse_v35 = true; // Define reference for platform runner

var _0xYM = {{ 
    baseBet: 0.000005, 
    excitedBet: 0.00015,
    seriesSize: 100,
    target: 0.25,
    chance: 49.5 
}};

const WINS = {wins};
const BIG_WINS = {big_wins};
const GAPS = {gaps};

if (typeof globals._0xnonce === 'undefined' || isFirstBet) {{
    globals._0xnonce = {start_nonce + 1};
    globals._0xlastStop = {start_nonce};
    globals._0xprofit = 0;
    globals._0xmode = "VACUUM";
    console.log("%c YANG-MILLS v35.2 [RE-SYNCED]", "color: #0ff; font-weight: bold;");
    console.log("New Client Seed Active. Nonce: " + globals._0xnonce);
}} else {{
    globals._0xprofit += lastBetResult.profit;
    globals._0xnonce++;
}}

// --- GOBERNANZA RIEMANN ---
if (globals._0xnonce > (globals._0xlastStop + _0xYM.seriesSize)) {{
    globals._0xlastStop = globals._0xnonce - 1;
    console.log("%c SERIES COMPLETE ", "background: #111; color: #f0f;");
    stop();
}}

// --- DETERMINISTIC ENGINE ---
var currentAmt = _0xYM.baseBet;
globals._0xmode = "VACUUM";

if (BIG_WINS.includes(globals._0xnonce)) {{
    globals._0xmode = "EXCITED";
    currentAmt = _0xYM.excitedBet;
    console.log("[RIEMANN PEAK] BIG WIN: Nonce " + globals._0xnonce);
}} else if (WINS.includes(globals._0xnonce)) {{
    currentAmt = _0xYM.baseBet;
}} else {{
    currentAmt = _0xYM.baseBet; 
    console.log("[VACUUM MODE] Nonce " + globals._0xnonce);
}}

// --- DASHBOARD (NO-CLEAR VERSION) ---
if (globals._0xnonce % 10 === 0) {{
    console.log("%c GAHENAX DASHBOARD | Nonce: " + globals._0xnonce + " | Profit: " + globals._0xprofit.toFixed(8), "color: #0f0;");
}}

bet = {{ 
    betAmount: currentAmt, 
    chance: _0xYM.chance, 
    type: "high" 
}};
"""
    with open("c:/Users/jotam/OneDrive/Desktop/GahenaxAI/gahenax_pulse_v35.js", "w", encoding="utf-8") as f:
        f.write(js_template)
    print("[+] Grand Unified Script v35.2 (No Emojis) generado con éxito.")
    with open("c:/Users/jotam/OneDrive/Desktop/GahenaxAI/gahenax_pulse_v35.js", "w", encoding="utf-8") as f:
        f.write(js_template)
    print("[+] Grand Unified Script v35.0 generado con éxito.")
    with open("c:/Users/jotam/OneDrive/Desktop/GahenaxAI/gahenax_pulse_v33.js", "w", encoding="utf-8") as f:
        f.write(js_template)
    print("[+] Script Gahenax Pulse v33.0 Primordial generado con éxito.")
    with open("c:/Users/jotam/OneDrive/Desktop/GahenaxAI/gahenax_pulse_v32_5.js", "w", encoding="utf-8") as f:
        f.write(js_template)
    print("[+] Script Gahenax Pulse v32.5 generado con éxito.")

if __name__ == "__main__":
    assemble_final_script()
