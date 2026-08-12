import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'e:\German\artifacts\yt_check_fast_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

valid = data['valid']
print(f"Total valid verified videos: {len(valid)}")

for v_id, title in valid.items():
    print(f"  {v_id} -> {title}")
