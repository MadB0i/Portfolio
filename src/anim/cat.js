/* Cat companion — an SVG supervisor with blinking eyes, a swaying
   tail, pupils that follow your cursor, and a meow on click.
   All motion is transform/opacity only; reduced-motion users get
   a calm static cat. */

const CAT_SVG = `
<svg viewBox="0 0 220 200" role="img" aria-label="A cat supervising this portfolio">
  <g class="cat-tail">
    <path d="M168 158 C 198 152, 204 116, 188 100" fill="none" stroke="#232c44" stroke-width="15" stroke-linecap="round"/>
    <path d="M168 158 C 198 152, 204 116, 188 100" fill="none" stroke="#344062" stroke-width="6" stroke-linecap="round" opacity="0.8"/>
  </g>
  <ellipse cx="108" cy="152" rx="56" ry="44" fill="#232c44"/>
  <ellipse cx="108" cy="163" rx="27" ry="26" fill="#2e3a56"/>
  <ellipse cx="87" cy="188" rx="14" ry="8" fill="#2e3a56"/>
  <ellipse cx="129" cy="188" rx="14" ry="8" fill="#2e3a56"/>
  <g class="cat-ear-l">
    <polygon points="72,62 64,16 102,42" fill="#232c44"/>
    <polygon points="76,52 71,28 93,42" fill="#8a5a24"/>
  </g>
  <g class="cat-ear-r">
    <polygon points="144,62 152,16 114,42" fill="#232c44"/>
    <polygon points="140,52 145,28 123,42" fill="#8a5a24"/>
  </g>
  <circle cx="108" cy="84" r="43" fill="#232c44"/>
  <path d="M108 43 l0 11 M94 46 l3 10 M122 46 l-3 10" stroke="#161d30" stroke-width="4" stroke-linecap="round"/>
  <g class="cat-eyes">
    <ellipse cx="91" cy="84" rx="9.5" ry="11" fill="#f5c86e"/>
    <ellipse cx="125" cy="84" rx="9.5" ry="11" fill="#f5c86e"/>
    <g class="cat-pupil">
      <circle cx="91" cy="86" r="4.8" fill="#0a0f1c"/>
      <circle cx="92.8" cy="84" r="1.5" fill="#ffffff"/>
    </g>
    <g class="cat-pupil">
      <circle cx="125" cy="86" r="4.8" fill="#0a0f1c"/>
      <circle cx="126.8" cy="84" r="1.5" fill="#ffffff"/>
    </g>
  </g>
  <polygon points="108,96 102,102 114,102" fill="#e78aa0"/>
  <path d="M108 102 q0 6 -7 6 M108 102 q0 6 7 6" fill="none" stroke="#e78aa0" stroke-width="1.8" stroke-linecap="round"/>
  <g stroke="#9aa0a8" stroke-width="1.4" opacity="0.45" stroke-linecap="round">
    <line x1="62" y1="90" x2="32" y2="84"/>
    <line x1="62" y1="97" x2="33" y2="98"/>
    <line x1="154" y1="90" x2="184" y2="84"/>
    <line x1="154" y1="97" x2="183" y2="98"/>
  </g>
</svg>
<div class="cat-bubble">meow! ♥</div>`;

export function initCat(mount) {
  if (!mount) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  mount.innerHTML = CAT_SVG;

  const pupils = mount.querySelectorAll('.cat-pupil');
  const svg = mount.querySelector('svg');

  // Pupils track the pointer — cheap attribute writes, no layout.
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener(
      'pointermove',
      (e) => {
        const r = svg.getBoundingClientRect();
        if (r.width === 0) return;
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.42;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const mag = Math.min(3.6, dist / 60);
        const x = ((dx / dist) * mag).toFixed(1);
        const y = ((dy / dist) * mag).toFixed(1);
        pupils.forEach((p) => p.setAttribute('transform', `translate(${x} ${y})`));
      },
      { passive: true },
    );
  }

  // Click / keyboard = meow (re-triggerable bounce + speech bubble).
  mount.addEventListener('click', () => {
    mount.classList.remove('meow');
    void mount.offsetWidth;
    mount.classList.add('meow');
  });
  mount.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      mount.click();
    }
  });
}
