import json

with open(r'e:\German\artifacts\yt_check_fast_results.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"BROKEN IDS COUNT: {data['broken_count']}")
print(f"VALID IDS COUNT: {data['valid_count']}")

print('\n--- ALL BROKEN VIDEO IDS ---')
for b_id, b_info in data['broken'].items():
    print(f"\nID: {b_id} | Error: {b_info['error']}")
    for loc in b_info['locations']:
        print(f"   -> {loc[0]}:{loc[1]} {loc[2]}")

print('\n--- SAMPLE VALID VIDEO IDS ---')
for v_id, title in list(data['valid'].items())[:30]:
    print(f"ID: {v_id} | Title: {title}")
