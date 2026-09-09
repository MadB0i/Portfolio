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
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=70&w=400&auto=format&fit=crop',
    alt: 'Terminal-style code — adversarial testing research',
  },
  {
    name: 'Ustad',
    desc: 'Local studio for distilling and fine-tuning LLMs — teacher via Ollama, student with LoRA/QLoRA, live training graphs, runs on a 4GB consumer GPU.',
    stack: 'Python',
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=70&w=400&auto=format&fit=crop',
    alt: 'Abstract AI artwork — LLM fine-tuning studio',
  },
  {
    name: 'Wick',
    desc: 'Open-source tool for fine-tuning vision-language models on low-VRAM GPUs by streaming encoder layers between CPU and GPU through the full backward pass.',
    stack: 'Python',
    img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=70&w=400&auto=format&fit=crop',
    alt: 'Robot portrait — vision-language models',
  },
  {
    name: 'ShopFloor OS',
    desc: 'Open-source ops tool for small factories and print shops — job cards, downtime logs, wastage tracking, shift handoff.',
    stack: 'Open source',
    img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=70&w=400&auto=format&fit=crop',
    alt: 'Industrial factory machinery — shop-floor operations',
  },
];

export const SKILLS = [
  {
    index: '01',
    title: 'Languages',
    desc: 'The tools I reach for daily.',
    tags: ['Rust', 'Python', 'TypeScript', 'Kotlin', 'SQL', 'Bash'],
  },
  {
    index: '02',
    title: 'Systems & Security',
    desc: 'Prove that something is what it claims to be.',
    tags: ['Zero-trust runtimes', 'Malware forensics', 'Android hardening', 'Policy engines', 'Audit logging'],
    wide: true,
  },
  {
    index: '03',
    title: 'AI Infrastructure',
    desc: 'Making LLMs cheaper and safer to run.',
    tags: ['LLM proxying', 'Token budgeting', 'LoRA / QLoRA', 'Ollama', 'Prompt-injection evals'],
  },
  {
    index: '04',
    title: 'Ship & Distribute',
    desc: 'From repo to real users.',
    tags: ['npm', 'Play Store', 'Electron', 'GitHub Actions', 'Axum'],
  },
];

/* Timeline is a sensible default — update dates/roles to match your resume. */
export const TIMELINE = [
  {
    period: 'Now',
    title: 'Independent Developer',
    org: 'Security & systems tooling',
    desc: 'Building zero-trust runtimes (Kavach), LLM cost infrastructure (TokenGuard) and open-source security tools — solo, end to end.',
    current: true,
  },
  {
    period: '2025',
    title: 'Shipped to real users',
    org: 'RepoProof · Mission Khaki',
    desc: 'Published RepoProof on npm (MIT) and took Mission Khaki live on the Play Store with thousands of tri-lingual questions.',
  },
  {
    period: '2024',
    title: 'Freelance compliance testing',
    org: 'Device security — Pehredar',
    desc: 'Root/jailbreak and spyware-compliance testing for clients, plus personal device safety checks, powered by my own scanner.',
  },
  {
    period: '2023',
    title: 'MCA Graduate → open source',
    org: 'Assam, India',
    desc: 'Finished my MCA and started building systems tooling in the open — small factories, print shops, and security experiments.',
  },
];

export const CONTACT = {
  email: 'contact.rupjyoti26@gmail.com',
  github: 'https://github.com/MadB0i',
  githubLabel: 'github.com/MadB0i',
};
