from gahenax_spy_system.agents.seed_auditor import SeedAuditor

def recovery_projection():
    server_seed = "6d38620f54737abe5aaa9b84f07f95c37f86c7d44cfa769c92624feba20b61c5"
    client_seed = "SaAWoWKpW4SoEI0sAyCSMWZ6hmOl6Wb7qyZ1cmsyVIHbwvqwVmYd3hJBYdu9M5q0t"
    current_nonce = 207
    
    auditor = SeedAuditor()
    print(f"Auditoría Proyectada (Nonce {current_nonce} -> {current_nonce + 500})")
    print("-" * 50)
    
    for block in range(5):
        start = current_nonce + (block * 100)
        end = start + 100
        wins = 0
        big_wins = 0
        losses = 0
        
        for nonce in range(start, end):
            res = auditor.verify(server_seed, client_seed, nonce)
            num = res["result_number"]
            if num > 90.0: big_wins += 1
            elif num > 50.49: wins += 1
            else: losses += 1
            
        print(f"Bloque {block+1} ({start}-{end}): Wins: {wins} | BIG: {big_wins} | Losses: {losses}")
        if big_wins > 5:
            print(f"  [] ALERTA: Zona de Excitación Detectada. Tendencia ALTA.")
        elif losses > 55:
            print(f"  [] ALERTA: Mass Gap Detectado. Tendencia BAJA.")

if __name__ == "__main__":
    recovery_projection()
