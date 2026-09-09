import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ROLES, STATS, MARQUEE, FLAGSHIP, SECONDARY, SKILLS, TIMELINE } from './data/site.js';
import { initParticles } from './anim/particles.js';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const SEEN_KEY = 'rt_portfolio_seen_v2';

/* ============================================================
   Renderers — data → DOM
   ============================================================ */

function renderStats() {
  const wrap = document.querySelector('[data-hero="stats"]');
  STATS.forEach((s) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <dt class="sr-only">${s.label}</dt>
      <dd class="font-display font-bold text-3xl text-cream tabular-nums">
        <span data-count="${s.value}" data-pad="${s.pad ? 1 : 0}">00</span><span class="text-ember">${s.suffix}</span>
      </dd>
      <dd class="font-mono text-[0.7rem] text-fog mt-1">${s.label}</dd>`;
    wrap.appendChild(div);
  });
}

function renderMarquee() {
  const track = document.getElementById('marquee-track');
  const chunk = MARQUEE.map(
    (m) => `<span class="flex items-center gap-8 pr-8 font-mono text-sm text-fog whitespace-nowrap">
      <span class="hover:text-ember transition-colors">${m}</span>
      <span class="text-ember text-xs">◆</span>
    </span>`,
  ).join('');
  track.innerHTML = chunk + chunk; // seamless -50% loop
}

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  SKILLS.forEach((s) => {
    const card = document.createElement('div');
    card.className = `glass rounded-2xl p-6 sm:p-7 spot-card tilt ${s.wide ? 'sm:col-span-2 lg:col-span-1' : ''}`;
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <p class="font-mono text-xs text-ember/90 mb-5">${s.index}</p>
      <h3 class="font-display font-medium text-xl mb-2">${s.title}</h3>
      <p class="text-sm text-fog mb-5">${s.desc}</p>
      <div class="flex flex-wrap gap-2">${s.tags.map((t) => `<span class="chip">${t}</span>`).join('')}</div>`;
    grid.appendChild(card);
  });
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  FLAGSHIP.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = `glass rounded-2xl p-6 sm:p-7 spot-card tilt flex flex-col ${p.featured ? 'md:col-span-2' : ''}`;
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="flex items-start justify-between gap-4 mb-5">
        <span class="font-mono text-xs text-fog">/${String(i + 1).padStart(2, '0')}</span>
        <span class="status-pill" data-status="${p.statusKey}">${p.status}</span>
      </div>
      <h3 class="font-display font-medium text-2xl mb-2">${p.name}</h3>
      <p class="text-fog text-[0.95rem] leading-relaxed mb-5">${p.desc}</p>
      <div class="flex flex-wrap gap-2 mb-6">${p.stack.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
      <div class="p-details mt-auto" id="pd-${i}">
        <div class="p-details-inner">
          <p class="text-[0.95rem] leading-relaxed text-cream/85 pb-5">${p.fullDesc}</p>
        </div>
      </div>
      <div class="flex items-center justify-between gap-4 pt-4 border-t hairline">
        <a href="${p.link.url}" target="_blank" rel="noopener"
           class="font-mono text-xs text-ember hover:text-ember-soft transition-colors">${p.link.label} ↗</a>
        <button class="expand-btn font-mono text-xs text-fog hover:text-cream transition-colors inline-flex items-center gap-2 cursor-pointer"
                aria-expanded="false" aria-controls="pd-${i}">
          details <span class="p-chev text-ember text-base leading-none">+</span>
        </button>
      </div>`;
    grid.appendChild(card);

    const btn = card.querySelector('.expand-btn');
    const details = card.querySelector('.p-details');
    btn.addEventListener('click', () => {
      const open = details.classList.toggle('open');
      card.classList.toggle('open-state', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.firstChild.textContent = open ? 'less ' : 'details ';
      setTimeout(() => ScrollTrigger.refresh(), 550);
    });
  });
}

function renderShipped() {
  const grid = document.getElementById('shipped-grid');
  SECONDARY.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'border hairline rounded-2xl p-5 sm:p-6 spot-card hover:border-ember/40 transition-colors bg-panel/40';
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="flex items-center justify-between gap-3 mb-2.5">
        <h3 class="font-display font-medium text-lg">${p.name}</h3>
        <span class="chip shrink-0">${p.stack}</span>
      </div>
      <p class="text-sm text-fog leading-relaxed">${p.desc}</p>`;
    grid.appendChild(card);
  });
}

function renderTimeline() {
  const wrap = document.getElementById('timeline');
  TIMELINE.forEach((t) => {
    const item = document.createElement('div');
    item.className = `t-item relative ${t.current ? 't-now' : ''}`;
    item.setAttribute('data-reveal', '');
    item.innerHTML = `
      <span class="t-dot" aria-hidden="true"></span>
      <p class="font-mono text-xs text-ember mb-1.5">${t.period}</p>
      <h3 class="font-display font-medium text-xl">${t.title}</h3>
      <p class="font-mono text-xs text-ice mt-1 mb-2.5">${t.org}</p>
      <p class="text-fog text-[0.95rem] leading-relaxed max-w-xl">${t.desc}</p>`;
    wrap.appendChild(item);
  });
}

/* ============================================================
   Terminal typing (hero)
   ============================================================ */

const TERM_LINES = [
  { prompt: true, text: 'whoami' },
  { prompt: false, text: '→ rupjyoti.talukdar — security tooling', cls: 'text-cream' },
  { prompt: true, text: 'stack --list' },
  { prompt: false, text: '→ rust · python · node · kotlin', cls: 'text-ice' },
  { prompt: true, text: 'status' },
  { prompt: false, text: '→ shipping solo · 10 projects · 4 live ✓', cls: 'text-ember-soft' },
];

function typeTerminal() {
  const body = document.getElementById('term-body');
  if (REDUCED) {
    body.innerHTML = TERM_LINES.map((l) =>
      l.prompt ? `<div><span class="text-ember">$</span> <span class="text-cream">${l.text}</span></div>`
               : `<div class="${l.cls ?? ''}">${l.text}</div>`,
    ).join('') + `<div class="term-caret"></div>`;
    return;
  }
  body.innerHTML = '';
  let li = 0;
  function nextLine() {
    if (li >= TERM_LINES.length) {
      const caret = document.createElement('div');
      caret.className = 'term-caret';
      caret.innerHTML = '<span class="text-ember">$</span> ';
      body.appendChild(caret);
      return;
    }
    const line = TERM_LINES[li];
    const div = document.createElement('div');
    if (line.prompt) {
      div.innerHTML = '<span class="text-ember">$</span> <span class="text-cream"></span>';
      body.appendChild(div);
      const target = div.querySelector('span:last-child');
      let ci = 0;
      (function tick() {
        target.textContent = line.text.slice(0, ++ci);
        if (ci < line.text.length) setTimeout(tick, 34);
        else {
          li++;
          setTimeout(nextLine, 160);
        }
      })();
    } else {
      div.className = line.cls ?? '';
      body.appendChild(div);
      let ci = 0;
      (function tick() {
        div.textContent = line.text.slice(0, ++ci);
        if (ci < line.text.length) setTimeout(tick, 12);
        else {
          li++;
          setTimeout(nextLine, 200);
        }
      })();
    }
  }
  nextLine();
}

/* ============================================================
   Boot
   ============================================================ */

renderStats();
renderMarquee();
renderSkills();
renderProjects();
renderShipped();
renderTimeline();
document.getElementById('year').textContent = String(new Date().getFullYear());

initParticles(document.getElementById('bg-canvas'));

let lenis = null;
if (!REDUCED) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
}

document.querySelectorAll('[data-scroll]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      closeMenu();
      scrollToTarget(href);
    }
  });
});

/* ---------- initial states ---------- */
if (!REDUCED) {
  gsap.set('[data-hero="badge"], [data-hero="eyebrow"], [data-hero="role"], [data-hero="para"], [data-hero="cta"], [data-hero="stats"]', {
    opacity: 0,
    y: 26,
  });
  gsap.set('[data-hero="line"]', { yPercent: 115 });
  gsap.set('[data-hero="term"]', { opacity: 0, y: 40, rotateX: 8 });
}

function heroIntro() {
  if (REDUCED) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('[data-hero="badge"], [data-hero="eyebrow"]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 })
    .to('[data-hero="line"]', { yPercent: 0, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.45')
    .to('[data-hero="role"], [data-hero="para"]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, '-=0.6')
    .to('[data-hero="cta"], [data-hero="stats"]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, '-=0.5')
    .to('[data-hero="term"]', { opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: 'power2.out' }, '-=0.9')
    .add(typeTerminal, '-=0.9');
}

const BOOT_WORDS = ['identity', 'repositories', 'languages', 'projects', 'toolchain', 'status ✓'];

function runPreloader() {
  const pre = document.getElementById('preloader');
  const done = () => {
    pre.classList.add('done');
    pre.setAttribute('aria-hidden', 'true');
  };

  if (REDUCED || sessionStorage.getItem(SEEN_KEY)) {
    done();
    if (!REDUCED) {
      gsap.set('[data-hero]', { clearProps: 'all' });
      typeTerminal();
    } else {
      typeTerminal();
    }
    return;
  }

  const count = document.getElementById('boot-count');
  const bar = document.getElementById('boot-bar');
  const word = document.getElementById('boot-word');
  const state = { v: 0 };
  let wi = 0;
  const wordTimer = setInterval(() => {
    wi = (wi + 1) % BOOT_WORDS.length;
    word.textContent = BOOT_WORDS[wi];
  }, 260);

  document.getElementById('boot-skip').addEventListener('click', () => {
    clearInterval(wordTimer);
    gsap.killTweensOf(state);
    finish();
  });

  gsap.to(state, {
    v: 100,
    duration: 1.7,
    ease: 'power2.inOut',
    onUpdate: () => {
      count.textContent = String(Math.round(state.v));
      bar.style.transform = `scaleX(${state.v / 100})`;
    },
    onComplete: () => {
      clearInterval(wordTimer);
      finish();
    },
  });

  function finish() {
    sessionStorage.setItem(SEEN_KEY, '1');
    gsap.timeline()
      .to('#preloader > div', { opacity: 0, y: -24, duration: 0.4, ease: 'power2.in' })
      .to('#preloader', {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        onComplete: done,
      }, '-=0.1')
      .add(heroIntro, '-=0.45');
  }
}

/* ============================================================
   Scroll effects
   ============================================================ */

function initScrollFX() {
  // Section reveals
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    if (REDUCED) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 34 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    if (REDUCED) return;
    gsap.fromTo(
      group.children,
      { opacity: 0, y: 26 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 86%', once: true },
      },
    );
  });

  // Count-up stats
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const pad = el.dataset.pad === '1';
    const fmt = (v) => (pad ? String(v).padStart(2, '0') : String(v));
    if (REDUCED) {
      el.textContent = fmt(target);
      return;
    }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = fmt(Math.round(obj.v));
          },
        }),
    });
  });

  // Hero parallax-out
  if (!REDUCED) {
    gsap.to('#top > div', {
      y: -70,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // Progress bar + nav hide/show + active link
  const bar = document.getElementById('progress-bar');
  const nav = document.getElementById('site-nav');
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (y > 140 && y > lastY + 4) nav.classList.add('nav-hidden');
    else if (y < lastY - 4 || y < 140) nav.classList.remove('nav-hidden');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const links = document.querySelectorAll('[data-nav]');
  const map = {};
  links.forEach((l) => {
    map[l.dataset.nav] = l;
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          map[en.target.id]?.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  ['about', 'skills', 'work', 'journey', 'contact'].forEach((id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

/* ============================================================
   Pointer FX — cursor, magnetic, tilt, orbs
   ============================================================ */

function initPointerFX() {
  if (!FINE_POINTER || REDUCED) return;

  // Custom cursor
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const dx = gsap.quickSetter(dot, 'x', 'px');
  const dy = gsap.quickSetter(dot, 'y', 'px');
  const rx = gsap.quickSetter(ring, 'x', 'px');
  const ry = gsap.quickSetter(ring, 'y', 'px');
  const pos = { x: -100, y: -100, rx: -100, ry: -100 };
  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
  });
  gsap.ticker.add(() => {
    pos.rx += (pos.x - pos.rx) * 0.16;
    pos.ry += (pos.y - pos.ry) * 0.16;
    dx(pos.x - 3);
    dy(pos.y - 3);
    rx(pos.rx - 17);
    ry(pos.ry - 17);
  });
  document.querySelectorAll('a, button, .tilt').forEach((el) => {
    el.addEventListener('pointerenter', () => ring.classList.add('grow'));
    el.addEventListener('pointerleave', () => ring.classList.remove('grow'));
  });

  // Magnetic
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - r.left - r.width / 2) * 0.28,
        y: (e.clientY - r.top - r.height / 2) * 0.28,
        duration: 0.4,
        ease: 'power3.out',
      });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // Orb parallax
  const orbs = document.querySelectorAll('[data-orb]');
  window.addEventListener(
    'pointermove',
    (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      orbs.forEach((o, i) => {
        const f = (i + 1) * 26;
        gsap.to(o, { x: nx * f, y: ny * f, duration: 1.2, ease: 'power2.out', overwrite: 'auto' });
      });
    },
    { passive: true },
  );
}

function initTilt() {
  if (!FINE_POINTER || REDUCED) return;
  document.querySelectorAll('.tilt').forEach((card) => {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        gsap.to(card, {
          rotateY: (px - 0.5) * 7,
          rotateX: (0.5 - py) * 7,
          transformPerspective: 900,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* Spotlight vars for touch too (cheap, no tilt) */
document.querySelectorAll('.spot-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, { passive: true });
});

/* ============================================================
   Role rotator
   ============================================================ */

function initRotator() {
  const el = document.getElementById('role-word');
  if (REDUCED) return;
  let i = 0;
  setInterval(() => {
    gsap.to(el, {
      y: -14,
      opacity: 0,
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        i = (i + 1) % ROLES.length;
        el.textContent = ROLES[i];
        gsap.fromTo(el, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
      },
    });
  }, 2600);
}

/* ============================================================
   Menu / misc
   ============================================================ */

const menu = document.getElementById('mobile-menu');
const menuBtn = document.getElementById('menu-btn');
let menuOpen = false;

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  menu.classList.add('hidden-menu');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menu.classList.toggle('hidden-menu', !menuOpen);
  menuBtn.setAttribute('aria-expanded', String(menuOpen));
});

document.getElementById('to-top').addEventListener('click', () => {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('copy-email').addEventListener('click', async () => {
  const label = document.getElementById('copy-label');
  const email = 'contact.rupjyoti26@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = email;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  label.textContent = 'copied ✓';
  setTimeout(() => {
    label.textContent = email;
  }, 1800);
});

/* ---------- go ---------- */
runPreloader();
initScrollFX();
initPointerFX();
initTilt();
initRotator();
