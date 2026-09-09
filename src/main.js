import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ROLES, STATS, MARQUEE, FLAGSHIP, SECONDARY, SKILLS, TIMELINE, THREAT_FEED } from './data/site.js';


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
        <span data-count="${s.value}" data-pad="${s.pad ? 1 : 0}">00</span><span class="text-sig">${s.suffix}</span>
      </dd>
      <dd class="font-mono text-[0.7rem] text-fog mt-1">${s.label}</dd>`;
    wrap.appendChild(div);
  });
}

function renderMarquee() {
  const track = document.getElementById('marquee-track');
  const chunk = MARQUEE.map(
    (m) => `<span class="flex items-center gap-8 pr-8 font-mono text-sm text-fog whitespace-nowrap">
      <span class="hover:text-sig transition-colors">${m}</span>
      <span class="text-sig text-xs">◆</span>
    </span>`,
  ).join('');
  track.innerHTML = chunk + chunk; // seamless -50% loop
}

function renderFeed() {
  const track = document.getElementById('feed-track');
  if (!track) return;
  const chunk = THREAT_FEED.map(
    (m) => `<span class="feed-item">${m}</span>`,
  ).join('');
  track.innerHTML = chunk + chunk;
}

function renderSkills() {
  const grid = document.getElementById('skills-grid');
  SKILLS.forEach((s) => {
    const card = document.createElement('div');
    card.className = `glass rounded-2xl p-6 sm:p-7 spot-card tilt ${s.wide ? 'sm:col-span-2 lg:col-span-1' : ''}`;
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="flex items-start justify-between mb-5">
        <span class="skill-icon">${s.icon}</span>
        <span class="font-mono text-xs text-sig/90">${s.index}</span>
      </div>
      <h3 class="font-display font-medium text-xl mb-2">${s.title}</h3>
      <p class="text-sm text-fog mb-5">${s.desc}</p>
      <div class="flex flex-wrap gap-2 mb-5">${s.tags.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
      ${s.accent ? s.accent : ''}
      <p class="skill-proof">▸ ${s.proof}</p>`;
    grid.appendChild(card);
  });
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  FLAGSHIP.forEach((p, i) => {
    const card = document.createElement('article');
    card.id = `proj-${i}`;
    card.className = 'glass dossier rounded-2xl p-6 sm:p-7 spot-card tilt flex flex-col dossier-openable';
    card.setAttribute('data-index', String(i));
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${p.name} dossier`);
    card.style.top = `calc(92px + ${i * 16}px)`;
    card.style.zIndex = String(i + 1);
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      <div class="p-media ${p.featured ? 'h-52 sm:h-64' : 'h-44'}" data-media>
        <img src="${p.img}" alt="${p.alt}" loading="lazy" onerror="this.closest('[data-media]')?.remove()" />
      </div>
      <span class="dossier-open" aria-hidden="true">↗</span>
      <div class="flex items-start justify-between gap-4 mb-5 mt-5">
        <span class="font-mono text-xs text-fog">FILE ${String(i + 1).padStart(2, '0')}</span>
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
           class="font-mono text-xs text-sig hover:text-sig-soft transition-colors">${p.link.label} ↗</a>
        <button class="expand-btn font-mono text-xs text-fog hover:text-cream transition-colors inline-flex items-center gap-2 cursor-pointer"
                aria-expanded="false" aria-controls="pd-${i}">
          details <span class="p-chev text-sig text-base leading-none">+</span>
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
    card.className = 'border hairline rounded-2xl p-5 sm:p-6 spot-card hover:border-sig/40 transition-colors bg-panel/40';
    card.setAttribute('data-reveal', '');
    card.innerHTML = `
      ${p.icon ? `<div class="shipped-icon mb-3">${p.icon}</div>` : ''}
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
  const total = TIMELINE.length;
  TIMELINE.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = `t-item relative ${t.current ? 't-now' : ''}`;
    item.setAttribute('data-tl', String(i));
    const logNum = String(total - i).padStart(2, '0');
    item.innerHTML = `
      <span class="t-dot" aria-hidden="true"></span>
      <div class="tl-head">
        <span class="tl-tag">◈ ${t.phase}</span>
        <span class="tl-period font-mono text-xs">LOG-${logNum}</span>
        <span class="tl-tag font-mono text-xs text-sig ml-auto tracking-wider opacity-0" data-tl-reveal>${t.period}</span>
      </div>
      <h3 class="font-display font-medium text-xl text-fog" data-tl-text>${t.title}</h3>
      <p class="font-mono text-xs text-fog/60 mt-1 mb-3" data-tl-text>${t.org}</p>
      <p class="text-fog/55 text-[0.95rem] leading-relaxed max-w-xl" data-tl-text>${t.desc}</p>`;
    wrap.appendChild(item);
  });
}

/* ============================================================
   Boot
   ============================================================ */

renderStats();
renderMarquee();
renderFeed();
renderSkills();
renderProjects();
renderShipped();
renderTimeline();
document.getElementById('year').textContent = String(new Date().getFullYear());

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
}

function heroIntro() {
  if (REDUCED) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('[data-hero="badge"]', { opacity: 1, y: 0, duration: 0.5 }, 0)
    .to('[data-hero="line"]', { yPercent: 0, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, 0.1)
    .to('[data-hero="role"]', { opacity: 1, y: 0, duration: 0.5 }, 0.3)
    .to('[data-hero="para"]', { opacity: 1, y: 0, duration: 0.5 }, 0.4)
    .to('[data-hero="cta"]', { opacity: 1, y: 0, duration: 0.5 }, 0.5)
    .to('[data-hero="stats"]', { opacity: 1, y: 0, duration: 0.5 }, 0.6);
}

const BOOT_WORDS = ['perimeter scan', 'intrusion detected', 'tracing source', 'threat isolated', 'threat neutralized ✓'];

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
    // Red while hostile, green once neutralized.
    word.style.color = wi === BOOT_WORDS.length - 1 ? '#6FD18C' : '#ff5d6e';
  }, 300);

  document.getElementById('boot-skip').addEventListener('click', () => {
    clearInterval(wordTimer);
    gsap.killTweensOf(state);
    finish();
  });

  gsap.to(state, {
    v: 100,
    duration: 1.2,
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

  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {    if (REDUCED) return;
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

  // Timeline — progressive terminal-log colorization
  if (!REDUCED) {
    gsap.utils.toArray('.t-item').forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 90%', once: true } }
      );
      gsap.fromTo(
        item.querySelectorAll('[data-tl-text]'),
        { opacity: 0.45, color: 'var(--color-fog)' },
        { opacity: 1, color: 'var(--color-cream)', duration: 0.7, stagger: 0.05, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 88%', once: true } }
      );
      gsap.fromTo(
        item.querySelectorAll('[data-tl-reveal]'),
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 86%', once: true } }
      );
    });
  }

  // Masked-line rises (manifesto) — Honey kinetic feel
  gsap.utils.toArray('.mask-line').forEach((line, i) => {
    if (REDUCED) return;
    gsap.fromTo(
      line,
      { yPercent: 115 },
      {
        yPercent: 0,
        duration: 0.9,
        ease: 'power4.out',
        delay: (i % 4) * 0.08,
        scrollTrigger: { trigger: line, start: 'top 90%', once: true },
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

  // Chapter rail — same sections plus hero
  const railDots = document.querySelectorAll('[data-rail]');
  const railMap = {};
  railDots.forEach((d) => {
    railMap[d.dataset.rail] = d;
  });
  if (railDots.length && 'IntersectionObserver' in window) {
    const rio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            railDots.forEach((d) => d.classList.remove('active'));
            railMap[en.target.id]?.classList.add('active');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    ['top', 'about', 'skills', 'work', 'journey', 'contact'].forEach((id) => {
      const s = document.getElementById(id);
      if (s) rio.observe(s);
    });
  }
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
        x: (e.clientX - r.left - r.width / 2) * 0.36,
        y: (e.clientY - r.top - r.height / 2) * 0.36,
        duration: 0.35,
        ease: 'power3.out',
      });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1.1, 0.45)' });
    });
  });

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
          rotateY: (px - 0.5) * 5,
          rotateX: (0.5 - py) * 5,
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
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  menu.classList.toggle('hidden-menu', !menuOpen);
  menuBtn.classList.toggle('open', menuOpen);
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

/* ---------- text scramble (secure-channel line) ---------- */
function initScramble() {
  const els = document.querySelectorAll('[data-scramble]');
  if (!els.length || REDUCED) return;
  const GLYPHS = '$>_#%:;@&|~^!?=[]{}';
  els.forEach((el) => {
    const original = el.textContent;
    let raf = 0;
    function play() {
      const start = performance.now();
      const dur = 700;
      cancelAnimationFrame(raf);
      (function tick(now) {
        const t = Math.min(((now ?? start) - start) / dur, 1);
        const reveal = Math.floor(t * original.length);
        let out = '';
        for (let i = 0; i < original.length; i++) {
          out += i < reveal || original[i] === ' '
            ? original[i]
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = original;
      })(start);
    }
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play });
  });
}

/* ---------- cat state machine ---------- */
function initCatState() {
  if (REDUCED) return;
  const bigCat = document.querySelector('.hero-cat-big');
  if (!bigCat) return;
  const heroSection = document.getElementById('top');
  if (!heroSection) return;

  const eyes = bigCat.querySelectorAll('.cat-eye');
  const head = bigCat.querySelector('.cat-head');
  const earL = bigCat.querySelector('.cat-ear-l');
  const earR = bigCat.querySelector('.cat-ear-r');
  const tail = bigCat.querySelector('.cat-tail');

  const pupils = [
    { el: eyes[0], baseCx: 52, baseCy: 44 },
    { el: eyes[1], baseCx: 68, baseCy: 44 },
  ];
  const maxEyeShift = 1.6;

  let state = 'idle';
  let mouseX = 0;
  let mouseY = 0;
  let idleTimer = null;
  let blinkTimer = null;
  let trackingActive = false;
  const alertElements = document.querySelectorAll('a, button, .spot-card, .dossier, .card-also, [role="button"]');

  function clearTimers() {
    clearTimeout(idleTimer);
    clearInterval(blinkTimer);
  }

  function scheduleIdleBlink() {
    clearInterval(blinkTimer);
    blinkTimer = setInterval(() => {
      if (state === 'idle' || state === 'curious') {
        triggerBlink(180);
      }
    }, 5200 + Math.random() * 5200);
  }

  function triggerBlink(dur) {
    eyes.forEach((eye) => {
      gsap.to(eye, {
        attr: { ry: 0.3 },
        duration: dur / 2000,
        ease: 'power2.in',
        onComplete: () => {
          gsap.to(eye, { attr: { ry: 3.2 }, duration: dur / 2000, ease: 'power2.out' });
        },
      });
    });
  }

  function startTracking() {
    if (trackingActive) return;
    trackingActive = true;
    heroSection.addEventListener('pointermove', onPointerMove);
  }

  function stopTracking() {
    if (!trackingActive) return;
    trackingActive = false;
    heroSection.removeEventListener('pointermove', onPointerMove);
  }

  function onPointerMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (state === 'sleep') return;

    // Check if near an interactive element → alert
    let nearInteractive = false;
    for (const el of alertElements) {
      const r = el.getBoundingClientRect();
      if (mouseX >= r.left - 40 && mouseX <= r.right + 40 && mouseY >= r.top - 40 && mouseY <= r.bottom + 40) {
        nearInteractive = true;
        break;
      }
    }

    if (nearInteractive && state !== 'alert') {
      state = 'alert';
    } else if (!nearInteractive && state === 'alert') {
      state = 'curious';
    } else if (state === 'idle') {
      state = 'curious';
    }
  }

  function updateTracking() {
    if (!trackingActive || (state !== 'idle' && state !== 'curious' && state !== 'alert')) {
      requestAnimationFrame(updateTracking);
      return;
    }

    const r = bigCat.getBoundingClientRect();
    if (r.width > 0) {
      // Distance-based fade: full tracking when close, none when far
      const catCx = r.left + r.width / 2;
      const catCy = r.top + r.height / 2;
      const dist = Math.hypot(mouseX - catCx, mouseY - catCy);
      const fade = Math.max(0, 1 - dist / 600);

      if (fade > 0.01) {
        const nx = ((mouseX - r.left) / r.width - 0.5) * 2;
        const ny = ((mouseY - r.top) / r.height - 0.5) * 2;
        const clampedNx = Math.max(-1, Math.min(1, nx));
        const clampedNy = Math.max(-1, Math.min(1, ny));
        const isAlert = state === 'alert';
        const eyeShift = maxEyeShift * fade * (isAlert ? 1.25 : 1);

        pupils.forEach((p) => {
          gsap.to(p.el, {
            attr: {
              cx: p.baseCx + clampedNx * eyeShift,
              cy: p.baseCy + clampedNy * eyeShift,
            },
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });

        // In alert state: widen eyes slightly for focused look
        if (isAlert) {
          eyes.forEach((eye) => {
            gsap.to(eye, {
              attr: { ry: 3.45 },
              duration: 0.2,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          });
        }

        // Subtle head rotation toward cursor
        if (head) {
          gsap.to(head, {
            rotation: clampedNx * 0.45 * fade,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

        // Ears follow — perk more in alert
        if (earL) {
          gsap.to(earL, {
            rotation: clampedNx * -0.8 * fade * (isAlert ? 1.25 : 1),
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
        if (earR) {
          gsap.to(earR, {
            rotation: clampedNx * 0.8 * fade * (isAlert ? 1.25 : 1),
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }

        // Tail responds to cursor proximity
        if (tail && fade > 0.3) {
          gsap.to(tail, {
            rotation: Math.sin(Date.now() / 900) * 2 * fade,
            duration: 0.8,
            ease: 'sine.inOut',
            overwrite: 'auto',
          });
        }
      }
    }

    requestAnimationFrame(updateTracking);
  }

  // --- State transitions ---

  function goToIdle() {
    clearTimers();
    state = 'idle';

    // Ease eyes back to center and reset size
    pupils.forEach((p) => {
      gsap.to(p.el, {
        attr: { cx: p.baseCx, cy: p.baseCy },
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    });
    eyes.forEach((eye) => {
      gsap.to(eye, {
        attr: { ry: 3.2 },
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    // Ease head and ears back
    if (head) gsap.to(head, { rotation: 0, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    if (earL) gsap.to(earL, { rotation: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    if (earR) gsap.to(earR, { rotation: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    if (tail) gsap.to(tail, { rotation: 0, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });

    scheduleIdleBlink();
    resetIdleTimer();
  }

  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (state === 'idle' || state === 'curious') {
        goToSleep();
      }
    }, 26000);
  }

  function goToSleep() {
    clearTimers();
    state = 'sleep';

    // Slowly close eyes
    eyes.forEach((eye) => {
      gsap.to(eye, {
        attr: { ry: 0.3 },
        duration: 1.2,
        ease: 'power2.inOut',
      });
    });

    // Subtle head droop
    if (head) {
      gsap.to(head, { rotation: 2, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto' });
    }
  }

  function wake() {
    state = 'idle';

    // Open eyes
    eyes.forEach((eye) => {
      gsap.to(eye, {
        attr: { ry: 3.2 },
        duration: 0.25,
        ease: 'power2.out',
      });
    });

    // Quick blink to "wake up"
    setTimeout(() => triggerBlink(200), 150);

    // Head back to center
    if (head) {
      gsap.to(head, { rotation: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
    }

    goToIdle();
  }

  // --- Events ---

  heroSection.addEventListener('pointerenter', () => {
    startTracking();
    if (state === 'sleep') wake();
    else if (state === 'idle') {
      state = 'curious';
    }
    resetIdleTimer();
  });

  heroSection.addEventListener('pointerleave', () => {
    goToIdle();
  });

  document.addEventListener('click', (e) => {
    if (state === 'sleep') return;
    // Only react if click is near the cat
    const r = bigCat.getBoundingClientRect();
    if (!r.width) return;
    const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
    if (dist < 250) {
      state = 'click';
      triggerBlink(160);
      // Tiny bounce
      gsap.to(bigCat, {
        y: -3,
        duration: 0.15,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        onComplete: () => goToIdle(),
      });
      return;
    }
  });

  // --- Init ---
  scheduleIdleBlink();
  resetIdleTimer();
  requestAnimationFrame(updateTracking);
}

/* ---------- project modal ---------- */
function buildModalContent(p, i) {
  const caseNo = String(i + 1).padStart(2, '0');
  const chips = p.stack.map((t) => `<span class="chip">${t}</span>`).join('');
  return `
    <div class="max-w-3xl mx-auto">
      <div class="p-media h-56 sm:h-72 md:h-[22rem] mb-8" data-mr>
        <img src="${p.img}" alt="${p.alt}" />
      </div>
      <div class="grid sm:grid-cols-12 gap-8 sm:gap-10">
        <div class="sm:col-span-7">
          <div class="flex items-center gap-3 mb-4" data-mr>
            <span class="font-mono text-xs text-fog">CASE ${caseNo}</span>
            <span class="status-pill" data-status="${p.statusKey}">${p.status}</span>
          </div>
          <h3 class="font-display font-bold text-3xl leading-tight mb-4" data-mr>${p.name}</h3>
          <p class="text-fog text-[1.05rem] leading-relaxed mb-6" data-mr>${p.desc}</p>
          <div class="border-t hairline pt-6" data-mr>
            <p class="font-mono text-xs text-ice mb-3">FIELD REPORT</p>
            <p class="text-cream/85 text-[0.98rem] leading-relaxed">${p.fullDesc}</p>
          </div>
        </div>
        <aside class="sm:col-span-5">
          <div class="border hairline rounded-xl p-5 bg-panel/60" data-mr>
            <p class="font-mono text-xs text-ice mb-4">TECHNICAL STACK</p>
            <div class="flex flex-wrap gap-2 mb-6">${chips}</div>
            <p class="font-mono text-xs text-ice mb-3">OPERATION</p>
            <div class="space-y-3 text-sm">
              <div class="flex items-center justify-between gap-4">
                <span class="text-fog">classification</span>
                <span class="font-mono text-xs text-sig">CONFIDENTIAL</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-fog">owner</span>
                <span class="font-mono text-xs text-cream">R. Talukdar</span>
              </div>
              <div class="flex items-center justify-between gap-4">
                <span class="text-fog">clearance</span>
                <span class="font-mono text-xs text-sig-soft">SOLO · FULL</span>
              </div>
            </div>
          </div>
          <a href="${p.link.url}" target="_blank" rel="noopener"
             class="mt-6 flex items-center justify-center gap-2 btn-primary w-full" data-mr>
            ${p.link.label} ↗
          </a>
          <p class="font-mono text-[0.68rem] text-fog/70 text-center mt-5" data-mr>
            esc to close · click backdrop to dismiss
          </p>
        </aside>
      </div>
    </div>`;
}

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const panel = document.getElementById('modal-panel');
  const body = document.getElementById('modal-body');
  const closeBtn = document.getElementById('modal-close');
  const titleEl = document.getElementById('modal-title');
  if (!modal || !backdrop || !panel || !body || !closeBtn || !titleEl) return;

  let lastFocus = null;
  let closeTl = null;

  function openModal(proj, index) {
    if (closeTl) {
      closeTl.kill();
      closeTl = null;
    }
    lastFocus = document.activeElement;
    titleEl.textContent = `${proj.name.toUpperCase()}_CASE`;
    body.innerHTML = buildModalContent(proj, index);
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    closeBtn.focus();

    if (REDUCED) {
      backdrop.style.opacity = '1';
      panel.style.opacity = '1';
      panel.style.transform = 'none';
      body.querySelectorAll('[data-mr]').forEach((el) => el.classList.remove('opacity-0'));
      return;
    }

    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    gsap.fromTo(
      panel,
      { opacity: 0, yPercent: 4, scale: 0.985 },
      { opacity: 1, yPercent: 0, scale: 1, duration: 0.45, ease: 'power3.out' }
    );
    gsap.fromTo(
      body.querySelectorAll('[data-mr]'),
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.12, overwrite: 'auto' }
    );
  }

  function closeModal() {
    if (modal.classList.contains('hidden')) return;
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    const finish = () => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      if (lastFocus && lastFocus.isConnected) lastFocus.focus();
    };
    if (REDUCED) {
      finish();
      return;
    }
    closeTl = gsap.timeline({ onComplete: finish })
      .to(backdrop, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0)
      .to(panel, { opacity: 0, yPercent: 3, scale: 0.985, duration: 0.3, ease: 'power2.in' }, 0);
  }

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  const grid = document.getElementById('projects-grid');
  if (grid) {
    grid.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      const card = e.target.closest('.dossier');
      if (!card) return;
      const idx = Number(card.getAttribute('data-index'));
      openModal(FLAGSHIP[idx], idx);
    });
    grid.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target.closest('a, button')) return;
      const card = e.target.closest('.dossier');
      if (!card) return;
      e.preventDefault();
      const idx = Number(card.getAttribute('data-index'));
      openModal(FLAGSHIP[idx], idx);
    });
  }
}

/* ---------- go ---------- */
runPreloader();
initScrollFX();
initPointerFX();
initTilt();
initRotator();
initScramble();
initCatState();
initProjectModal();
