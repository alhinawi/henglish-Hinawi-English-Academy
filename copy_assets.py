import shutil
import os

os.makedirs('public/logo_assets', exist_ok=True)
shutil.copy('hinawi-logo-clean.png', 'public/logo-clean.png')
for f in os.listdir('logo_assets'):
    shutil.copy(os.path.join('logo_assets', f), os.path.join('public/logo_assets', f))
print('Copied logo assets to public/ successfully!')
