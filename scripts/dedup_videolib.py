import re

path = r'e:\German\src\data\videoLibrary.ts'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

seen_keys = set()
new_lines = []

key_regex = re.compile(r"^\s*['\"]([^'\"]+)['\"]:\s*\{")

for line in lines:
    m = key_regex.search(line)
    if m:
        key = m.group(1)
        if key in seen_keys:
            print(f"Removing duplicate key in videoLibrary.ts: {key}")
            continue
        seen_keys.add(key)
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Deduplication complete!")
