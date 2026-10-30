import urllib.request

try:
    with urllib.request.urlopen('http://localhost:5173/') as resp:
        content = resp.read().decode('utf-8')
        print(f"Server Status: {resp.status}")
        print(f"Content length: {len(content)} bytes")
        print("Has title:", "Henglish" in content)
        print("Has root:", 'id="root"' in content)
except Exception as e:
    print(f"Root request failed: {e}")

try:
    with urllib.request.urlopen('http://localhost:5173/logo-clean.png') as resp:
        logo_data = resp.read()
        print(f"Logo Status: {resp.status}, Size: {len(logo_data)} bytes")
except Exception as e:
    print(f"Logo request failed: {e}")

try:
    with urllib.request.urlopen('http://localhost:5173/src/main.tsx') as resp:
        print(f"Vite main.tsx Status: {resp.status}")
except Exception as e:
    print(f"Vite main.tsx failed: {e}")
