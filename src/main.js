import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { STATS, MARQUEE, FLAGSHIP, SECONDARY, SKILLS, TIMELINE, THREAT_FEED } from './data/site.js';
import { diagramSVG, miniSVG } from './diagrams.js';


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
  SKILLS.forEach((s, si) => {
    const card = document.createElement('div');
    card.className = `glass rounded-2xl p-6 sm:p-7 spot-card tilt ${s.wide ? 'sm:col-span-2 lg:col-span-1' : ''}`;
    card.setAttribute('data-reveal-3d', '');
    card.setAttribute('data-tilt-dir', String(si % 2 === 0 ? -1 : 1));
    card.innerHTML = `
      <div class="flex items-start justify-between mb-5">
        <span class="skill-icon">${s.icon}</span>
        <span class="font-mono text-xs text-sig/90">${s.index}</span>
      </div>
      ${s.media || s.accent || s.cover ? `<div class="skill-visual">${s.cover ? `<div class="cover cover-${s.cover} cover-mini" aria-hidden="true"><span class="cover-grid"></span><span class="cover-glyph">${s.index}</span></div>` : ''}${s.media || s.accent}</div>` : ''}
      <h3 class="font-display font-medium text-xl mb-2">${s.title}</h3>
      <p class="text-sm text-fog mb-5">${s.desc}</p>
      <div class="flex flex-wrap gap-2 mb-5">${s.tags.map((t) => `<span class="chip">${t}</span>`).join('')}</div>
      <p class="skill-proof">▸ ${s.proof}</p>`;
    grid.appendChild(card);
  });
}

function coverInner(p, i, live = false, tag = 'FILE') {
  const fileNo = String(i + 1).padStart(2, '0');
  return `
        <div class="cover cover-${p.cover}" role="img" aria-label="${p.name} cover art">
          <span class="cover-grid"></span>
          <div class="cover-diagram">${diagramSVG(p.diagram)}</div>
          <span class="cover-marker">${p.glyph}</span>
          <span class="cover-index">${tag} ${fileNo}</span>
          ${live ? '<span class="cover-live">● LIVE</span>' : ''}
          <span class="cover-sweep"></span>
        </div>`;
}

const MINI_COVERS = { bench: 'amber', ustad: 'ice', wick: 'bone', shop: 'ember' };

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
    card.setAttribute('data-reveal-3d', '');
    card.setAttribute('data-agent', p.agent || 'OPEN PROJECT');
    card.innerHTML = `
      <div class="p-media ${p.featured ? 'h-64 sm:h-80' : 'h-52 sm:h-60'}" data-media>
${coverInner(p, i, p.featured)}
      </div>
      <span class="dossier-open" aria-hidden="true">↗</span>
      <div class="flex items-start justify-between gap-4 mb-5 mt-5">
        <span class="status-pill" data-status="${p.statusKey}">${p.status}</span>
        <span class="font-mono text-xs text-fog/70">${p.stack[0]}</span>
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
    card.className = 'border hairline rounded-2xl p-5 sm:p-6 spot-card hover:border-sig/40 transition-colors bg-panel/40 overflow-hidden';
    card.setAttribute('data-reveal', '');
    card.setAttribute('data-agent', p.agent || 'ARCHIVE');
    card.innerHTML = `
      <div class="mini-strip" role="img" aria-label="${p.name} diagram">
        <div class="cover cover-${MINI_COVERS[p.mini] || 'bone'}">
          <span class="cover-grid"></span>
          <div class="cover-diagram">${miniSVG(p.mini)}</div>
          <span class="cover-sweep"></span>
        </div>
      </div>
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

/* ---------- hero WebGL scene (lazy chunk) ---------- */
let heroScene = null;
const hero3d = document.getElementById('hero-3d');
if (hero3d) {
  import('./three/heroScene.js').then(({ initHeroScene }) => {
    heroScene = initHeroScene(hero3d, { reduced: REDUCED });
  });
}

/* ---------- contact dot-globe (lazy chunk) ---------- */
let globeScene = null;
const globeEl = document.getElementById('contact-globe');
if (globeEl) {
  import('./three/globe.js').then(({ initGlobe }) => {
    globeScene = initGlobe(globeEl, { reduced: REDUCED });
  });
}

/* Pause WebGL loops while their sections are offscreen. */
function watchVisible(sectionId, getScene) {
  if (!('IntersectionObserver' in window) || REDUCED) return;
  const sec = document.getElementById(sectionId);
  if (!sec) return;
  new IntersectionObserver(
    ([entry]) => {
      const s = getScene();
      if (s && s.setVisible) s.setVisible(entry.isIntersecting);
    },
    { threshold: 0 },
  ).observe(sec);
}
watchVisible('top', () => heroScene);
watchVisible('contact', () => globeScene);

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

const BOOT_LINES = [
  { text: '$ perimeter scan --all', color: '#A8A29E' },
  { text: '$ intrusion detected :: tracing source', color: '#ff5d6e' },
  { text: '$ isolating threat vector …', color: '#ff5d6e' },
  { text: '$ threat neutralized ✓', color: '#F5A524' },
];

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
  word.textContent = BOOT_LINES[0].text;
  word.style.color = BOOT_LINES[0].color;
  const wordTimer = setInterval(() => {
    wi = (wi + 1) % BOOT_LINES.length;
    word.textContent = BOOT_LINES[wi].text;
    // Grey while scanning, red while hostile, green once neutralized.
    word.style.color = BOOT_LINES[wi].color;
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

  /* 3D entrances — dossiers swing up, skill cards flip in, terminal tilts */
  gsap.utils.toArray('[data-reveal-3d]').forEach((el) => {
    if (REDUCED) return;
    const dir = Number(el.dataset.tiltDir || 0);
    const origin = el.dataset.origin || 'center top';
    const from = dir
      ? { opacity: 0, y: 50, rotateY: 10 * dir, transformPerspective: 1000, transformOrigin: 'center' }
      : { opacity: 0, y: 70, rotateX: 12, transformPerspective: 1000, transformOrigin: origin };
    gsap.fromTo(
      el,
      from,
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });

  /* footer giant-type drift */
  if (!REDUCED) {
    const outline = document.querySelector('.outline-text');
    if (outline) {
      gsap.fromTo(
        outline,
        { xPercent: 2 },
        {
          xPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      );
    }
  }

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

    /* scroll scanner sweeping down the kill-chain */
    const scan = document.getElementById('tl-scan');
    const tl = document.getElementById('timeline');
    if (scan && tl) {
      gsap.fromTo(
        scan,
        { top: 0, opacity: 0 },
        {
          top: '100%',
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#journey',
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.6,
          },
        },
      );
    }
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
    const pad = el.dataset.pad === '1';
    const fmt = (v) => (pad ? String(v).padStart(2, '0') : String(v));
    if (REDUCED) {
      el.textContent = fmt(Number(el.dataset.count));
      return;
    }
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        // Read target lazily so live GitHub data (arriving later) still counts up correctly.
        const target = Number(el.dataset.count);
        gsap.to(obj, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = fmt(Math.round(obj.v));
          },
        });
      },
    });
  });

  // Hero parallax-out
  if (!REDUCED) {
    gsap.to('#top > .hero-grid', {
      y: -70,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true },
    });
    if (!REDUCED) {
      gsap.to('#hero-3d', {
        y: -140,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#top',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (heroScene && heroScene.setScroll) heroScene.setScroll(self.progress);
          },
        },
      });
    }
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

  // RT_ system cursor — dot tracks instantly, label interpolates behind.
  // Idle a while and the label rests away, leaving just the dot.
  const dot = document.getElementById('cursor-dot');
  const label = document.getElementById('cursor-label');
  const sub = document.getElementById('cursor-sub');
  const dx = gsap.quickSetter(dot, 'x', 'px');
  const dy = gsap.quickSetter(dot, 'y', 'px');
  const lx = gsap.quickSetter(label, 'x', 'px');
  const ly = gsap.quickSetter(label, 'y', 'px');
  const pos = { x: -100, y: -100, lx: -100, ly: -100 };
  let idleTimer = 0;
  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
    dx(pos.x - 3);
    dy(pos.y - 3);
    label.classList.add('is-live');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => label.classList.remove('is-live'), 2500);
  }, { passive: true });
  gsap.ticker.add(() => {
    pos.lx += (pos.x - pos.lx) * 0.2;
    pos.ly += (pos.y - pos.ly) * 0.2;
    const flip = pos.x > window.innerWidth - 130;
    label.classList.toggle('flip', flip);
    lx(pos.lx + (flip ? -14 : 16));
    ly(pos.ly + 18);
  });

  // Context sub-labels — delegated, so dynamic content (modal) works too.
  const CONNECT_SEL = '#copy-email, a[href="#contact"]';
  function cursorContext(t) {
    if (!t || !t.closest) return '';
    if (t.closest(CONNECT_SEL)) return 'CONNECT';
    if (t.closest('a[target="_blank"], a[href^="http"]')) return 'LAUNCH ↗';
    if (t.closest('.dossier')) return 'INSPECT';
    if (t.closest('a, button')) return 'OPEN →';
    return '';
  }
  document.addEventListener('pointerover', (e) => {
    const ctx = cursorContext(e.target);
    if (ctx) {
      if (sub.textContent !== ctx) sub.textContent = ctx;
      label.classList.add('has-sub');
    } else {
      label.classList.remove('has-sub');
    }
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
        card.style.setProperty('--px', (px - 0.5).toFixed(3));
        card.style.setProperty('--py', (py - 0.5).toFixed(3));
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

/* ---------- interactive terminal ---------- */
function initTerminal() {
  const out = document.getElementById('term-out');
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-in');
  const shell = document.getElementById('term-shell');
  if (!out || !form || !input) return;

  const PROMPT = 'visitor@rt:~$';
  const hist = [];
  let hi = -1;

  function print(html) {
    const d = document.createElement('div');
    d.className = 'term-line';
    d.innerHTML = html;
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }
  function echo(cmd) {
    const d = document.createElement('div');
    d.className = 'term-line';
    const p = document.createElement('span');
    p.className = 't-prompt';
    p.textContent = `${PROMPT} `;
    const c = document.createElement('span');
    c.className = 't-cmd';
    c.textContent = cmd;
    d.append(p, c);
    out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  }

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  const COMMANDS = {
    help() {
      return `<span class="t-ok">available commands:</span>
  <span class="t-cmd">about</span>      who is this guy
  <span class="t-cmd">skills</span>     weapons of choice
  <span class="t-cmd">projects</span>   flagship builds
  <span class="t-cmd">journey</span>    how he got here
  <span class="t-cmd">contact</span>    open a secure channel
  <span class="t-cmd">github</span>     github.com/MadB0i
  <span class="t-cmd">cat</span>        pet the cat
  <span class="t-cmd">whoami</span>     check clearance
  <span class="t-cmd">date</span>       system time
  <span class="t-cmd">clear</span>      wipe the shell`;
    },
    about() {
      return `Rupjyoti Talukdar — independent developer, Assam IN.
zero-trust runtimes · malware forensics · LLM infra.
<span class="t-dim">mode: solo · ships tested code · open to work</span>`;
    },
    skills() {
      return SKILLS.map((s) => `<span class="t-ok">▸ ${esc(s.title)}</span> — ${esc(s.tags.slice(0, 4).join(' · '))}`).join('\n');
    },
    projects() {
      return FLAGSHIP.map((p, i) => `<span class="t-ok">[${String(i + 1).padStart(2, '0')}] ${esc(p.name)}</span> — ${esc(p.desc)} <span class="t-dim">(${esc(p.status)})</span>`).join('\n')
        + `\n<span class="t-dim">full dossiers in the THREAT FILES section below ↓</span>`;
    },
    journey() {
      return TIMELINE.map((t) => `<span class="t-ok">${esc(t.period)}</span>  ${esc(t.title)} <span class="t-dim">— ${esc(t.org)}</span>`).join('\n');
    },
    contact() {
      return `email   <a href="mailto:contact.rupjyoti26@gmail.com">contact.rupjyoti26@gmail.com</a>
github  <a href="https://github.com/MadB0i" target="_blank" rel="noopener">github.com/MadB0i</a>
<span class="t-dim">or scroll down to the SECURE CHANNEL section.</span>`;
    },
    github() {
      return `opening <a href="https://github.com/MadB0i" target="_blank" rel="noopener">github.com/MadB0i ↗</a>`;
    },
    whoami() {
      return `visitor — clearance: <span class="t-warn">GUEST</span> (the cat is watching you)`;
    },
    date() {
      return esc(new Date().toString());
    },
    cat() {
      return `<span class="t-ok"> /\\_/\\
( o.o )
 &gt; ^ &lt;</span>  <span class="t-dim">— hiss acknowledged. threat level: adorable.</span>`;
    },
    sudo() {
      return `<span class="t-err">permission denied.</span> <span class="t-dim">nice try, visitor.</span>`;
    },
  };

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    echo(raw.trim());
    if (!cmd) return;
    if (cmd === 'clear') {
      out.innerHTML = '';
      return;
    }
    if (COMMANDS[cmd]) print(COMMANDS[cmd]());
    else print(`<span class="t-err">command not found:</span> ${esc(cmd)} <span class="t-dim">— try 'help'</span>`);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    if (v.trim()) {
      hist.unshift(v);
      if (hist.length > 50) hist.pop();
    }
    hi = -1;
    run(v);
    input.value = '';
    input.focus();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hi < hist.length - 1) {
        hi += 1;
        input.value = hist[hi] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hi > 0) {
        hi -= 1;
        input.value = hist[hi] || '';
      } else {
        hi = -1;
        input.value = '';
      }
    }
  });
  if (shell) {
    shell.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (window.getSelection()?.toString()) return;
      input.focus({ preventScroll: true });
    });
  }

  /* boot text once visible */
  let booted = false;
  const boot = () => {
    if (booted) return;
    booted = true;
    print(`<span class="t-ok">● rt shell v2.4 — secure channel established</span>`);
    print(`<span class="t-dim">type <span class="t-cmd">help</span> to interrogate. type <span class="t-cmd">cat</span> at your own risk.</span>`);
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (en) => {
        if (en[0].isIntersecting) {
          boot();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(shell || out);
  } else {
    boot();
  }
}

/* ---------- live github stats ---------- */
function initLiveStats() {
  const wrap = document.querySelector('[data-hero="stats"]');
  if (!wrap) return;
  const KEY = 'rt_gh_cache_v1';
  const TTL = 6 * 3600 * 1000;

  const ago = (iso) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 90) return 'just now';
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return `${Math.floor(d / 30)}mo ago`;
  };

  const apply = (data) => {
    const cells = wrap.querySelectorAll(':scope > div');
    if (cells[0]) {
      const el = cells[0].querySelector('[data-count]');
      if (el) {
        el.dataset.count = String(data.repos);
        if (REDUCED) el.textContent = String(data.repos).padStart(2, '0');
      }
    }
    if (cells[1]) {
      const el = cells[1].querySelector('[data-count]');
      if (el) {
        el.dataset.count = String(data.langs);
        if (REDUCED) el.textContent = String(data.langs).padStart(2, '0');
      }
    }
    if (!document.getElementById('live-stats-line')) {
      const p = document.createElement('p');
      p.id = 'live-stats-line';
      p.className = 'font-mono text-[0.68rem] text-fog/80 mt-4 col-span-full';
      p.innerHTML = `<span class="live-dot"></span>live · ${data.stars}★ total · pushed ${ago(data.pushed)}`;
      wrap.after(p);
    }
  };

  try {
    const cached = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (cached && Date.now() - cached.ts < TTL) {
      apply(cached.data);
      return;
    }
  } catch { /* ignore */ }

  Promise.all([
    fetch('https://api.github.com/users/MadB0i').then((r) => {
      if (!r.ok) throw new Error('gh user');
      return r.json();
    }),
    fetch('https://api.github.com/users/MadB0i/repos?per_page=100&sort=pushed').then((r) => {
      if (!r.ok) throw new Error('gh repos');
      return r.json();
    }),
  ])
    .then(([user, repos]) => {
      const own = Array.isArray(repos) ? repos.filter((r) => !r.fork) : [];
      const data = {
        repos: own.length || user.public_repos || 0,
        stars: own.reduce((a, r) => a + (r.stargazers_count || 0), 0),
        langs: new Set(own.map((r) => r.language).filter(Boolean)).size || 0,
        pushed: (own[0] && own[0].pushed_at) || user.updated_at,
      };
      try {
        localStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), data }));
      } catch { /* ignore */ }
      apply(data);
    })
    .catch(() => { /* offline / rate-limited → keep static numbers */ });
}

/* ---------- work-section agent ---------- */
function initWorkAgent() {
  const hud = document.getElementById('work-agent');
  const msg = document.getElementById('agent-msg');
  const eyes = document.getElementById('wa-eyes');
  const DEFAULT_MSG = 'OBSERVING';
  if (msg) msg.textContent = DEFAULT_MSG;

  document.querySelectorAll('#projects-grid [data-agent], #shipped-grid [data-agent]').forEach((card) => {
    card.addEventListener('pointerenter', () => {
      if (msg) msg.textContent = card.getAttribute('data-agent') || DEFAULT_MSG;
      hud?.classList.add('agent-alert');
    });
    card.addEventListener('pointerleave', () => {
      if (msg) msg.textContent = DEFAULT_MSG;
      hud?.classList.remove('agent-alert');
    });
  });

  if (!hud || !eyes || REDUCED || !FINE_POINTER) return;
  /* subtle eye follow — lerped, idle when settled */
  let raf = 0;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('pointermove', (e) => {
    const r = hud.getBoundingClientRect();
    if (!r.width) return;
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const m = Math.hypot(dx, dy) || 1;
    const k = Math.min(m / 300, 1) * 1.6;
    tx = (dx / m) * k;
    ty = (dy / m) * k;
    if (!raf) raf = requestAnimationFrame(apply);
  }, { passive: true });
  function apply() {
    raf = 0;
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    eyes.setAttribute('transform', `translate(${cx.toFixed(2)} ${cy.toFixed(2)})`);
    if (Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) raf = requestAnimationFrame(apply);
  }
}

/* ============================================================
   RT_ SYSTEM SPACE — one continuous 3D environment (visual only).
   #space-world is the camera rig: scrubbing its translateZ moves
   a real perspective camera through objects at true Z depths.
   Near objects rush past, far objects crawl — genuine parallax,
   no flat scaling. Native scroll/anchors/keyboard untouched.
   ============================================================ */
function initDive() {
  const layer = document.getElementById('dive-layer');
  if (!layer || REDUCED) return;
  const world = document.getElementById('space-world');
  const space = document.getElementById('space');
  const sweep = document.getElementById('dive-sweep');
  const hud = document.getElementById('dive-hud');
  const hudText = document.getElementById('dive-hud-text');
  const chipsBox = document.getElementById('space-chips');
  const nodes = document.getElementById('space-nodes');
  if (!world || !space || !hud || !hudText) return;

  const MOBILE = window.matchMedia('(max-width: 767px)').matches;

  /* depth particle field: FAR / MID / NEAR spread across Z.
     Perspective projection moves each band at its true speed. */
  const COUNT = MOBILE ? 14 : 34;
  for (let k = 0; k < COUNT; k++) {
    const band = k % 3; // 0 far · 1 mid · 2 near
    const z = band === 0
      ? -700 + Math.random() * 250
      : band === 1
        ? -380 + Math.random() * 220
        : -120 + Math.random() * 220;
    const size = band === 0 ? 2 + Math.random() * 1.5 : band === 1 ? 2.5 + Math.random() * 2 : 3.5 + Math.random() * 2.5;
    const d = document.createElement('span');
    d.className = `sp${Math.random() < 0.25 ? ' sp-ice' : ''}`;
    d.style.cssText = `left:${4 + Math.random() * 92}%;top:${6 + Math.random() * 88}%;`
      + `width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;`
      + `opacity:${(0.25 + Math.random() * 0.5).toFixed(2)};`
      + `transform:translate(-50%,-50%) translateZ(${Math.round(z)}px);`
      + `box-shadow:0 0 ${(4 + size).toFixed(0)}px 0 rgb(var(--sig-rgb) / 0.35);`;
    world.appendChild(d);
  }

  /* ghost project modules at staggered depths (skills→work only) */
  const CHIPS = [
    { t: 'KAVACHBENCH', x: 50, y: 30, z: -440, ice: false },
    { t: 'MISSION KHAKI', x: 50, y: 52, z: -340, ice: false },
    { t: 'USTAD', x: 30, y: 68, z: -190, ice: true },
    { t: 'WICK', x: 70, y: 68, z: -160, ice: true },
  ];
  if (chipsBox) {
    CHIPS.forEach((c) => {
      const el = document.createElement('span');
      el.className = `sp-chip${c.ice ? ' sp-chip-ice' : ''}`;
      el.style.left = `${c.x}%`;
      el.style.top = `${c.y}%`;
      el.style.setProperty('--z', `${c.z}px`);
      el.textContent = c.t;
      chipsBox.appendChild(el);
    });
  }

  gsap.set(world, { z: -250 });
  gsap.set(space, { opacity: 0 });
  gsap.set(hud, { opacity: 0 });
  if (chipsBox) gsap.set(chipsBox, { opacity: 0 });

  const agentMsg = document.getElementById('agent-msg');
  const agentHud = document.getElementById('work-agent');
  function shiftNote(on, label) {
    if (agentMsg) {
      if (on) {
        if (agentMsg.textContent !== label) agentMsg.textContent = label;
      } else if (agentMsg.textContent === label) {
        agentMsg.textContent = 'OBSERVING';
      }
    }
    if (agentHud) agentHud.classList.toggle('agent-alert', !!on && !!label);
  }

  /* Camera model: world translateZ -250 (far) → +650 (through).
     Core sits at local z=-120: crossed at ~40% — the midpoint
     penetration. Journey→contact runs deeper to reach the point. */
  const BOUNDS = [
    { trigger: '#terminal', label: '[ 01 → 02 ]', from: -250, to: 650 },
    { trigger: '#skills', label: '[ 02 → 03 ]', from: -250, to: 650 },
    { trigger: '#work', label: '[ 03 → 04 ]', mode: 'modules', from: -250, to: 650, shift: 'SHIFT → 04' },
    { trigger: '#journey', label: '[ 04 → 05 ]', from: -250, to: 650, shift: 'SHIFT → 05' },
    { trigger: '#contact', label: '[ 05 → 06 ] · LINK', from: -100, to: 850 },
  ];

  BOUNDS.forEach((b) => {
    const sec = document.querySelector(b.trigger);
    if (!sec) return;
    const range = MOBILE ? { from: -80, to: 120 } : { from: b.from, to: b.to };
    const tl = gsap.timeline({
      defaults: { ease: 'none', overwrite: 'auto' },
      scrollTrigger: {
        trigger: sec,
        start: 'top 94%',
        end: 'top 32%',
        scrub: MOBILE ? true : 0.5,
        onUpdate: (self) => {
          const active = self.progress > 0.03 && self.progress < 0.97;
          if (b.shift) shiftNote(active, b.shift);
          if (active) hudText.textContent = b.label;
        },
      },
    });

    /* camera push-through — the depth move everything else hangs on.
       The space itself fades in/out so 3D lives only in transitions. */
    tl.fromTo(world, { z: range.from }, { z: range.to, duration: 1 }, 0);
    tl.fromTo(space, { opacity: 0 }, { opacity: MOBILE ? 0.55 : 1, duration: 0.15 }, 0)
      .to(space, { opacity: 0, duration: 0.15 }, 0.85);

    if (!MOBILE) {
      tl.fromTo(sweep, { xPercent: -170 }, { xPercent: 340, duration: 1 }, 0);
    }
    tl.fromTo(hud, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.45)
      .to(hud, { opacity: 0, duration: 0.1 }, 0.55);

    if (b.mode === 'modules' && chipsBox && !MOBILE) {
      /* nodes collapse, modules emerge at staggered depths, then pass */
      if (nodes) {
        tl.fromTo(nodes, { opacity: 0.4, scale: 1 }, { opacity: 0, scale: 0.35, duration: 0.35 }, 0)
          .to(nodes, { opacity: 0.4, scale: 1, duration: 0.4 }, 0.6);
      }
      tl.fromTo(chipsBox, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.15)
        .to(chipsBox, { opacity: 0, duration: 0.2 }, 0.8);
    }
  });
}

/* ============================================================
   SECTION DEPTH — the sections themselves move through 3D space.
   Each major section gets one scrubbed keyframe timeline across
   its full viewport traverse: enter from depth → dwell at identity
   → tilt back and recede on exit. Uses per-element
   transformPerspective (no ancestor side effects: sticky dossiers,
   fixed nav/modal, and Lenis/anchors/keyboard all untouched).
   ============================================================ */
function initSectionDepth() {
  if (REDUCED) return;
  const MOBILE = window.matchMedia('(max-width: 767px)').matches;
  const RX = MOBILE ? 3 : 7;
  const Z = MOBILE ? -60 : -150;
  const MIN_OP = MOBILE ? 0.7 : 0.45;
  const tls = {};
  ['#top', '#terminal', '#about', '#skills', '#work', '#journey', '#contact'].forEach((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const tl = gsap.timeline({
      defaults: { ease: 'none', overwrite: 'auto' },
      scrollTrigger: {
        trigger: el,
        start: 'top 96%',
        end: 'bottom 4%',
        scrub: MOBILE ? true : 0.5,
      },
    });
    tl.fromTo(
      el,
      { rotateX: -RX, z: Z, opacity: MIN_OP, transformPerspective: 750, transformOrigin: '50% 50%' },
      { rotateX: 0, z: 0, opacity: 1, duration: 0.3 },
      0,
    ).to(
      el,
      { rotateX: RX, z: Z, opacity: MIN_OP, duration: 0.3 },
      0.7,
    );
    tls[sel] = tl;
  });

  if (MOBILE) return; // mobile keeps fade + small tilt only
  const q = (s) => document.querySelector(s);

  function addOverlay(sel, cls, inner = '') {
    const host = q(sel);
    if (!host) return null;
    const d = document.createElement('div');
    d.className = `sec-overlay ${cls}`;
    d.setAttribute('aria-hidden', 'true');
    if (inner) d.innerHTML = inner;
    host.appendChild(d);
    return d;
  }

  /* top → terminal/about: handshake flicker on entry */
  ['#terminal', '#about'].forEach((sel) => {
    const scanEl = addOverlay(sel, 'sec-scan');
    const tl = tls[sel];
    if (!scanEl || !tl) return;
    tl.to(scanEl, { opacity: 0.55, duration: 0.04 }, 0)
      .to(scanEl, { opacity: 0.08, duration: 0.05 }, 0.04)
      .to(scanEl, { opacity: 0.4, duration: 0.05 }, 0.09)
      .to(scanEl, { opacity: 0, duration: 0.08 }, 0.14);
  });

  /* terminal → skills: hex wireframe draw-in (extends #space-nodes motif) */
  {
    const hex = (cx, cy, r) => {
      let p = '';
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k + Math.PI / 6;
        p += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
      }
      return `<polygon points="${p.trim()}" pathLength="100" />`;
    };
    const svg = `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`
      + hex(18, 30, 13) + hex(52, 52, 17) + hex(84, 28, 12) + hex(30, 76, 14) + hex(70, 78, 13)
      + `</svg>`;
    const hexEl = addOverlay('#skills', 'sec-hex', svg);
    const tl = tls['#skills'];
    if (hexEl && tl) {
      tl.to(hexEl.querySelectorAll('polygon'), { strokeDashoffset: 0, duration: 0.22, stagger: 0.02 }, 0)
        .to(hexEl, { opacity: 0, duration: 0.08 }, 0.26);
    }
  }

  /* skills → work: project grid emerges from depth as the primary move */
  {
    const grid = q('#projects-grid');
    const tl = tls['#work'];
    if (grid && tl) {
      tl.fromTo(
        grid,
        { z: -260, opacity: 0.3, transformPerspective: 750 },
        { z: 0, opacity: 1, duration: 0.3 },
        0,
      );
    }
  }

  /* work → journey: glowing trace sweeps down with scroll direction */
  {
    const journey = q('#journey');
    const tl = tls['#journey'];
    if (journey && tl) {
      const traceEl = addOverlay('#journey', 'sec-trace');
      if (traceEl) {
        const travel = journey.clientHeight + 160;
        tl.fromTo(traceEl, { opacity: 0, y: -80 }, { opacity: 1, y: travel * 0.4, duration: 0.12 }, 0)
          .to(traceEl, { opacity: 1, y: travel, duration: 0.18 }, 0.12)
          .to(traceEl, { opacity: 0, duration: 0.05 }, 0.28);
      }
    }
  }

  /* journey → contact: encrypted-handshake glitch on the heading as it settles */
  {
    const h2 = q('#contact h2.mega');
    if (h2 && 'IntersectionObserver' in window) {
      const GLYPHS = '$>_#%:;@&|~^!?=[]{}';
      let played = false;
      ScrollTrigger.create({
        trigger: h2,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          if (played) return;
          played = true;
          const texts = [];
          const walker = document.createTreeWalker(h2, NodeFilter.SHOW_TEXT);
          let n;
          while ((n = walker.nextNode())) {
            if (n.textContent.trim().length > 3) texts.push(n);
          }
          if (!texts.length) return;
          const orig = texts.map((t) => t.textContent);
          const start = performance.now();
          const dur = 650;
          (function tick(now) {
            const t = Math.min(((now ?? start) - start) / dur, 1);
            texts.forEach((node, idx) => {
              const o = orig[idx];
              const reveal = Math.floor(t * o.length);
              let out = '';
              for (let i = 0; i < o.length; i++) {
                out += i < reveal || o[i] === ' ' ? o[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
              }
              node.textContent = out;
            });
            if (t < 1) requestAnimationFrame(tick);
          })(start);
        },
      });
    }
  }
}

/* ---------- text scramble (secure-channel line) ---------- */function initScramble() {
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
    if (!heroVisible || !trackingActive || (state !== 'idle' && state !== 'curious' && state !== 'alert')) {
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
  // Skip DOM work while the hero is offscreen (loop stays cheap).
  let heroVisible = true;
  if ('IntersectionObserver' in window && heroSection) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
    }, { threshold: 0 }).observe(heroSection);
  }
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
${coverInner(p, i, p.featured, 'CASE')}
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
initScramble();
initCatState();
initProjectModal();
initTerminal();
initLiveStats();
initWorkAgent();
initDive();
initSectionDepth();
