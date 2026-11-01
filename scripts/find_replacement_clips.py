# -*- coding: utf-8 -*-
"""
Henglish Academy - Replacement Movie Clip Finder
Searches YouTube public oEmbed and test endpoints to find exact verified scenes
"""

import urllib.request
import urllib.parse
import json
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

# Let's search YouTube HTML or candidate lists for official clips
queries = {
    'godfather': 'The Godfather An offer he cant refuse movieclip',
    'forrest_gump': 'Forrest Gump life is like a box of chocolates clip',
    'batman': 'Batman Begins its not who I am underneath clip',
    'terminator': 'The Terminator Ill be back movie clip police station',
    'jerry_maguire': 'Jerry Maguire you had me at hello clip'
}

def verify_ytid(ytid: str):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={ytid}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as res:
            if res.status == 200:
                data = json.loads(res.read().decode('utf-8'))
                return {
                    'ok': True,
                    'title': data.get('title'),
                    'author': data.get('author_name'),
                    'thumbnail': data.get('thumbnail_url')
                }
    except Exception as e:
        return {'ok': False, 'error': str(e)}

def search_youtube_html(query: str):
    search_url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(query)}"
    req = urllib.request.Request(search_url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
    })
    found_ids = []
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            html = res.read().decode('utf-8', errors='ignore')
            # Extract videoIds
            matches = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', html)
            for m in matches:
                if m not in found_ids:
                    found_ids.append(m)
    except Exception as e:
        print(f"Error scraping search: {e}")
    return found_ids

for key, q in queries.items():
    print(f"\n==========================================")
    print(f"Searching for: {q}")
    ids = search_youtube_html(q)
    print(f"Found {len(ids)} potential video IDs.")
    
    verified_candidates = []
    for ytid in ids[:8]:
        info = verify_ytid(ytid)
        if info['ok']:
            print(f"  [VERIFIED PLAYABLE] {ytid}")
            print(f"     Title:   {info['title']}")
            print(f"     Channel: {info['author']}")
            verified_candidates.append({'ytid': ytid, **info})
        else:
            print(f"  [UNAVAILABLE] {ytid}: {info.get('error')}")

    if verified_candidates:
        print(f"--> BEST CANDIDATE for {key}: {verified_candidates[0]['ytid']} ({verified_candidates[0]['title']})")
