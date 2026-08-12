import re
import os

files = [
    r'C:\Users\adham\.gemini\antigravity\brain\78310bce-17c4-4d37-82d2-22a8bc80d88c\.system_generated\steps\867\content.md',
    r'C:\Users\adham\.gemini\antigravity\brain\78310bce-17c4-4d37-82d2-22a8bc80d88c\.system_generated\steps\871\content.md'
]

for fpath in files:
    if not os.path.exists(fpath):
        print(f"File not found: {fpath}")
        continue

    print(f"\n==========================================")
    print(f"PARSING: {os.path.basename(fpath)}")
    print(f"==========================================")

    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        html = f.read()

    # YouTube links & video IDs
    yt_links = set(re.findall(r'https?://(?:www\.)?youtube\.com/[^\s"\'<>]+|https?://youtu\.be/[^\s"\'<>]+', html))
    print(f"\n[FOUND {len(yt_links)} YOUTUBE LINKS]:")
    for l in sorted(yt_links):
        print("  -", l)

    # Drive / PDF / Attachment links
    attachments = set(re.findall(r'href=["\'](https?://(?:drive\.google\.com|docs\.google\.com|mediafire|dropbox|pieceofgerman\.com/[^\s"\'<>]*\.(?:pdf|zip|mp3|docx?)))["\']', html, re.I))
    print(f"\n[FOUND {len(attachments)} ATTACHMENT/DRIVE LINKS]:")
    for l in sorted(attachments):
        print("  -", l)

    # All external links
    all_hrefs = set(re.findall(r'href=["\'](https?://[^\s"\'<>]+)["\']', html))
    clean_hrefs = [h for h in all_hrefs if not any(x in h for x in ['zoho', 'w3.org', 'pagesense', 'google.com/analytics', 'facebook.com', 'twitter.com'])]
    print(f"\n[FOUND {len(clean_hrefs)} OTHER RESOURCE LINKS]:")
    for l in sorted(clean_hrefs):
        print("  -", l)
