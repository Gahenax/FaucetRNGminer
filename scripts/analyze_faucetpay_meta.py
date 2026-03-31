import json
from gahenax_spy_system.agents.meta_informant import MetaInformant
from gahenax_spy_system.utils import StealthHTTPClient

def run_deep_mission():
    url = "https://faucetpay.io/advanced-dice?type=script"
    http = StealthHTTPClient()
    inf = MetaInformant(http)
    
    print(f"[*] Fetching base HTML for {url}...")
    resp = http.get(url)
    if not resp:
        print("[-] Failed to fetch base HTML (Blocked).")
        return

    # Analizar base
    results = inf.analyze(url, html_content=resp.text)
    
    # Buscar chunks en el HTML
    import re
    chunks = re.findall(r'src="(/static/js/[^"]+\.js)"', resp.text)
    
    for chunk_rel in chunks:
        chunk_url = f"https://faucetpay.io{chunk_rel}"
        print(f"[*] Analyzing chunk: {chunk_url}")
        c_resp = http.get(chunk_url)
        if c_resp:
            # Buscar comentarios y meta-patrones en el JS
            c_text = c_resp.text
            # Comentarios en JS (pocos en minificado, pero a veces hay licencias o TODOs)
            js_comments = re.findall(r"/\*.*?\*/|//.*", c_text)
            results["comments"].extend([c.strip() for c in js_comments if len(c) > 20])
            
            if "webpack" in c_text:
                results["webpack_manifests"].append({
                    "src": chunk_url,
                    "info": "Webpack module detected"
                })

    print("\n[+] Misión de Meta-Información Completada:")
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    run_deep_mission()
