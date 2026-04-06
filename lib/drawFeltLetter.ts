// Perlin noise + fBm felt-texture letter renderer
// Permutation table is seeded once per page load for consistent but unique textures

const perm = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  // Fisher-Yates shuffle
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : -x;
  const v = h === 0 || h === 3 ? y : -y;
  return u + v;
}

function perlin(x: number, y: number): number {
  const xi = x | 0;
  const yi = y | 0;
  const xf = x - xi;
  const yf = y - yi;
  const X = xi & 255;
  const Y = yi & 255;

  const u = fade(xf);
  const v = fade(yf);

  const aa = perm[perm[X] + Y];
  const ab = perm[perm[X] + Y + 1];
  const ba = perm[perm[X + 1] + Y];
  const bb = perm[perm[X + 1] + Y + 1];

  return lerp(
    lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
    lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
    v
  );
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    value += amp * perlin(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2;
  }
  return value;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/** Load a Google Font and resolve once it's ready for canvas use */
export function loadGoogleFont(fontFamily: string): Promise<void> {
  const id = `font-${fontFamily.replace(/ /g, "+")}`;
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, "+")}&display=swap`;
    document.head.appendChild(link);
  }
  // Use FontFaceSet API to wait until the font is actually loaded
  if (document.fonts?.load) {
    return document.fonts.load(`bold 48px "${fontFamily}"`).then(() => {});
  }
  // Fallback: short delay for older browsers
  return new Promise((r) => setTimeout(r, 200));
}

export function drawFeltLetter(
  canvas: HTMLCanvasElement,
  letter: string,
  color: string,
  font?: string
): void {
  const w = canvas.width;
  const h = canvas.height;
  if (w === 0 || h === 0) return;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  ctx.clearRect(0, 0, w, h);

  // --- Step 1: Draw letter to offscreen canvas as alpha mask ---
  const maskCanvas = document.createElement("canvas");
  maskCanvas.width = w;
  maskCanvas.height = h;
  const maskCtx = maskCanvas.getContext("2d")!;

  const fontSize = h * 0.62;
  const fontFace = font ? `"${font}", Georgia, serif` : `Georgia, "Times New Roman", serif`;
  maskCtx.font = `bold ${fontSize}px ${fontFace}`;
  maskCtx.textAlign = "center";
  maskCtx.textBaseline = "middle";
  maskCtx.fillStyle = "#000";
  maskCtx.fillText(letter, w / 2, h / 2);

  const maskData = maskCtx.getImageData(0, 0, w, h);
  const maskPixels = maskData.data;

  // --- Step 2: Build output with felt texture ---
  const out = ctx.createImageData(w, h);
  const outPixels = out.data;
  const [r, g, b] = hexToRgb(color);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const maskAlpha = maskPixels[i + 3];
      if (maskAlpha === 0) continue;

      // Isotropic noise
      const n1 = fbm(x * 0.024, y * 0.024, 5);
      // Directional (vertical fiber) noise
      const n2 = fbm(x * 0.012, y * 0.048, 5);
      // Blend 60/40
      const combined = n1 * 0.6 + n2 * 0.4;

      const brightness = 0.75 + combined * 0.55;

      // Edge noise displacement for soft fabric boundary
      const edgeNoise = fbm(x * 0.05, y * 0.05, 3);
      const alpha = Math.min(255, Math.max(0, maskAlpha + (edgeNoise * 40 - 20)));

      outPixels[i] = Math.min(255, Math.max(0, (r * brightness) | 0));
      outPixels[i + 1] = Math.min(255, Math.max(0, (g * brightness) | 0));
      outPixels[i + 2] = Math.min(255, Math.max(0, (b * brightness) | 0));
      outPixels[i + 3] = alpha;
    }
  }

  ctx.putImageData(out, 0, 0);
}
