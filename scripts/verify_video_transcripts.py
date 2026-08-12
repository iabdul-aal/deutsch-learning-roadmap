#!/usr/bin/env python3
"""
YouTube Video Transcript Extractor & Audit Tool for Deutsch Survival Platform.
Scans video IDs, extracts timed captions, and checks keyword alignment.
"""

import sys
import re
import json
from pathlib import Path

# Ensure UTF-8 output encoding for Windows PowerShell
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

# Project Paths
REPO_ROOT = Path(__file__).resolve().parent.parent
VIDEO_LIB_PATH = REPO_ROOT / "src" / "data" / "videoLibrary.ts"
CONTENT_RANK_PATH = REPO_ROOT / "src" / "data" / "contentRanking.ts"

def extract_video_ids():
    """Extract all YouTube video IDs from codebase TS files."""
    video_ids = set()
    for file_path in [VIDEO_LIB_PATH, CONTENT_RANK_PATH]:
        if file_path.exists():
            text = file_path.read_text(encoding="utf-8")
            matches = re.findall(r"videoId:\s*['\"]([a-zA-Z0-9_-]{11})['\"]", text)
            matches += re.findall(r"resourceId:\s*['\"]([a-zA-Z0-9_-]{11})['\"]", text)
            video_ids.update(matches)
    return sorted(list(video_ids))

def audit_transcripts():
    """Fetch transcripts and analyze availability & content."""
    vids = extract_video_ids()
    print(f"[SEARCH] Found {len(vids)} unique YouTube video IDs in codebase: {vids}\n")
    
    api = YouTubeTranscriptApi()
    report = []

    for vid in vids:
        entry = {"videoId": vid, "transcriptAvailable": False, "snippetCount": 0, "sample": "", "error": None}
        try:
            transcript = api.fetch(vid)
            entry["transcriptAvailable"] = True
            entry["snippetCount"] = len(transcript)
            if transcript:
                sample_text = " ".join([t.text.replace("\n", " ") for t in transcript[:5]])
                entry["sample"] = sample_text[:150]
            print(f"[OK] [{vid}] Transcript OK — {len(transcript)} snippets. Sample: '{entry['sample']}...'")
        except TranscriptsDisabled:
            entry["error"] = "Subtitles disabled on video"
            print(f"[WARN] [{vid}] Subtitles DISABLED by uploader")
        except NoTranscriptFound:
            entry["error"] = "No transcript found for requested languages"
            print(f"[WARN] [{vid}] No transcript found")
        except Exception as e:
            entry["error"] = str(e)
            print(f"[ERROR] [{vid}] Error: {e}")
        
        report.append(entry)

    # Output JSON summary
    out_file = REPO_ROOT / "artifacts" / "transcript_audit_report.json"
    out_file.parent.mkdir(parents=True, exist_ok=True)
    out_file.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"\n[COMPLETE] Audit finished. Report saved to: {out_file}")

if __name__ == "__main__":
    audit_transcripts()
