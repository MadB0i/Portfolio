import * as THREE from 'three';

/* ============================================================
   Contact dot-globe — fibonacci point sphere, amber/ice duotone
   ============================================================ */

const AMBER = '#F5A524';
const AMBER_SOFT = '#FBD38D';
const ICE = '#8aa0b8';

export function initGlobe(container, opts = {}) {
  const reduced = !!opts.reduced;
  const MOBILE = window.matchMedia('(max-width: 767px)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch (e) {
    console.warn('WebGL unavailable — globe disabled.', e);
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

  /* fibonacci sphere */
  const N = MOBILE ? 450 : 850;
  const R = 1.7;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const cAmber = new THREE.Color(AMBER);
  const cSoft = new THREE.Color(AMBER_SOFT);
  const cIce = new THREE.Color(ICE);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    pos[i * 3] = Math.cos(th) * rad * R;
    pos[i * 3 + 1] = y * R;
    pos[i * 3 + 2] = Math.sin(th) * rad * R;
    const pick = Math.random();
    const c = pick < 0.55 ? cAmber : pick < 0.8 ? cSoft : cIce;
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const globe = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );

  /* faint wireframe shell */
  const shell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(R * 1.02, 2),
    new THREE.MeshBasicMaterial({
      color: AMBER,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    }),
  );

  const rig = new THREE.Group();
  rig.add(globe, shell);
  rig.rotation.z = 0.22;
  scene.add(rig);

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

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    target.x += (target.tx - target.x) * 0.04;
    target.y += (target.ty - target.y) * 0.04;
    rig.rotation.y = t * 0.12 + target.x * 0.35;
    rig.rotation.x = target.y * 0.2 + Math.sin(t * 0.3) * 0.04;
    renderer.render(scene, camera);
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    clock.getDelta();
    tick();
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const onVis = () => {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener('visibilitychange', onVis);

  if (reduced) {
    rig.rotation.y = 0.6;
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
      geo.dispose();
      globe.material.dispose();
      shell.geometry.dispose();
      shell.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}