/* Central content for the portfolio — edit copy here, layout stays untouched. */

export const ROLES = [
  'zero-trust runtimes',
  'malware forensics',
  'LLM infrastructure',
  'android security',
];

export const STATS = [
  { value: 10, suffix: '+', label: 'Projects shipped' },
  { value: 6, suffix: '', label: 'Languages in use', pad: true },
  { value: 4, suffix: '', label: 'Live products', pad: true },
  { value: 1, suffix: '', label: 'Solo developer', pad: true },
];

export const MARQUEE = [
  'Rust',
  'Python',
  'Node.js',
  'Axum',
  'Electron',
  'Ollama',
  'Android',
  'TypeScript',
  'GitHub Actions',
  'Play Store',
];

export const FLAGSHIP = [
  {
    name: 'Kavach',
    desc: 'Zero-trust runtime policy engine for AI agents',
    fullDesc:
      'Zero-trust runtime that sits between AI agents and the system, enforcing deterministic policy checks before any tool call runs — with a tamper-evident audit log of everything it allowed or blocked.',
    stack: ['Rust', 'Policy Engine', 'Audit Log'],
    status: 'Active development',
    statusKey: 'active',
    featured: true,
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    alt: 'Digital padlock over a circuit board — zero-trust security',
    link: { label: 'GitHub', url: 'https://github.com/MadB0i/KAVACH' },
  },
  {
    name: 'RepoProof',
    desc: 'CLI that audits AI-generated repos for quality and security risk',
    fullDesc:
      'Local-first CLI that audits AI-generated and fast-shipped repos for quality and security risk before you trust them. Published on npm, MIT licensed.',
    stack: ['Node.js', 'CLI', 'npm'],
    status: 'Live',
    statusKey: 'live',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    alt: 'Source code on a monitor — CLI audit tooling',
    link: { label: 'GitHub', url: 'https://github.com/MadB0i/RepoProof' },
  },
  {
    name: 'Pehredar',
    desc: 'Android root and spyware-compliance scanner with live dashboard',
    fullDesc:
      'Android root/jailbreak and spyware-compliance scanner with a live device-security dashboard — used for both freelance compliance testing and personal device safety checks.',
    stack: ['Python', 'Electron', 'Android'],
    status: 'Live',
    statusKey: 'live',
    img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
    alt: 'Hand holding a smartphone — mobile device security',
    link: { label: 'GitHub', url: 'https://github.com/MadB0i/Pehredar' },
  },
  {
    name: 'C.U.R.E',
    desc: 'Portable USB malware quarantine tool with live scan visualization',
    fullDesc:
      'Portable Rust tool that finds and safely quarantines malware persistence mechanisms — registry entries, startup items, scheduled tasks — from a USB stick. No install required, with a live animated scan visualization.',
    stack: ['Rust', 'Forensics', 'USB'],
    status: 'MVP shipped',
    statusKey: 'shipped',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    alt: 'Macro shot of a circuit board — hardware forensics',
    link: { label: 'GitHub', url: 'https://github.com/MadB0i/C.U.R.E' },
  },
  {
    name: 'TokenGuard',
    desc: 'LLM API reverse proxy with per-project token budgeting',
    fullDesc:
      'Reverse proxy that sits in front of LLM APIs (Anthropic, OpenAI, Gemini), tracking token cost per project and cutting off requests once a budget limit is hit.',
    stack: ['Rust', 'Axum', 'LLM APIs'],
    status: 'Active development',
    statusKey: 'active',
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    alt: 'Server racks in a data center — API infrastructure',
    link: { label: 'GitHub', url: 'https://github.com/MadB0i/TokenGuard' },
  },
  {
    name: 'Mission Khaki',
    desc: 'Exam-prep app for SSC, Assam Police, Army GD and Railway aspirants',
    fullDesc:
      'Exam-prep app for SSC, Assam Police, Army GD and Railway aspirants, with thousands of tri-lingual questions, full mock tests and section-wise scoring. Live on the Play Store.',
    stack: ['Android', 'Play Store', 'i18n'],
    status: 'Live',
    statusKey: 'live',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
    alt: 'Study notes and writing — exam preparation',
    link: {
      label: 'Play Store',
      url: 'https://play.google.com/store/apps/details?id=com.rupjyoti.missionkhaki',
    },
  },
];

export const SECONDARY = [
  {
    name: 'KavachBench',
    desc: 'Research benchmark testing the Kavach policy engine against real prompt-injection and supply-chain attack payloads.',
    stack: 'Research',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1" fill="currentColor"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke-width="1.4"/></svg>',
  },
  {
    name: 'Ustad',
    desc: 'Local studio for distilling and fine-tuning LLMs — teacher via Ollama, student with LoRA/QLoRA, live training graphs, runs on a 4GB consumer GPU.',
    stack: 'Python',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="4"/><circle cx="17" cy="17" r="4"/><path d="M10.5 9.5L13.5 14.5"/><path d="M17 21c0-3-2-5-5-5" stroke-width="1.4"/></svg>',
  },
  {
    name: 'Wick',
    desc: 'Open-source tool for fine-tuning vision-language models on low-VRAM GPUs by streaming encoder layers between CPU and GPU through the full backward pass.',
    stack: 'Python',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="7" height="12" rx="1.5"/><rect x="15" y="6" width="7" height="12" rx="1.5"/><path d="M9 9h6M15 9l-3 1.5M9 15h6M9 15l3-1.5" stroke-width="1.4"/><text x="5.5" y="13.5" text-anchor="middle" fill="currentColor" stroke="none" font-size="4" font-family="monospace">CPU</text><text x="18.5" y="13.5" text-anchor="middle" fill="currentColor" stroke="none" font-size="4" font-family="monospace">GPU</text></svg>',
  },
  {
    name: 'ShopFloor OS',
    desc: 'Open-source ops tool for small factories and print shops — job cards, downtime logs, wastage tracking, shift handoff.',
    stack: 'Open source',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h4"/><path d="M9 16l1.5 1.5L14 14" stroke-width="1.6"/></svg>',
  },
];

export const SKILLS = [
  {
    index: '01',
    title: 'Languages',
    desc: 'The tools I reach for daily.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-5 4 5 4M16 8l5 4-5 4M13 4l-2 16"/></svg>',
    proof: 'rust in prod · python daily · ts + kotlin for apps',
    tags: ['Rust', 'Python', 'TypeScript', 'Kotlin', 'SQL', 'Bash'],
  },
  {
    index: '02',
    title: 'Systems & Security',
    desc: 'Prove that something is what it claims to be.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z"/><path d="m9.3 12 2 2 3.6-4.2"/></svg>',
    accent: '<svg viewBox="0 0 120 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="skill-accent"><circle cx="20" cy="20" r="8"/><circle cx="60" cy="20" r="8"/><circle cx="100" cy="20" r="8"/><path d="M28 20h24M68 20h24"/><text x="20" y="23" text-anchor="middle" fill="currentColor" stroke="none" font-size="7" font-family="monospace">REQ</text><text x="60" y="23" text-anchor="middle" fill="currentColor" stroke="none" font-size="7" font-family="monospace">POL</text><text x="100" y="23" text-anchor="middle" fill="currentColor" stroke="none" font-size="7" font-family="monospace">✓/✗</text></svg>',
    proof: 'kavach · pehredar · c.u.r.e ship this mindset',
    tags: ['Zero-trust runtimes', 'Malware forensics', 'Android hardening', 'Policy engines', 'Audit logging'],
    wide: true,
  },
  {
    index: '03',
    title: 'AI Infrastructure',
    desc: 'Making LLMs cheaper and safer to run.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></svg>',
    accent: '<svg viewBox="0 0 120 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="skill-accent"><rect x="8" y="12" width="20" height="16" rx="3"/><path d="M28 20h16"/><rect x="44" y="12" width="32" height="16" rx="3"/><path d="M76 20h16"/><rect x="92" y="8" width="20" height="24" rx="2" stroke-dasharray="2 2"/><path d="M96 16h12M96 20h8M96 24h10" stroke-width="1"/><text x="18" y="23" text-anchor="middle" fill="currentColor" stroke="none" font-size="6" font-family="monospace">API</text><text x="60" y="23" text-anchor="middle" fill="currentColor" stroke="none" font-size="6" font-family="monospace">PROXY</text><text x="102" y="7" text-anchor="middle" fill="currentColor" stroke="none" font-size="5" font-family="monospace">$BUD</text></svg>',
    proof: 'tokenguard + ustad run on this stack',
    tags: ['LLM proxying', 'Token budgeting', 'LoRA / QLoRA', 'Ollama', 'Prompt-injection evals'],
  },
  {
    index: '04',
    title: 'Ship & Distribute',
    desc: 'From repo to real users.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></svg>',
    accent: '<svg viewBox="0 0 120 40" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="skill-accent"><rect x="8" y="10" width="20" height="20" rx="3"/><path d="M28 20h16M44 20l16-8v16z"/><path d="M60 20h16"/><circle cx="88" cy="14" r="5"/><circle cx="88" cy="26" r="5"/><circle cx="108" cy="20" r="6"/><text x="18" y="23" text-anchor="middle" fill="currentColor" stroke="none" font-size="6" font-family="monospace">GIT</text><text x="52" y="23" text-anchor="middle" fill="currentColor" stroke="none" font-size="6" font-family="monospace">CI</text><text x="88" y="16" text-anchor="middle" fill="currentColor" stroke="none" font-size="4" font-family="monospace">npm</text><text x="88" y="28" text-anchor="middle" fill="currentColor" stroke="none" font-size="4" font-family="monospace">PS</text><text x="108" y="22" text-anchor="middle" fill="currentColor" stroke="none" font-size="4" font-family="monospace">ELEC</text></svg>',
    proof: 'npm + play store — end to end, solo',
    tags: ['npm', 'Play Store', 'Electron', 'GitHub Actions', 'Axum'],
  },
];

/* Real story: MCA (2024) → private-sector developer (2025) → independent (2026). */
export const TIMELINE = [
  {
    period: 'Now',
    phase: 'CONTROL',
    title: 'Independent Developer',
    org: 'Apps & security tooling — solo',
    desc: 'Designing, building and shipping products end to end — Android apps like Mission Khaki (live on the Play Store) and open-source security tooling. Every release is tested, documented, and entirely mine.',
    current: true,
  },
  {
    period: '2026',
    phase: 'BREAKOUT',
    title: 'Took the solo leap',
    org: 'Resigned → independent',
    desc: 'Walked away from a stable private-sector developer role to build independently — trading a salary for ownership, speed, and the freedom to ship what I believe in.',
  },
  {
    period: '2025',
    phase: 'INFILTRATE',
    title: 'Software Developer',
    org: 'Private company · India',
    desc: 'A year of professional industry experience — shipping production software in a team, and learning how real products get built, reviewed, tested, and maintained.',
  },
  {
    period: '2024',
    phase: 'RECON',
    title: 'MCA Graduate',
    org: 'Master of Computer Applications',
    desc: 'Completed my MCA with a focus on systems and software engineering — the foundation everything since is built on.',
  },
];

export const CONTACT = {
  email: 'contact.rupjyoti26@gmail.com',
  github: 'https://github.com/MadB0i',
  githubLabel: 'github.com/MadB0i',
};

export const THREAT_FEED = [
  'blocked prompt-injection payload #4821',
  'quarantined autorun.inf from USB-03',
  'token budget enforced · proj-llm-ops',
  'rootcloak signature detected · device-07',
  'audit log sealed · sha256 verified',
  'policy deny · agent attempted shell exec',
  'play protect pass · mission khaki v2.4',
  'npm audit clean · repoproof deps',
  'sandboxed 14 trackers · pehredar sweep',
  'cat: hissed at suspicious usb ♥',
];
