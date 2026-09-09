/* Ops radar — a sweeping canvas with clickable DOM blips, one per
   flagship project. Clicking a blip smooth-scrolls to its dossier
   card and flashes it. Sweep pauses off-screen and renders a single
   static frame when reduced motion is requested. */

export function initRadar(canvas, blipBox, contacts, onJump) {
  if (!canvas || !blipBox) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = 0;
  let h = 0;
  let raf = 0;
  let running = false;
  let angle = 0.8;

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    w = Math.max(60, r.width);
    h = Math.max(60, r.height);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) draw(angle);
  }

  function rings(cx, cy, R) {
    ctx.strokeStyle = 'rgba(232,163,61,0.22)';
    ctx.lineWidth = 1;
    [0.33, 0.66, 1].forEach((f) => {
      ctx.beginPath();
      ctx.arc(cx, cy, R * f, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(232,163,61,0.12)';
    ctx.beginPath();
    ctx.moveTo(cx - R, cy);
    ctx.lineTo(cx + R, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - R);
    ctx.lineTo(cx, cy + R);
    ctx.stroke();
  }

  function draw(a) {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) / 2 - 10;
    rings(cx, cy, R);
    // Beam with a fading trail — short arc strokes, no gradients needed.
    for (let i = 0; i < 26; i++) {
      const aa = a - i * 0.035;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(232,163,61,${(0.45 * (1 - i / 26)).toFixed(3)})`;
      ctx.lineWidth = 2;
      ctx.arc(cx, cy, R, aa - 0.025, aa);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#e8a33d';
    ctx.fill();
  }

  function frame() {
    if (!running) return;
    angle += 0.022;
    draw(angle);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduced || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  contacts.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'ops-blip';
    b.style.left = `${c.x}%`;
    b.style.top = `${c.y}%`;
    b.setAttribute('aria-label', `Jump to ${c.name}`);
    b.innerHTML = `<span class="blip-tag" aria-hidden="true">${c.name}</span>`;
    b.addEventListener('click', () => onJump(c));
    blipBox.appendChild(b);
  });

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    }).observe(canvas);
  } else {
    start();
  }
}
