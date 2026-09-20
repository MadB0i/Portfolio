/* ============================================================
   Mini agent cat — corner desktop-pet. Watches the cursor,
   chases fast movement, sleeps when idle, stretches on
   section changes. One tiny canvas, one rAF, guarded everywhere.
   ============================================================ */

const AMBER = '#F5A524';
const AMBER_SOFT = '#FBD38D';

export function initAgentCat() {
  const box = document.getElementById('agent-cat');
  if (!box) return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  if (window.matchMedia('(hover: none), (max-width: 767px)').matches) return null;

  const canvas = document.createElement('canvas');
  const S = 150;
  canvas.width = S * 2;
  canvas.height = S * 2;
  canvas.style.width = `${S}px`;
  canvas.style.height = `${S}px`;
  box.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.scale(2, 2);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const st = {
    bx: 0, by: 0, bvx: 0, bvy: 0, // body hop offset + velocity
    tx: 0, // hop target x
    hx: 0, hy: 0, // head look offset
    blink: 0, // frames remaining closed
    nextBlink: 120,
    tail: 0,
    breath: 0,
    sleep: 0, // idle frames
    sleeping: false,
    stretch: 0, // stretch anim frames
    mx: -999, my: -999, // cursor in box coords
    lastMove: performance.now(),
    lastSpeed: 0,
  };

  let px = -999;
  let py = -999;
  let pt = performance.now();
  window.addEventListener('pointermove', (e) => {
    const r = box.getBoundingClientRect();
    const now = performance.now();
    const dt = Math.max(16, now - pt);
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    st.lastSpeed = Math.hypot(dx, dy) / dt; // px per ms
    px = e.clientX;
    py = e.clientY;
    pt = now;
    st.mx = e.clientX - r.left;
    st.my = e.clientY - r.top;
    st.lastMove = now;
    st.sleep = 0;
    if (st.sleeping && st.lastSpeed > 0.05) {
      st.sleeping = false;
      st.sleep = 0;
    }
    if (st.lastSpeed > 1.4) {
      /* chase: hop toward cursor side, clamped in box */
      st.tx = Math.max(-30, Math.min(30, (st.mx - S / 2) * 0.35));
      st.sleep = 0;
    }
  }, { passive: true });

  /* stretch on section change */
  if ('IntersectionObserver' in window) {
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !seen.has(en.target.id)) {
            seen.add(en.target.id);
            if (seen.size > 1) st.stretch = 70;
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ['top', 'about', 'skills', 'work', 'journey', 'contact'].forEach((id) => {
      const s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  let raf = 0;
  let running = false;
  let frame = 0;

  function update() {
    frame += 1;
    st.breath += 0.05;
    st.tail += 0.06;

    /* hop spring toward target */
    st.bvx += (st.tx - st.bx) * 0.08;
    st.bvx *= 0.82;
    st.bx += st.bvx;
    const airbone = Math.abs(st.bvx) > 0.4 ? -Math.abs(st.bvx) * 3 : 0;
    st.bvy += (0 - st.by) * 0.1;
    st.bvy *= 0.8;
    st.by += st.bvy;
    st.tx *= 0.97; // drift home

    /* head looks at cursor */
    const lx = (st.mx - S / 2) / (S / 2);
    const ly = (st.my - S / 2) / (S / 2);
    const look = st.sleeping ? 0 : 1;
    st.hx += ((Math.max(-1, Math.min(1, lx)) * 5) * look - st.hx) * 0.1;
    st.hy += ((Math.max(-1, Math.min(1, ly)) * 3.5) * look - st.hy) * 0.1;

    /* blink */
    if (st.blink > 0) {
      st.blink -= 1;
    } else {
      st.nextBlink -= 1;
      if (st.nextBlink <= 0 && !st.sleeping) {
        st.blink = 7;
        st.nextBlink = 150 + Math.random() * 250;
      }
    }

    /* sleep after ~30s idle */
    st.sleep += 1;
    if (!st.sleeping && st.sleep > 1800) st.sleeping = true;
    if (st.stretch > 0) st.stretch -= 1;
  }

  function draw() {
    ctx.clearRect(0, 0, S, S);
    const cx = S / 2 + st.bx;
    const squash = 1 - Math.min(0.12, Math.abs(st.bvx) * 0.03);
    const lift = st.by - Math.abs(st.bvx) * 3;

    ctx.save();
    ctx.translate(cx, 78 + lift);
    ctx.scale(2 - squash > 1.14 ? 1.14 : 2 - squash, squash);
    if (st.stretch > 0) {
      const k = Math.sin((st.stretch / 70) * Math.PI);
      ctx.scale(1 + k * 0.12, 1 - k * 0.1);
    }

    ctx.strokeStyle = AMBER;
    ctx.fillStyle = AMBER;
    ctx.lineWidth = 3;

    /* tail */
    const wag = Math.sin(st.tail) * 8;
    ctx.beginPath();
    ctx.moveTo(30, 18);
    ctx.quadraticCurveTo(52, 14 + wag, 48, -12 + wag * 0.5);
    ctx.stroke();

    /* body */
    ctx.beginPath();
    const br = 30 + Math.sin(st.breath) * 1.2;
    ctx.ellipse(0, 16, br, 24, 0, 0, Math.PI * 2);
    ctx.stroke();

    /* feet */
    ctx.beginPath();
    ctx.moveTo(-20, 38);
    ctx.lineTo(-20, 44);
    ctx.moveTo(20, 38);
    ctx.lineTo(20, 44);
    ctx.stroke();

    /* stretch paws */
    if (st.stretch > 0) {
      const k = Math.sin((st.stretch / 70) * Math.PI);
      ctx.beginPath();
      ctx.moveTo(-14, 30);
      ctx.lineTo(-14 - k * 22, 44);
      ctx.moveTo(14, 30);
      ctx.lineTo(14 + k * 22, 44);
      ctx.stroke();
    }

    /* head */
    const hxp = st.hx;
    const hyp = st.hy;
    ctx.beginPath();
    ctx.moveTo(-24 + hxp * 0.4, 2 + hyp * 0.3);
    ctx.lineTo(-18 + hxp * 0.4, -22 + hyp * 0.3);
    ctx.lineTo(-6 + hxp * 0.4, -8 + hyp * 0.3);
    ctx.moveTo(24 + hxp * 0.4, 2 + hyp * 0.3);
    ctx.lineTo(18 + hxp * 0.4, -22 + hyp * 0.3);
    ctx.lineTo(6 + hxp * 0.4, -8 + hyp * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(hxp, hyp, 24, 0, Math.PI * 2);
    ctx.stroke();

    /* eyes */
    if (st.sleeping || st.blink > 0) {
      ctx.beginPath();
      ctx.moveTo(-13 + hxp, -2 + hyp);
      ctx.lineTo(-5 + hxp, -2 + hyp);
      ctx.moveTo(5 + hxp, -2 + hyp);
      ctx.lineTo(13 + hxp, -2 + hyp);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(-9 + hxp, -3 + hyp, 3.4, 0, Math.PI * 2);
      ctx.arc(9 + hxp, -3 + hyp, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }

    /* nose + mouth */
    if (!st.sleeping) {
      ctx.beginPath();
      ctx.moveTo(-2 + hxp, 6 + hyp);
      ctx.lineTo(2 + hxp, 6 + hyp);
      ctx.lineTo(hxp, 9 + hyp);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(hxp, 9 + hyp);
      ctx.quadraticCurveTo(hxp - 4, 13 + hyp, hxp - 7, 11 + hyp);
      ctx.moveTo(hxp, 9 + hyp);
      ctx.quadraticCurveTo(hxp + 4, 13 + hyp, hxp + 7, 11 + hyp);
      ctx.stroke();
    }
    ctx.restore();

    /* Zzz */
    if (st.sleeping) {
      ctx.fillStyle = AMBER_SOFT;
      ctx.font = '11px monospace';
      const bob = Math.sin(frame * 0.05) * 3;
      ctx.fillText('z', cx + 34, 30 + bob);
      ctx.fillText('Z', cx + 42, 18 + bob);
    }
  }

  const tick = () => {
    raf = requestAnimationFrame(tick);
    update();
    draw();
  };

  const start = () => {
    if (running) return;
    running = true;
    tick();
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
  return { stop, start };
}
