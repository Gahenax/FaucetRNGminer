"""

           GAHENAX AI — API QUICKSTART                                    
           Usa un Claude (u otro LLM) con identidad Antigravity completa  


INSTALACIÓN:
  pip install anthropic          # Para usar con Claude (recomendado)
  pip install openai             # Para GPT-4o u Ollama

USO RÁPIDO:
  python gahenax_api_quickstart.py

El script importa GahenaxEngine de gahenax_master_prompt.py (ya existe en este repo).
"""

from gahenax_master_prompt import GahenaxEngine, BM25Router


# 
#  CONFIGURACIÓN — descomenta el proveedor que quieras usar
# 

def get_engine() -> GahenaxEngine:
    """
    Retorna un GahenaxEngine configurado.
    Descomenta el proveedor que prefieras.
    """

    #  OPCIÓN 1: Anthropic Claude (recomendado — mismo modelo que Antigravity)
    return GahenaxEngine(
        provider="anthropic",
        api_key="sk-ant-XXXXXXXXXXXXXXXXXXXXXXXX",  # ← pon tu API key aquí
        model="claude-opus-4-5",                     # o "claude-sonnet-4-5" para menor costo
        max_tokens=4096,
        temperature=0.2,
    )

    #  OPCIÓN 2: OpenAI GPT-4o
    # return GahenaxEngine(
    #     provider="openai",
    #     api_key="sk-XXXXXXXXXXXXXXXXXXXXXXXX",
    #     model="gpt-4o",
    # )

    #  OPCIÓN 3: Ollama local (sin costo, sin internet)
    #    Requiere: ollama pull llama3.3  (o cualquier modelo local)
    # return GahenaxEngine(
    #     provider="ollama",
    #     base_url="http://localhost:11434/v1",
    #     model="llama3.3",
    # )

    #  OPCIÓN 4: Groq (velocidad máxima, precio bajo)
    # return GahenaxEngine(
    #     provider="groq",
    #     api_key="gsk_XXXXXXXXXXXXXXXXXXXXXXXX",
    #     model="llama-3.3-70b-versatile",
    # )


# 
#  DEMO — 3 casos de uso representativos de Gahenax AI
# 

def demo_arquitectura(engine: GahenaxEngine) -> None:
    """Caso 1: Solicitud de arquitectura — activa CIE Sigil Routing."""
    print("\n" + "" * 70)
    print("DEMO 1 — CIE Sigil Routing: Diseño de API REST")
    print("" * 70)

    response = engine.chat(
        "Necesito diseñar un endpoint REST POST /orders que valide el pago, "
        "guarde la orden en MySQL y publique un evento a Kafka. "
        "¿Cómo lo estructuras con el patrón Sigil de Gahenax?"
    )
    print(response)


def demo_debugging(engine: GahenaxEngine) -> None:
    """Caso 2: Debugging — activa systematic-debugging skill."""
    print("\n" + "" * 70)
    print("DEMO 2 — Systematic Debugging: Error en FastAPI")
    print("" * 70)

    response = engine.chat(
        "Mi endpoint FastAPI /process-data bloquea el event loop cuando recibe "
        "un archivo de 500MB. El servidor se congela 30 segundos. "
        "Error: 'coroutine never awaited'. ¿Qué está mal y cómo lo corrijo?"
    )
    print(response)


def demo_hpc(engine: GahenaxEngine) -> None:
    """Caso 3: Compute pesado — activa jules-heavy-compute y rust-rayon-parallelism."""
    print("\n" + "" * 70)
    print("DEMO 3 — HPC: Sweep paralelo de Mersenne")
    print("" * 70)

    response = engine.chat(
        "Necesito verificar primorialidad de Mersenne en el rango 1M-10M. "
        "¿Cómo lo despacho a Jules y qué workflow de Rust con Rayon usarías?"
    )
    print(response)


# 
#  BM25 ROUTER DEMO — Routing de Skills sin LLM
# 

def demo_bm25_router() -> None:
    """Muestra el BM25 Router de Skills funcionando de forma determinista."""
    print("\n" + "" * 70)
    print("DEMO 4 — BM25 Skill Router (sin LLM, 0 costo)")
    print("" * 70)

    router = BM25Router()

    test_queries = [
        "Quiero configurar Ollama con llama3 en mi servidor",
        "Necesito un bot de Discord que capture leads B2B",
        "Cómo paralelizo con Rayon en Rust el sweep de Mersenne",
        "Dame un archivo CLAUDE.md para un proyecto Next.js",
        "Diseña un flujo BPMN con compuertas paralelas para aprobaciones",
    ]

    for query in test_queries:
        skill, score = router.route(query)
        status = "" if score >= 0.5 else " (fallback)"
        print(f"  {status}  Query: {query[:55]!r}")
        print(f"          → Skill: {skill}  (score: {score:.3f})\n")


# 
#  INTERACTIVE CHAT — Sesión de chat con historial
# 

def interactive_chat(engine: GahenaxEngine) -> None:
    """
    Sesión de chat interactivo con Gahenax AI.
    Mantiene historial de la conversación.
    Escribe 'salir' o 'exit' para terminar.
    """
    print("\n" + "" * 70)
    print("GAHENAX AI — Chat Interactivo")
    print("Escribe 'salir' para terminar.")
    print("" * 70 + "\n")

    while True:
        try:
            user_input = input("Tú: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nSesión terminada.")
            break

        if not user_input:
            continue

        if user_input.lower() in ("salir", "exit", "quit"):
            print("Gahenax AI: Hasta luego. ")
            break

        response = engine.chat(user_input)
        print(f"\nGahenax AI:\n{response}\n")


# 
#  ENTRYPOINT
# 

if __name__ == "__main__":
    import sys

    # Primero muestra el BM25 Router (no requiere API key)
    demo_bm25_router()

    # Verifica que haya API key antes de llamar al LLM
    engine = get_engine()

    #  Modo demo (pasa cualquier argumento para demos rápidas)
    if len(sys.argv) > 1 and sys.argv[1] == "--demo":
        demo_arquitectura(engine)
        demo_debugging(engine)
        demo_hpc(engine)
    else:
        #  Modo interactivo por defecto
        interactive_chat(engine)
