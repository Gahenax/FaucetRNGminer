import os
import re
import sys

# Regex for emojis (Unicode ranges covering most emojis)
EMOJI_PATTERN = re.compile(
    "["
    "\U0001f300-\U0001f5ff"  # symbols & pictographs
    "\U0001f600-\U0001f64f"  # emoticons
    "\U0001f680-\U0001f6ff"  # transport & map symbols
    "\U0001f1e0-\U0001f1ff"  # flags (iOS)
    "\U00002702-\U000027b0"  # miscellaneous symbols
    "\U000024c2-\U0001f251"
    "\U0001f900-\U0001f9ff"  # supplemental symbols and pictographs
    "\U0001f700-\U0001f77f"  # Alchemical Symbols
    "\U0001f780-\U0001f7ff"  # Geometric Shapes Extended
    "\U0001f800-\U0001f8ff"  # Supplemental Arrows-C
    "\U0001fa70-\U0001faff"  # Symbols and Pictographs Extended-A
    "]+", flags=re.UNICODE
)

# Configuration
TARGET_EXTENSIONS = ('.py', '.js', '.mjs', '.md', '.txt', '.tsx', '.ts')
IGNORE_DIRS = ('.next', 'node_modules', '.git', 'spy_data', '.spy_cache', 'gahenax_user_session_selenium', 'venv', '.venv', 'env')
EXCLUDE_PATH_PREFIX = os.path.join('limpiamax-web', 'src', 'components') # User UI Preservation

def clean_file(filepath):
    """Removes emojis from a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = EMOJI_PATTERN.sub('', content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
    except Exception as e:
        print(f"Error cleaning {filepath}: {e}")
    return False

def main(root_dir):
    print(f"[*] Starting Gahenax Professionalizer (Emoji Purge) in: {root_dir}")
    count = 0
    modified = 0
    
    for root, dirs, files in os.walk(root_dir):
        # Pruning ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        # Check if we are in the excluded UI components directory
        rel_path = os.path.relpath(root, root_dir)
        if rel_path.startswith(EXCLUDE_PATH_PREFIX):
            continue
            
        for file in files:
            if file.lower().endswith(TARGET_EXTENSIONS):
                filepath = os.path.join(root, file)
                count += 1
                if clean_file(filepath):
                    modified += 1
                    print(f"  [CLEANED] {filepath}")

    print(f"\n[!] Audit Complete.")
    print(f"    - Files scanned: {count}")
    print(f"    - Files professionalized: {modified}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    main(target)
