import re
import os

with open('Future Perfect.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Strip base64 data to get clean text for inspection
clean_text = re.sub(r'data:image/[^;]+;base64,[^"]+', '[BASE64_IMAGE]', text)
with open('clean_future_perfect.html', 'w', encoding='utf-8') as f:
    f.write(clean_text)

headings = re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', clean_text, re.DOTALL)
sections = re.findall(r'<section[^>]*id="([^"]+)"', clean_text)

with open('summary.txt', 'w', encoding='utf-8') as out:
    out.write(f"Sections found: {sections}\n\nHeadings found:\n")
    for h in headings:
        cleaned = re.sub(r'<[^>]+>', '', h).strip()
        if cleaned:
            out.write(f" - {cleaned}\n")

print("Wrote summary.txt and clean_future_perfect.html successfully.")
