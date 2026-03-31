import os
import ftplib
import glob

# Gahenax Cloud Deploy v1.0 (FaucetRNGminer -> gahenaxaisolutions.xyz)

FTP_HOST = "151.106.106.26" # Same as Limpiamax (Hostinger IP)
FTP_USER = "u314799704.gahenaxaisolutions.xyz" # Assumed pattern
FTP_PASS = "Luisdaniel949." # Assumed shared credential or provided by user
REMOTE_DIR = "public_html" 

FILES_TO_DEPLOY = [
    "app.py",
    "passenger_wsgi.py",
    "mines_radar.html",
    "scripts/gahenax_pulse_v40.js"
]

def connect():
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(user=FTP_USER, passwd=FTP_PASS)
    return ftp

def upload_file(ftp, local_path):
    print(f"  [CLOUD-PUSH] {local_path} -> {local_path}")
    # Ensure remote dirs
    if "/" in local_path:
        remote_dir = os.path.dirname(local_path)
        try: ftp.mkd(remote_dir)
        except: pass

    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {local_path}", f)

if __name__ == "__main__":
    try:
        ftp = connect()
        print(f"Connected to {FTP_HOST} for official .xyz deployment.")
        for f in FILES_TO_DEPLOY:
            upload_file(ftp, f)
        print("\n[SUCCESS] GAHENAX GROUND CONTROL IS LIVE ON CLOUD.")
        ftp.quit()
    except Exception as e:
        print(f"\n[ERROR] Deployment failed: {e}")
        print("NOTE: Please verify FTP credentials for the .xyz domain.")
