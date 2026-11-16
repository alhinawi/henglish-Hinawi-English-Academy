// Premium preset avatars: inline SVG artwork in the site's cover palette,
// rasterized to small webp data URLs on demand (the API stores a data URL).
// No binary assets, no network.

const PALETTES: [string, string, string][] = [
  ['#26382e', '#3f5a45', '#d8c8a6'], // deep green / gold
  ['#713c46', '#8f5560', '#e8dcc2'], // burgundy / cream
  ['#274a5c', '#3a6a80', '#d8c8a6'], // petrol / gold
  ['#4a3a5c', '#63517a', '#e8dcc2'], // plum / cream
  ['#5c4a27', '#7a653a', '#f0e6cc'], // bronze / sand
  ['#37474f', '#546e7a', '#d8c8a6'], // slate / gold
];

// Simple elegant glyphs: open book, graduation cap, owl, globe, star, pyramid.
const GLYPHS: string[] = [
  '<path d="M64 44c-8-5-18-7-28-6v52c10-1 20 1 28 6 8-5 18-7 28-6V38c-10-1-20 1-28 6zm0 52V44" fill="none" stroke="{c}" stroke-width="5" stroke-linejoin="round"/>',
  '<path d="M64 40 28 56l36 16 36-16-36-16z" fill="{c}"/><path d="M44 64v16c0 6 40 6 40 0V64l-20 9-20-9z" fill="{c}"/><path d="M100 56v24" stroke="{c}" stroke-width="4" stroke-linecap="round"/>',
  '<circle cx="64" cy="66" r="30" fill="none" stroke="{c}" stroke-width="5"/><circle cx="53" cy="60" r="7" fill="{c}"/><circle cx="75" cy="60" r="7" fill="{c}"/><path d="M64 68l-5 8h10l-5-8z" fill="{c}"/><path d="M40 40l8 8M88 40l-8 8" stroke="{c}" stroke-width="5" stroke-linecap="round"/>',
  '<circle cx="64" cy="64" r="30" fill="none" stroke="{c}" stroke-width="5"/><ellipse cx="64" cy="64" rx="14" ry="30" fill="none" stroke="{c}" stroke-width="4"/><path d="M34 64h60M40 46h48M40 82h48" stroke="{c}" stroke-width="4"/>',
  '<path d="M64 34l9 20 22 3-16 15 4 22-19-11-19 11 4-22-16-15 22-3 9-20z" fill="{c}"/>',
  '<path d="M64 34 30 92h68L64 34z" fill="none" stroke="{c}" stroke-width="5" stroke-linejoin="round"/><path d="M64 34v58M47 63h34" stroke="{c}" stroke-width="4"/>',
];

export const PRESET_COUNT = PALETTES.length;

export function presetSvg(index: number): string {
  const [dark, mid, accent] = PALETTES[index % PALETTES.length];
  const glyph = GLYPHS[index % GLYPHS.length].replaceAll('{c}', accent);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><rect width="128" height="128" fill="url(#g)"/>${glyph}</svg>`;
}

/** Rasterize an SVG string to a webp data URL via an offscreen canvas. */
export function svgToDataUrl(svg: string, size = 128): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      canvas.getContext('2d')!.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/webp', 0.9));
    };
    img.onerror = () => reject(new Error('preset render failed'));
    img.src = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  });
}

export const presetDataUrl = (index: number) => svgToDataUrl(presetSvg(index));
