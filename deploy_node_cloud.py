import os
import ftplib

# GAHENAX CLOUD NODE DEPLOY v1.2 (Express Edition)
# Target: gahenaxaisolutions.online / gahenaxaisolutions.xyz

FTP_HOST = "151.106.106.26"
FTP_USER = "u314799704.gahenaxaisolutions.online"
FTP_PASS = "Luisdaniel949."
REMOTE_APP_DIR = "" # Target the root of the FTP (where the app lives)

FILES_TO_DEPLOY = [
    "index.js",
    "package.json",
    "mines_radar.html",
    "tmp/restart.txt",
    "scripts/gahenax_pulse_v60.js",
    "scripts/gahenax_hybrid_v6.js",
    "scripts/gahenax_pulse_v40.js",
    "scripts/gahenax_pulse_v40.1.js",
    "scripts/gahenax_pulse_v40.3.js",
    "scripts/gahenax_hybrid_v5.js"
]

function_connect = None # Placeholder to keep line references similar

def connect():
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(user=FTP_USER, passwd=FTP_PASS)
    return ftp

def upload_file(ftp, local_path):
    # Use strict relative paths from the FTP root login
    remote_path = local_path.lstrip("/") 
    print(f"  [NODE-TARGET-PUSH] {local_path} -> {remote_path}")
    
    # Handle subdirectories (scripts, tmp)
    if "/" in local_path:
        dirs = local_path.split("/")[:-1]
        current_dir = ""
        for d in dirs:
            current_dir = d if not current_dir else f"{current_dir}/{d}"
            try: ftp.mkd(current_dir)
            except: pass

    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f)

if __name__ == "__main__":
    try:
        ftp = connect()
        print(f"Connected to {FTP_HOST} for OFFICIAL NODE DEPLOY.")
        for f in FILES_TO_DEPLOY:
            if os.path.exists(f):
                upload_file(ftp, f)
        print("\n[SUCCESS] GAHENAX EXPRESS NODE IS LIVE ON CLOUD.")
        ftp.quit()
    except Exception as e:
        print(f"\n[ERROR] Deployment failed: {e}")
