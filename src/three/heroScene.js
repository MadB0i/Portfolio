import * as THREE from 'three';

/* ============================================================
   Hero 3D scene — particle field + holographic wireframe core
   + receding neon grid floor. Camera-mouse parallax rig.
   ============================================================ */

const SIG = '#F5A524';
const SIG_SOFT = '#FBD38D';
const EMBER = '#DD6B20';
const ICE = '#8aa0b8';
const WHITE = '#dde6f0';

function softSprite(color, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.35, `${color}88`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeParticles(count, radius, spreadY, size, color, opacity) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius[0] + Math.random() * (radius[1] - radius[0]);
    const a = Math.random() * Math.PI * 2;
    const y = (Math.random() - 0.5) * spreadY;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size,
    map: softSprite(color),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

function makeGridFloor() {
  const geo = new THREE.PlaneGeometry(44, 44, 1, 1);
  geo.rotateX(-Math.PI / 2);

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(SIG) },
    },
    vertexShader: `
      varying vec3 vWorld;
      varying float vDepth;
      void main() {
        vWorld = position;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform vec3 uColor;
      varying vec3 vWorld;
      varying float vDepth;

      const float UNIT = 1.0;
      const float THICK = 0.05;

      void main() {
        float z = vWorld.z + uTime * 1.6;
        vec2 p = vec2(vWorld.x, z);

        vec2 g = abs(fract(p / UNIT) - 0.5);
        vec2 cells = smoothstep(0.5, 0.5 - THICK, g);
        float grid = max(cells.x, cells.y);

        vec2 gM = abs(fract(p / (UNIT * 5.0)) - 0.5);
        vec2 cellsM = smoothstep(0.5, 0.5 - THICK * 1.7, gM);
        float major = max(cellsM.x, cellsM.y);

        float line = max(grid * 0.42, major);

        float distFade = smoothstep(16.0, 3.5, vDepth);
        float pulse = 0.75 + 0.25 * sin(vWorld.x * 1.4 - uTime * 0.7);

        vec3 col = uColor * line * pulse;
        float alpha = line * distFade;

        gl_FragColor = vec4(col, alpha);
      }
    `,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = -1.55;
  return mesh;
}

export function initHeroScene(container, opts = {}) {
  const reduced = !!opts.reduced;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    console.warn('WebGL unavailable — 3D hero disabled.', e);
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    58,
    container.clientWidth / Math.max(container.clientHeight, 1),
    0.1,
    100,
  );
  camera.position.set(0, 2.1, 6.6);
  camera.lookAt(0, 0.45, 0);

  const rig = new THREE.Group();
  scene.add(rig);

  /* --- points: fine white dust --- */
  const dust = makeParticles(1100, [3.4, 12], 9, 0.05, WHITE, 0.65);
  rig.add(dust);

  /* --- points: sparse neon accents --- */
  const sparks = makeParticles(260, [3.2, 11], 8, 0.09, SIG_SOFT, 0.85);
  const embers = makeParticles(120, [3.4, 9], 7, 0.13, EMBER, 0.7);
  rig.add(sparks);
  rig.add(embers);

  /* --- holographic core --- */
  const coreOuter = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.28, 1),
    new THREE.MeshBasicMaterial({
      color: SIG,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    }),
  );
  const coreInner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.62, 1),
    new THREE.MeshBasicMaterial({
      color: ICE,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    }),
  );
  const coreGlowMid = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: softSprite(SIG),
      color: SIG,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  coreGlowMid.scale.setScalar(4.2);

  const coreRig = new THREE.Group();
  coreRig.position.set(0, 0.45, -0.4);
  coreRig.add(coreOuter, coreInner, coreGlowMid);
  rig.add(coreRig);

  /* --- neon grid floor --- */
  const floor = makeGridFloor();
  rig.add(floor);

  /* --- mouse parallax --- */
  const target = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    target.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    target.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  /* --- resize --- */
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
  let scrollP = 0; // 0..1 dive driven by page scroll

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();

    target.x += (target.tx - target.x) * 0.045;
    target.y += (target.ty - target.y) * 0.045;

    rig.rotation.y = target.x * 0.16;
    rig.rotation.x = -target.y * 0.07;
    rig.position.y = Math.sin(t * 0.45) * 0.09;

    dust.rotation.y = t * 0.012;
    sparks.rotation.y = -t * 0.02;
    embers.rotation.y = t * 0.026;

    coreOuter.rotation.x = t * 0.16;
    coreOuter.rotation.y = t * 0.22;
    coreInner.rotation.x = -t * 0.34;
    coreInner.rotation.y = t * 0.4;
    const coreScale = (1 + Math.sin(t * 1.4) * 0.05) * (1 + scrollP * 0.35);
    coreRig.scale.setScalar(coreScale);

    /* scroll dive: camera pushes into the field */
    camera.position.z = 6.6 - scrollP * 2.1;
    camera.position.y = 2.1 - scrollP * 0.5;

    floor.material.uniforms.uTime.value = t;

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

  /* pause offscreen */
  const onVis = () => {
    if (document.hidden) stop();
    else start();
  };
  document.addEventListener('visibilitychange', onVis);

  if (reduced) {
    /* single static hologram frame */
    const t = 0.8;
    rig.rotation.y = 0.25;
    coreOuter.rotation.x = t * 0.16;
    coreOuter.rotation.y = t * 0.22;
    coreInner.rotation.x = -t * 0.34;
    coreInner.rotation.y = t * 0.4;
    floor.material.uniforms.uTime.value = t;
    renderer.render(scene, camera);
  } else {
    start();
  }

  return {
    renderer,
    setScroll(p) {
      scrollP = Math.max(0, Math.min(1, p || 0));
    },
    dispose() {
      stop();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
          else o.material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}