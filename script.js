/* ============================================================
   Portfolio — Script
   ============================================================ */

// ---- Project Data ----
const FLAGSHIP = [
  {
    name: 'Kavach',
    desc: 'Zero-trust runtime policy engine for AI agents',
    fullDesc: 'Zero-trust runtime that sits between AI agents and the system, enforcing deterministic policy checks before any tool call runs, with a tamper-evident audit log of everything it allowed or blocked.',
    stack: 'Rust',
    status: 'Active development',
    statusKey: 'active',
    link: { label: 'github.com/MadB0i/KAVACH', url: 'https://github.com/MadB0i/KAVACH' }
  },
  {
    name: 'RepoProof',
    desc: 'CLI that audits AI-generated repos for quality and security risk',
    fullDesc: 'Local-first CLI that audits AI-generated and fast-shipped repos for quality and security risk before you trust them. Published on npm, MIT licensed.',
    stack: 'Node.js · CLI',
    status: 'Live',
    statusKey: 'live',
    link: { label: 'github.com/MadB0i/RepoProof', url: 'https://github.com/MadB0i/RepoProof' }
  },
  {
    name: 'Pehredar',
    desc: 'Android root and spyware-compliance scanner with live dashboard',
    fullDesc: 'Android root/jailbreak and spyware-compliance scanner with a live device-security dashboard — used for both freelance compliance testing and personal device safety checks.',
    stack: 'Python · Electron',
    status: 'Live',
    statusKey: 'live',
    link: { label: 'github.com/MadB0i/Pehredar', url: 'https://github.com/MadB0i/Pehredar' }
  },
  {
    name: 'C.U.R.E',
    desc: 'Portable USB malware quarantine tool with live scan visualization',
    fullDesc: 'Portable Rust tool that finds and safely quarantines malware persistence mechanisms — registry entries, startup items, scheduled tasks — from a USB stick. No install required, with a live animated scan visualization.',
    stack: 'Rust',
    status: 'MVP shipped',
    statusKey: 'shipped',
    link: { label: 'github.com/MadB0i/C.U.R.E', url: 'https://github.com/MadB0i/C.U.R.E' }
  },
  {
    name: 'TokenGuard',
    desc: 'LLM API reverse proxy with per-project token budgeting',
    fullDesc: 'Reverse proxy that sits in front of LLM APIs (Anthropic, OpenAI, Gemini), tracking token cost per project and cutting off requests once a budget limit is hit.',
    stack: 'Rust · axum',
    status: 'Active development',
    statusKey: 'active',
    link: { label: 'github.com/MadB0i/TokenGuard', url: 'https://github.com/MadB0i/TokenGuard' }
  },
  {
    name: 'Mission Khaki',
    desc: 'Exam-prep app for SSC, Assam Police, Army GD, and Railway aspirants',
    fullDesc: 'Exam-prep app for SSC, Assam Police, Army GD, and Railway aspirants, with thousands of tri-lingual questions, full mock tests, and section-wise scoring. Live on the Play Store (beta).',
    stack: 'Android',
    status: 'Live (beta)',
    statusKey: 'beta',
    link: { label: 'Play Store', url: 'https://play.google.com/store/apps/details?id=com.rupjyoti.missionkhaki' }
  }
];

const SECONDARY = [
  {
    name: 'KavachBench',
    desc: 'Research benchmark testing Kavach\'s policy engine against real prompt-injection and supply-chain attack payloads.',
    stack: 'Research',
    link: null
  },
  {
    name: 'Ustad',
    desc: 'Local studio for distilling/fine-tuning LLMs: teacher via Ollama, student with LoRA/QLoRA, live training graphs, runs on a 4GB consumer GPU.',
    stack: 'Python',
    link: null
  },
  {
    name: 'Wick',
    desc: 'Open-source tool for fine-tuning vision-language models on low-VRAM GPUs by streaming encoder layers between CPU and GPU through the full backward pass.',
    stack: 'Python',
    link: null
  },
  {
    name: 'ShopFloor OS',
    desc: 'Open-source ops tool for small factories and print shops: job cards, downtime logs, wastage tracking, shift handoff.',
    stack: 'Open source',
    link: { label: 'GitHub', url: '#TODO-shopfloor-repo' }
  }
];

// ---- Boot Sequence ----
const BOOT_LINES = [
  { label: 'identity',       result: 'verified',  type: 'verified' },
  { label: 'repositories',   result: '10 indexed', type: 'verified' },
  { label: 'languages',      result: '6 mapped',   type: 'verified' },
  { label: 'projects',       result: '10 found',   type: 'verified' },
  { label: 'toolchain',      result: 'rust · python · node', type: 'verified' },
  { label: 'platform',       result: 'github pages', type: 'verified' },
  { label: 'license',        result: 'mit',        type: 'verified' },
  { label: 'status',         result: 'active',     type: 'active-status' }
];

const STORAGE_KEY = 'portfolio_boot_seen';
const LINE_DELAY = 220;

/* Count a whole number from 0 → target over ~500ms inside a result
   element. Only numbers that already exist in the copy animate. */
function countUp(el, target, duration = 560) {
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runBootSequence() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bootScreen = document.getElementById('boot-screen');
  const hero = document.querySelector('.hero');
  const skipBtn = document.getElementById('boot-skip');

  // Skip if already seen or reduced motion
  if (prefersReduced || localStorage.getItem(STORAGE_KEY)) {
    bootScreen.classList.add('done');
    bootScreen.setAttribute('aria-hidden', 'true');
    hero.classList.add('visible');
    return;
  }

  const lines = bootScreen.querySelectorAll('.boot-line');
  const panel = bootScreen.querySelector('.boot-panel');

  /* Scanning cursor — a thin amber bar that ticks down the sequence,
     then fades out once every line is verified */
  const scan = document.createElement('div');
  scan.className = 'boot-scan';
  panel.appendChild(scan);

  let currentLine = 0;
  let cancelled = false;

  function moveScan(line) {
    const y = line.offsetTop + line.offsetHeight / 2 - scan.offsetHeight / 2;
    scan.style.transform = `translateY(${y}px)`;
  }

  function showNextLine() {
    if (cancelled || currentLine >= lines.length) {
      if (!cancelled) finishBoot(scan);
      return;
    }

    const line = lines[currentLine];
    line.classList.add('show');
    scan.style.opacity = '1';

    setTimeout(() => {
      const entry = BOOT_LINES[currentLine];
      line.classList.add(entry.type);

      /* Result text — resolved here since the result <span>s are
         empty in the markup. Numbers already in the copy count up
         from 0; everything else resolves instantly. */
      const result = line.querySelector('.result');
      const match = entry.result.match(/(\d+)/);
      if (match) {
        const prefix = entry.result.slice(0, match.index);
        const suffix = entry.result.slice(match.index + match[1].length);
        const target = parseInt(match[1], 10);
        result.textContent = `${prefix}0${suffix}`;
        countUp(result, target, 520);
      } else {
        result.textContent = entry.result;
      }

      moveScan(line);
      currentLine++;
      setTimeout(showNextLine, LINE_DELAY);
    }, 60);
  }

  function finishBoot() {
    setTimeout(() => {
      scan.classList.add('hidden');
      setTimeout(() => scan.remove(), 400);
      bootScreen.classList.add('done');
      bootScreen.setAttribute('aria-hidden', 'true');
      hero.classList.add('visible');
      skipBtn.classList.add('hidden');
      localStorage.setItem(STORAGE_KEY, '1');
    }, 400);
  }

  skipBtn.addEventListener('click', () => {
    cancelled = true;
    bootScreen.classList.add('done');
    bootScreen.setAttribute('aria-hidden', 'true');
    hero.classList.add('visible');
    skipBtn.classList.add('hidden');
    localStorage.setItem(STORAGE_KEY, '1');
  });

  // Start after a brief pause
  setTimeout(showNextLine, 300);
}

// ---- Render Ledger ----
function renderFlagshipLedger() {
  const container = document.getElementById('flagship-ledger');
  if (!container) return;

  FLAGSHIP.forEach((project, index) => {
    const row = document.createElement('div');
    row.className = 'project-row scroll-reveal reveal-line';
    row.style.setProperty('--scan-stagger', `${index * 90}ms`);
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-expanded', 'false');

    const main = document.createElement('div');
    main.className = 'project-main';

    const info = document.createElement('div');
    info.className = 'project-info';

    const name = document.createElement('div');
    name.className = 'project-name';
    name.textContent = project.name;

    const desc = document.createElement('div');
    desc.className = 'project-desc';
    desc.textContent = project.desc;

    info.appendChild(name);
    info.appendChild(desc);

    const status = document.createElement('div');
    status.className = 'project-status font-mono';
    status.setAttribute('data-status', project.statusKey);
    status.textContent = project.status;

    main.appendChild(info);
    main.appendChild(status);

    const details = document.createElement('div');
    details.className = 'project-details';

    const detailsInner = document.createElement('div');
    detailsInner.className = 'project-details-inner';

    const detailsContent = document.createElement('div');
    detailsContent.className = 'project-details-content';

    const fullDesc = document.createElement('p');
    fullDesc.className = 'project-full-desc';
    fullDesc.textContent = project.fullDesc;

    const meta = document.createElement('div');
    meta.className = 'project-meta';

    const stack = document.createElement('span');
    stack.className = 'project-stack';
    stack.textContent = project.stack;
    meta.appendChild(stack);

    if (project.link) {
      const links = document.createElement('div');
      links.className = 'project-links';

      const link = document.createElement('a');
      link.className = 'project-link';
      link.href = project.link.url;
      link.textContent = project.link.label;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', (e) => e.stopPropagation());
      links.appendChild(link);
      meta.appendChild(links);
    }

    detailsContent.appendChild(fullDesc);
    detailsContent.appendChild(meta);
    detailsInner.appendChild(detailsContent);
    details.appendChild(detailsInner);

    row.appendChild(main);
    row.appendChild(details);

    // Expand/collapse
    function toggle() {
      const isExpanded = row.classList.contains('expanded');
      row.classList.toggle('expanded');
      details.classList.toggle('open');
      row.setAttribute('aria-expanded', !isExpanded);
    }

    main.addEventListener('click', toggle);
    main.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    container.appendChild(row);
  });
}

// ---- Scroll Reveal ----
/* One IntersectionObserver adds .revealed to every .scroll-reveal
   element the moment it enters the viewport. Stagger comes from the
   per-element --scan-stagger custom property (see renderers). */
function initScrollReveals() {
  const targets = document.querySelectorAll('.scroll-reveal');
  if (!targets.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const row = entry.target;
        /* Set the sweep distance before revealing so the wipe reads it */
        if (row.classList.contains('reveal-line')) {
          row.style.setProperty('--bar-sweep', `${row.offsetWidth + 140}px`);
        }
        row.classList.add('revealed');
        observer.unobserve(row);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  targets.forEach((el) => observer.observe(el));
}

// ---- Row Hover Sight Line ----
/* Points-only: tracks the pointer's Y inside each project row and
   moves the 2px amber contrail via --gy. Guarded by an rAF flag so a
   fast-moving mouse only re-renders once per frame. Touch/coarse
   pointers never attach a listener; they get the static hover. */
let hoverTick = false;
function initRowHoverTracking() {
  const ledger = document.getElementById('flagship-ledger');
  if (!ledger) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  ledger.addEventListener('mousemove', (e) => {
    if (hoverTick) return;
    hoverTick = true;
    requestAnimationFrame(() => {
      hoverTick = false;
      const row = e.target.closest('.project-row');
      if (!row) return;
      const rect = row.getBoundingClientRect();
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      row.style.setProperty('--gy', `${y}px`);
    });
  });
}

function renderSecondaryList() {
  const container = document.getElementById('secondary-list');
  if (!container) return;

  SECONDARY.forEach((project, index) => {
    const item = document.createElement('li');
    item.className = 'secondary-item scroll-reveal reveal-fade';
    item.style.setProperty('--scan-stagger', `${index * 70}ms`);

    const name = document.createElement('span');
    name.className = 'secondary-name';
    name.textContent = project.name;

    const desc = document.createElement('span');
    desc.className = 'secondary-desc';
    desc.textContent = project.desc;

    const stack = document.createElement('span');
    stack.className = 'secondary-stack font-mono';
    stack.textContent = project.stack;

    item.appendChild(name);
    item.appendChild(desc);
    item.appendChild(stack);

    if (project.link) {
      const link = document.createElement('a');
      link.className = 'secondary-link';
      link.href = project.link.url;
      link.textContent = project.link.label;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      item.appendChild(link);
    }

    container.appendChild(item);
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  runBootSequence();
  renderFlagshipLedger();
  renderSecondaryList();
  initScrollReveals();
  initRowHoverTracking();
});
