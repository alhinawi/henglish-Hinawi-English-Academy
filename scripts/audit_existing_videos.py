# -*- coding: utf-8 -*-
"""
Henglish Academy - Movie Scenes Video Audit Script
Checks every video in MOVIE_SCENES_CATALOG using YouTube oEmbed & HTTP verification
"""

import sys
import re
import json
import urllib.request
import urllib.error

sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/movieScenesData.ts', 'r', encoding='utf-8') as f:
    code = f.read()

# Pattern to capture scene objects
pattern = re.compile(
    r"id:\s*['\"](?P<id>[^'\"]+)['\"].*?"
    r"movieTitle:\s*['\"](?P<movie>[^'\"]+)['\"].*?"
    r"sceneTitle:\s*['\"](?P<scene>[^'\"]+)['\"].*?"
    r"youtubeId:\s*['\"](?P<ytid>[^'\"]+)['\"].*?"
    r"startTime:\s*(?P<start>\d+).*?"
    r"endTime:\s*(?P<end>\d+)",
    re.DOTALL
)

scenes = [m.groupdict() for m in pattern.finditer(code)]
print(f"Total scenes found in catalog: {len(scenes)}")

results = []

for sc in scenes:
    ytid = sc['ytid']
    oembed_url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={ytid}&format=json"
    thumb_url = f"https://img.youtube.com/vi/{ytid}/hqdefault.jpg"
    
    status = "UNKNOWN"
    title = ""
    author = ""
    is_embeddable = False
    details = ""

    # 1. Test oEmbed
    req = urllib.request.Request(oembed_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req, timeout=8) as res:
            if res.status == 200:
                data = json.loads(res.read().decode('utf-8'))
                title = data.get('title', '')
                author = data.get('author_name', '')
                status = "VERIFIED_PLAYABLE"
                is_embeddable = True
    except urllib.error.HTTPError as e:
        if e.code == 404:
            status = "NOT_FOUND_OR_DELETED"
            details = f"HTTP 404 - Video not found or deleted on YouTube"
        elif e.code in (401, 403):
            status = "EMBED_RESTRICTED_OR_PRIVATE"
            details = f"HTTP {e.code} - Embedding disabled by owner or video is private/geo-blocked"
        else:
            status = f"HTTP_ERROR_{e.code}"
    except Exception as e:
        status = f"ERROR_{type(e).__name__}"
        details = str(e)

    # 2. Test Thumbnail
    thumb_status = False
    try:
        t_req = urllib.request.Request(thumb_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(t_req, timeout=5) as t_res:
            thumb_status = t_res.status == 200
    except Exception:
        thumb_status = False

    res_item = {
        'id': sc['id'],
        'movie': sc['movie'],
        'scene': sc['scene'],
        'ytid': ytid,
        'start': sc['start'],
        'end': sc['end'],
        'status': status,
        'title': title,
        'author': author,
        'embeddable': is_embeddable,
        'thumbOk': thumb_status,
        'details': details
    }
    results.append(res_item)
    print(f"\n[{sc['id']}] {sc['movie']} - {sc['scene']}")
    print(f"  YouTube ID: {ytid}")
    print(f"  Status:     {status}")
    print(f"  Title:      {title}")
    print(f"  Channel:    {author}")
    print(f"  Thumb OK:   {thumb_status}")
    if details:
        print(f"  Details:    {details}")

with open('public/data/video-audit-report.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

print("\nAudit saved to public/data/video-audit-report.json")
