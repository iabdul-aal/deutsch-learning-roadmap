import json
import re

with open(r'E:\German\scripts\piece_of_german_48weeks_extracted.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

videos = data['videos']

# Read original base videoLibrary.ts (reset from git first or sanitize in place)
vlib_path = r'E:\German\src\data\videoLibrary.ts'
with open(vlib_path, 'r', encoding='utf-8') as f:
    vlib_text = f.read()

# Fix keys starting with pog_ that are not quoted
vlib_text = re.sub(r'^\s*(pog_[a-zA-Z0-9_-]+):', r"  '\1':", vlib_text, flags=re.M)

with open(vlib_path, 'w', encoding='utf-8') as f:
    f.write(vlib_text)

print("Successfully sanitized videoLibrary.ts object keys with quotes!")
