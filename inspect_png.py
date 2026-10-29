import struct
import zlib

with open('hinawi-logo.png', 'rb') as f:
    data = f.read()

print('PNG signature valid:', data[:8] == b'\x89PNG\r\n\x1a\n')

# Parse IHDR
width, height, bit_depth, color_type, compression, filter_method, interlace = struct.unpack('>IIBBBBB', data[16:29])
print(f"Width: {width}, Height: {height}, Bit depth: {bit_depth}, Color type: {color_type}")
# Color type: 0=grayscale, 2=RGB, 3=Indexed, 4=Grayscale+alpha, 6=RGBA
color_types = {0: 'Grayscale', 2: 'RGB', 3: 'Indexed', 4: 'Grayscale+Alpha', 6: 'RGBA'}
print(f"Color mode: {color_types.get(color_type, 'Unknown')}")
