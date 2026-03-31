/**
 * GAHENAX SEED DEEP SCANNER v1.2
 * Inyectar en consola F12 (Tab: Provably Fair abierto)
 */
(function() {
    const inputs = document.querySelectorAll('input');
    let results = {
        serverHash: "NOT_FOUND",
        clientSeed: "NOT_FOUND",
        nonce: "NOT_FOUND"
    };

    inputs.forEach(input => {
        const val = input.value;
        const placeholder = (input.getAttribute('placeholder') || "").toLowerCase();
        const id = (input.id || "").toLowerCase();
        const name = (input.name || "").toLowerCase();

        // Detectar Server Seed Hash (64 chars, hex)
        if (val.length === 64 && /^[a-f0-9]+$/.test(val)) {
            results.serverHash = val;
        }
        // Detectar Client Seed (Típico: largo, alfanumérico)
        else if (placeholder.includes('client') || id.includes('client') || name.includes('client')) {
            results.clientSeed = val;
        }
        // Detectar Nonce (Numérico)
        else if (placeholder.includes('nonce') || id.includes('nonce') || name.includes('nonce')) {
            results.nonce = val;
        }
    });

    // Escaneo Secundario: Texto estático (si los inputs fallan)
    if (results.serverHash === "NOT_FOUND" || results.clientSeed === "NOT_FOUND") {
        document.querySelectorAll('div, span, td, b').forEach(el => {
            const text = el.innerText.trim();
            if (text.length === 64 && /^[a-f0-9]+$/.test(text) && results.serverHash === "NOT_FOUND") {
                results.serverHash = text;
            }
            if (el.innerText.toLowerCase().includes('client seed')) {
                const nextVal = el.nextElementSibling ? el.nextElementSibling.innerText.trim() : "";
                if (nextVal.length > 20) results.clientSeed = nextVal;
            }
        });
    }

    console.log("%c  GAHENAX DEEP SCAN REPORT v1.2.1 ", "background: #000; color: #0f0; font-weight: bold; padding: 5px;");
    console.log("Server Seed (Hash): %c" + results.serverHash, "color: #ff0;");
    console.log("Client Seed: %c" + results.clientSeed, "color: #0ff;");
    console.log("Current Nonce: %c" + results.nonce, "color: #f0f;");
    console.log("-----------------------------------------");
    console.log("Tip: Asegúrate de estar en la pestaña de 'Provably Fair'.");
})();
