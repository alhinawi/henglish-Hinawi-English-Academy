from PIL import Image
import os

img = Image.open('hinawi-logo.png').convert('RGBA')
width, height = img.size
print(f"Loaded logo: {width}x{height}")

# Clean faint alpha noise
datas = img.getdata()
new_data = []
for item in datas:
    # If alpha is very low or if it's near black with low alpha
    if item[3] < 12:
        new_data.append((0, 0, 0, 0))
    elif item[0] < 8 and item[1] < 8 and item[2] < 8 and item[3] < 50:
        new_data.append((0, 0, 0, 0))
    else:
        new_data.append(item)

img.putdata(new_data)

# Let's find bounding box of non-transparent pixels
bbox = img.getbbox()
print(f"Non-transparent bounding box: {bbox}")

# Crop to content with a nice padding
pad = 40
crop_box = (
    max(0, bbox[0] - pad),
    max(0, bbox[1] - pad),
    min(width, bbox[2] + pad),
    min(height, bbox[3] + pad)
)
cropped = img.crop(crop_box)

# Make it square
max_dim = max(cropped.width, cropped.height)
square_img = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
offset = ((max_dim - cropped.width) // 2, (max_dim - cropped.height) // 2)
square_img.paste(cropped, offset)

# Save high-res master
square_img.save('hinawi-logo-clean.png', 'PNG')

# Generate optimized resolutions
sizes = [512, 256, 128, 64, 32]
os.makedirs('logo_assets', exist_ok=True)
for s in sizes:
    resized = square_img.resize((s, s), Image.Resampling.LANCZOS)
    resized.save(f'logo_assets/logo-{s}.png', 'PNG')

print("Generated clean logo and resized assets in logo_assets/ successfully!")
