import * as THREE from 'three';

/* ============================================================
   Cat Planet — dot-sphere world with a point-painted cat face.
   Face stays front (gentle rock, no full spin); eye sprites
   blink and follow the cursor. Amber/ice duotone.
   ============================================================ */

const AMBER = '#F5A524';
const AMBER_SOFT = '#FBD38D';
const CREAM = '#FFF3D6';
const ICE = '#8aa0b8';

function dotTexture() {
  const s = 64;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(0.4, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function initGlobe(container, opts = {}) {
  const reduced = !!opts.reduced;
  const MOBILE = window.matchMedia('(max-width: 767px)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (e) {
    console.warn('WebGL unavailable — cat planet disabled.', e);
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MOBILE ? 1.5 : 1.75));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100,
  );
  camera.position.set(0, 0.6, 5.2);
  camera.lookAt(0, 0, 0);

  const R = 1.7;
  const rig = new THREE.Group();
  rig.rotation.z = 0.12;
  scene.add(rig);
  const disposables = [];

  function addPoints(positions, colors, size, opacity) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    const m = new THREE.PointsMaterial({
      size,
      map: dotTexture(),
      vertexColors: true,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const p = new THREE.Points(g, m);
    rig.add(p);
    disposables.push(g, m);
    return p;
  }

  /* --- base planet shell (dimmer now — face is the star) --- */
  {
    const N = MOBILE ? 350 : 650;
    const pos = [];
    const col = [];
    const cA = new THREE.Color(AMBER);
    const cS = new THREE.Color(AMBER_SOFT);
    const cI = new THREE.Color(ICE);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      pos.push(Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R);
      const pick = Math.random();
      const c = pick < 0.6 ? cA : pick < 0.85 ? cS : cI;
      col.push(c.r, c.g, c.b);
    }
    addPoints(pos, col, 0.032, 0.55);
  }

  /* --- painted face on the +Z hemisphere (toward camera) --- */
  const onSphere = (x, y) => {
    const zz = Math.sqrt(Math.max(0.05, R * R - x * x - y * y));
    return [x, y, zz];
  };
  {
    const pos = [];
    const col = [];
    const cFace = new THREE.Color(CREAM);
    const cI = new THREE.Color(ICE);
    const cA = new THREE.Color(AMBER);
    const push = (x, y, c, jitter = 0.02) => {
      const jx = x + (Math.random() - 0.5) * jitter;
      const jy = y + (Math.random() - 0.5) * jitter;
      const p = onSphere(jx, jy);
      pos.push(p[0], p[1], p[2]);
      col.push(c.r, c.g, c.b);
    };
    // ears: triangle outlines
    const ear = (sx) => {
      const corners = [[sx * 0.62, 1.28], [sx * 1.18, 1.12], [sx * 0.98, 1.62]];
      for (let e = 0; e < 3; e++) {
        const [x1, y1] = corners[e];
        const [x2, y2] = corners[(e + 1) % 3];
        for (let k = 0; k <= 10; k++) {
          push(x1 + ((x2 - x1) * k) / 10, y1 + ((y2 - y1) * k) / 10, cA, 0.015);
        }
      }
    };
    ear(1);
    ear(-1);
    // nose: tiny triangle cluster
    for (let k = 0; k < 12; k++) push((Math.random() - 0.5) * 0.12, 0.02 + Math.random() * 0.08, cFace, 0.01);
    // mouth: w-shape
    for (let k = 0; k <= 14; k++) {
      const t = k / 14;
      push(-0.22 + t * 0.22, -0.12 - Math.sin(t * Math.PI) * 0.09, cFace, 0.012);
      push(0.0 + t * 0.22, -0.12 - Math.sin(t * Math.PI) * 0.09, cFace, 0.012);
    }
    // whiskers: ice arcs
    for (const s of [-1, 1]) {
      for (let r = 0; r < 3; r++) {
        for (let k = 0; k <= 8; k++) {
          const t = k / 8;
          push(s * (0.55 + t * 0.55), 0.12 - r * 0.14 + t * t * 0.1 * (r - 1), cI, 0.012);
        }
      }
    }
    addPoints(pos, col, 0.045, 0.8);
  }

  /* --- eye sprites: blink + follow cursor --- */
  const eyeTex = dotTexture();
  disposables.push(eyeTex);
  const eyeMat = new THREE.SpriteMaterial({
    map: eyeTex,
    color: CREAM,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  disposables.push(eyeMat);
  const eyes = [];
  for (const s of [-1, 1]) {
    const sp = new THREE.Sprite(eyeMat);
    const base = { x: s * 0.5, y: 0.48, z: 1.58 };
    sp.position.set(base.x, base.y, base.z);
    sp.scale.set(0.34, 0.42, 1);
    sp.userData.base = base;
    rig.add(sp);
    eyes.push(sp);
  }

  const target = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    target.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    target.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);

  /* blink loop (timeouts only — no extra rAF) */
  let blinkTimer = 0;
  function scheduleBlink() {
    clearTimeout(blinkTimer);
    blinkTimer = setTimeout(() => {
      eyes.forEach((sp, i) => {
        setTimeout(() => {
          sp.scale.y = 0.05;
          setTimeout(() => sp.scale.set(0.34, 0.42, 1), 130);
        }, i * 60);
      });
      scheduleBlink();
    }, 3200 + Math.random() * 3600);
  }

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    target.x += (target.tx - target.x) * 0.04;
    target.y += (target.ty - target.y) * 0.04;
    /* gentle rock (face stays front) + cursor lean */
    rig.rotation.y = Math.sin(t * 0.24) * 0.14 + target.x * 0.22;
    rig.rotation.x = Math.sin(t * 0.2) * 0.04 + target.y * 0.12;
    eyes.forEach((sp) => {
      const b = sp.userData.base;
      sp.position.x = b.x + target.x * 0.07;
      sp.position.y = b.y + target.y * 0.05;
    });
    renderer.render(scene, camera);
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    clock.getDelta();
    scheduleBlink();
    tick();
  };
  const stop = () => {
    running = false;
    clearTimeout(blinkTimer);
    cancelAnimationFrame(raf);
  };
  const onVis = () => {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener('visibilitychange', onVis);

  if (reduced) {
    renderer.render(scene, camera);
  } else {
    start();
  }

  return {
    setVisible(v) {
      if (v) start();
      else stop();
    },
    dispose() {
      stop();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}