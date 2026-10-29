import zlib
import struct

with open('hinawi-logo.png', 'rb') as f:
    data = f.read()

# Decompress IDAT chunks to inspect alpha channel
pos = 8
idat_data = b''
while pos < len(data):
    length, chunk_type = struct.unpack('>I4s', data[pos:pos+8])
    if chunk_type == b'IDAT':
        idat_data += data[pos+8:pos+8+length]
    pos += 8 + length + 4

raw = zlib.decompress(idat_data)
# First scanline: filter byte (1 byte) + 2048 * 4 bytes
# Check corner pixels
stride = 1 + 2048 * 4
first_pixel = raw[1:5]
print("First pixel (0,0) [R,G,B,A]:", list(first_pixel))

# Sample a few positions around corners and center
print("Scanline 0 filter:", raw[0])
# Let's count how many pixels have alpha == 0
zero_alpha_count = 0
total_samples = 0
for y in range(0, 2048, 64):
    row_offset = y * stride + 1
    for x in range(0, 2048, 64):
        p = raw[row_offset + x*4 : row_offset + x*4 + 4]
        total_samples += 1
        if p[3] == 0:
            zero_alpha_count += 1

print(f"Sampled {total_samples} grid points: {zero_alpha_count} have alpha == 0 ({zero_alpha_count/total_samples*100:.1f}%)")
