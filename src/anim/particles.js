/* Ambient dot-grid canvas: slow drift + a soft light that follows the
   pointer. Transform-free (canvas paint only), pauses off-screen and
   renders one static frame when reduced motion is requested. */

export function initParticles(canvas, opts = {}) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const spacing = opts.spacing ?? 46;
  const dotColor = opts.dotColor ?? '120, 140, 165';
  let w = 0;
  let h = 0;
  let raf = 0;
  let running = false;
  let visible = true;
  let t = Math.random() * 1000;
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function frame() {
    if (!running) return;
    t += 0.0035;
    // Ease the glow toward the pointer so it trails smoothly.
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;

    ctx.clearRect(0, 0, w, h);
    const driftX = Math.sin(t) * 10;
    const driftY = (t * 22) % spacing;

    for (let y = -spacing; y < h + spacing; y += spacing) {
      const yy = y + driftY - spacing;
      for (let x = -spacing; x < w + spacing; x += spacing) {
        const xx = x + driftX;
        const dx = xx - mouse.x;
        const dy = yy - mouse.y;
        const dist = Math.hypot(dx, dy);
        const glow = Math.max(0, 1 - dist / 260);
        const base = 0.16 + 0.05 * Math.sin(t * 4 + xx * 0.02 + yy * 0.02);
        const alpha = Math.min(0.85, base + glow * 0.55);
        const r = 1 + glow * 1.1;
        ctx.beginPath();
        ctx.arc(xx, yy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    // Soft amber aura around the pointer.
    if (mouse.x > -100 && mouse.y > -100) {
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
      g.addColorStop(0, 'rgba(232,163,61,0.07)');
      g.addColorStop(1, 'rgba(232,163,61,0)');
      ctx.fillStyle = g;
      ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced || !visible || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function paintOnce() {
    // One calm static frame for reduced-motion / hidden states.
    mouse.x = -9999;
    mouse.y = -9999;
    t = 0;
    ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y += spacing) {
      for (let x = 0; x < w; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},0.16)`;
        ctx.fill();
      }
    }
  }

  function onMove(e) {
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  // Pause when the page is scrolled past the hero to save battery —
  // the canvas is fixed, so keep it cheap instead: lower work by
  // stopping only when the tab is hidden. Observe hero for fade.
  if ('IntersectionObserver' in window) {
    const hero = document.getElementById('top');
    if (hero) {
      new IntersectionObserver(
        (entries) => {
          canvas.style.opacity = entries[0].isIntersecting ? '1' : '0.45';
        },
        { threshold: 0 },
      ).observe(hero);
    }
  }

  if (reduced) {
    paintOnce();
  } else {
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    // Canvas is fixed-fullscreen so it is always "visible" — run always
    // but stop when tab hidden. Keep the observer trivial.
    io.disconnect();
    start();
  }

  return { stop, start };
}
