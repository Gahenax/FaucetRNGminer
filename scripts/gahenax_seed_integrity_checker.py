import hmac
import hashlib

def verify_roll(server_seed, client_seed, nonce):
    """
    Simulación exacta de la lógica de FaucetPay (HMAC-SHA512)
    """
    message = f"{client_seed}:{nonce}"
    hash_obj = hmac.new(server_seed.encode(), message.encode(), hashlib.sha512)
    hash_hex = hash_obj.hexdigest()
    
    # Extraer el roll del hash (Lógica estándar de FaucetPay)
    # Buscamos los primeros 5 caracteres que formen un número < 1,000,000
    for i in range(0, len(hash_hex) - 5, 5):
        chunk = hash_hex[i:i+5]
        val = int(chunk, 16)
        if val < 1000000:
            return (val % 10000) / 100
    return 0

def audit_integrity(server_seed, client_seed, real_history):
    """
    Compara el historial real con el matemático
    real_history: lista de (nonce, roll_esperado)
    """
    print(f" INICIANDO AUDITORÍA FORENSE DE SEMILLA")
    print(f"Server Seed: {server_seed}")
    print(f"Client Seed: {client_seed}")
    print("-" * 50)
    
    matches = 0
    total = len(real_history)
    
    for nonce, real_roll in real_history:
        calc_roll = verify_roll(server_seed, client_seed, nonce)
        diff = abs(calc_roll - real_roll)
        
        if diff < 0.01:
            print(f"[] Nonce {nonce}: MATCH ({calc_roll})")
            matches += 1
        else:
            print(f"[] Nonce {nonce}: MISMATCH! Real: {real_roll} | Calc: {calc_roll}")
            
    print("-" * 50)
    integrity = (matches / total) * 100 if total > 0 else 0
    print(f"INTEGRIDAD: {integrity:.2f}%")
    
    if integrity < 100:
        print(" ALERTA: GHOST TENSOR DETECTADO. LAS SEEDS SON UNA FACHADA.")
    else:
        print(" VERIFICACIÓN EXITOSA. EL SISTEMA ES DETERMINISTA.")

if __name__ == "__main__":
    # EJEMPLO DE USO (El usuario debe proveer estos datos tras rotar la semilla)
    # s_seed = "..." 
    # c_seed = "..."
    # history = [(1, 52.41), (2, 10.12)]
    pass
