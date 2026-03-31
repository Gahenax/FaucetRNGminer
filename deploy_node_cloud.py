import os
import ftplib

# GAHENAX CLOUD NODE DEPLOY v1.2 (Express Edition)
# Target: gahenaxaisolutions.online / gahenaxaisolutions.xyz

FTP_HOST = "151.106.106.26"
FTP_USER = "u314799704.gahenaxaisolutions.online"
FTP_PASS = "Luisdaniel949."
REMOTE_DIR = "public_html" 

FILES_TO_DEPLOY = [
    "index.js",
    "package.json",
    "mines_radar.html",
    "scripts/gahenax_pulse_v40.js",
    "scripts/gahenax_pulse_v40.1.js",
    "scripts/gahenax_pulse_v40.3.js"
]

def connect():
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(user=FTP_USER, passwd=FTP_PASS)
    return ftp

def upload_file(ftp, local_path):
    print(f"  [NODE-PUSH] {local_path} -> {local_path}")
    if "/" in local_path:
        remote_dir = os.path.dirname(local_path)
        try: ftp.mkd(remote_dir)
        except: pass
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {local_path}", f)

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
