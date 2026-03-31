/**
 * GAHENAX FAUCETPAY DICE FIDDLER v1.0
 * Regla para interceptar peticiones de RNG / Dice.
 */
(function(session) {
    if (session.url.includes("faucetpay.io/dice/")) {
        // Capturar Petición (Request)
        const reqBody = session.getRequestBodyAsString();
        
        // Capturar Respuesta (Response)
        const respBody = session.getResponseBodyAsString();

        if (session.url.includes("play") || session.url.includes("rotate-seed")) {
            // Forward de metadatos a Gahenax Spy System
            fetch("http://localhost:8080", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ts: new Date().toISOString(),
                    endpoint: session.url,
                    request: reqBody,
                    response: respBody,
                    status: session.responseCode
                })
            });
            
            console.log(" GAHENAX NETWORK CAPTURE: " + session.url);
        }
    }
})(session);
