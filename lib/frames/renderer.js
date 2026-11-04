// Freedom — three.js frame renderer for the room transitions and the PC zoom.
// Draws one image-sequence frame at a time into a <canvas> with WebGL (three.js), scaled to cover
// the canvas exactly like the old 2D drawImage code. One renderer, one plane and one reusable
// texture per canvas; each frame re-uses the same GPU texture (texSubImage2D), so memory stays flat.
// If WebGL is not available, draw() returns null and the caller keeps its 2D drawing.
import {
  WebGLRenderer, Scene, OrthographicCamera, PlaneGeometry, MeshBasicMaterial, Mesh, Texture,
  LinearFilter, NoColorSpace, LinearSRGBColorSpace, ClampToEdgeWrapping, DoubleSide
} from 'three';

// ?gl=0 forces the 2D canvas path (used to compare the two).
let disabled = null;
function glDisabled() {
  if (disabled === null) {
    try {
      disabled = /(^|[?&])gl=0(&|$)/.test(window.location.search) || window.__freedomForce2D === true;
    } catch (e) { disabled = false; }
  }
  return disabled;
}

const slots = new WeakMap();

function makeTexture(img) {
  const t = new Texture(img);
  t.colorSpace = NoColorSpace;          // pass pixels through untouched (output is linear too)
  t.minFilter = LinearFilter;
  t.magFilter = LinearFilter;
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.generateMipmaps = false;
  t.anisotropy = 1;
  t.flipY = false;                      // flipping on upload is slow in browsers; the plane is mirrored instead
  t._w = img.naturalWidth; t._h = img.naturalHeight;
  return t;
}

function getSlot(canvas) {
  let s = slots.get(canvas);
  if (s) return s.ok ? s : null;
  s = { ok: false };
  slots.set(canvas, s);
  if (glDisabled()) return null;
  try {
    const renderer = new WebGLRenderer({
      canvas, alpha: true, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: true, preserveDrawingBuffer: false, powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(1);                    // the 2D version drew at CSS pixels; keep the same cost
    renderer.outputColorSpace = LinearSRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    const scene = new Scene();
    const camera = new OrthographicCamera(0, 1, 1, 0, -1, 1);
    const material = new MeshBasicMaterial({ depthTest: false, depthWrite: false, toneMapped: false, side: DoubleSide });
    const mesh = new Mesh(new PlaneGeometry(1, 1), material);
    scene.add(mesh);
    Object.assign(s, { ok: true, renderer, scene, camera, material, mesh, tex: null, img: null, w: 0, h: 0, lost: false, last: null });
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); s.lost = true; }, false);
    canvas.addEventListener('webglcontextrestored', () => {
      s.lost = false; s.img = null; s.w = 0; s.h = 0;
      if (s.tex) { s.tex.dispose(); s.tex = null; s.material.map = null; s.material.needsUpdate = true; }
      if (s.last) draw(canvas, s.last);
    }, false);
    return s;
  } catch (e) {
    return null;
  }
}

// Copies a frame into the existing texture. Done directly (texSubImage2D) so the browser can use the
// image it has already decoded: three.js always asks for "no colour conversion", which makes Chrome
// decode every AVIF frame a second time. Using the browser default also matches the old 2D drawing.
function upload(s, img) {
  const gl = s.renderer.getContext();
  const props = s.renderer.properties.get(s.tex);
  if (!props.__webglTexture) { s.tex.image = img; s.tex.needsUpdate = true; return; }
  s.renderer.state.activeTexture(gl.TEXTURE0);
  s.renderer.state.bindTexture(gl.TEXTURE_2D, props.__webglTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.BROWSER_DEFAULT_WEBGL);
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
}

// Draws img into canvas, covering it (centre crop). Returns the drawn rect {x, y, width, height}
// in canvas pixels, or null when WebGL is unavailable (caller falls back to 2D).
function draw(canvas, img) {
  if (!canvas || !img || !img.naturalWidth) return null;
  const s = getSlot(canvas);
  if (s && window.__freedomFrameLog) window.__freedomFrameLog.push(img.currentSrc || img.src); // test hook
  if (!s) return null;
  s.last = img;

  const width = canvas.clientWidth || Math.round(window.innerWidth * 1.1);
  const height = canvas.clientHeight || Math.round(window.innerHeight * 1.1);

  const imgRatio = img.naturalWidth / img.naturalHeight;
  let dw, dh, ox, oy;
  if (width / height > imgRatio) { dw = width; dh = width / imgRatio; ox = 0; oy = (height - dh) / 2; }
  else { dw = height * imgRatio; dh = height; ox = (width - dw) / 2; oy = 0; }
  const rect = { x: ox, y: oy, width: dw, height: dh };
  if (s.lost) return rect;

  if (s.w !== width || s.h !== height) {
    s.renderer.setSize(width, height, false);
    s.camera.left = 0; s.camera.right = width; s.camera.top = height; s.camera.bottom = 0;
    s.camera.updateProjectionMatrix();
    s.w = width; s.h = height;
  }
  // y axis points up in the camera; the 2D offsets are measured from the top.
  s.mesh.scale.set(dw, -dh, 1);                 // mirrored: rows are uploaded top-first (flipY off)
  s.mesh.position.set(ox + dw / 2, height - oy - dh / 2, 0);

  if (s.img !== img) {
    if (!s.tex || s.tex._w !== img.naturalWidth || s.tex._h !== img.naturalHeight) {
      if (s.tex) s.tex.dispose();               // a different frame size needs a new GPU texture
      s.tex = makeTexture(img);
      s.material.map = s.tex;
      s.material.needsUpdate = true;
      s.renderer.initTexture(s.tex);            // three.js allocates the GPU texture once
    }
    upload(s, img);                             // every frame: copy pixels into that same texture
    s.img = img;
  }
  s.renderer.render(s.scene, s.camera);
  return rect;
}

export function isWebGL(canvas) {
  const s = slots.get(canvas);
  return !!(s && s.ok);
}

// 2D fallback: the original drawImage cover-fit.
function draw2d(canvas, img) {
  const width = canvas.clientWidth || Math.round(window.innerWidth * 1.1);
  const height = canvas.clientHeight || Math.round(window.innerHeight * 1.1);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  let dw, dh, ox, oy;
  if (width / height > imgRatio) { dw = width; dh = width / imgRatio; ox = 0; oy = (height - dh) / 2; }
  else { dw = height * imgRatio; dh = height; ox = (width - dw) / 2; oy = 0; }
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, ox, oy, dw, dh);
  return { x: ox, y: oy, width: dw, height: dh };
}

// Draws img covering the canvas: three.js when WebGL is available, otherwise 2D.
// Returns the drawn rectangle in canvas pixels, or null when img has no pixels yet.
export function drawCover(canvas, img) {
  if (!canvas || !img || !img.naturalWidth) return null;
  return draw(canvas, img) || draw2d(canvas, img);
}

// three.js only: returns null when WebGL is unavailable so the caller can draw in 2D itself.
export function drawThreeOnly(canvas, img) {
  return draw(canvas, img);
}
