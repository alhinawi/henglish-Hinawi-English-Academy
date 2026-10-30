import base64

with open('logo_assets/logo-128.png', 'rb') as f:
    b64_128 = base64.b64encode(f.read()).decode('utf-8')

with open('src/assets/logoBase64.ts', 'w', encoding='utf-8') as out:
    out.write('// Embedded fallback base64 eagle logo for 100% reliable rendering\n')
    out.write(f'export const LOGO_BASE64 = "data:image/png;base64,{b64_128}";\n')

print('Generated src/assets/logoBase64.ts successfully!')
