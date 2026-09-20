/* Project banner diagrams — abstract technical SVG visuals.
   Illustrative only: no screenshots, no fabricated metrics. */

function wrap(inner, vb) {
  return `<svg viewBox="${vb}" class="dg" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

const T = (x, y, s, cls = 'dg-t') => `<text x="${x}" y="${y}" class="${cls}" stroke="none">${s}</text>`;
const arrow = (x1, y1, x2, y2, cls = 'dg-l') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/><path d="M${x2 - 6} ${y2 - 3} L${x2} ${y2} L${x2 - 6} ${y2 + 3}" class="${cls}"/>`;

const DIAGRAMS = {
  /* ---------- Kavach: request → policy gate → allow/deny ---------- */
  kavach: wrap(`
    <circle cx="160" cy="96" r="60" class="dg-f" stroke-dasharray="4 6"/>
    <rect x="24" y="74" width="66" height="44" rx="8" class="dg-l"/>
    ${T(41, 100, 'REQ', 'dg-tb')}
    ${arrow(90, 96, 122, 96)}
    <path d="M160 62 L194 96 L160 130 L126 96 Z" class="dg-l"/>
    ${T(150, 101, 'POL', 'dg-tb')}
    ${T(138, 150, 'POLICY', 'dg-ts')}
    ${arrow(194, 96, 238, 66)}
    ${arrow(194, 96, 238, 126)}
    <rect x="238" y="48" width="88" height="36" rx="8" class="dg-l"/>
    ${T(252, 71, '✓ ALLOW', 'dg-tb')}
    <rect x="238" y="108" width="88" height="36" rx="8" class="dg-a"/>
    ${T(254, 131, '✗ DENY', 'dg-tb')}
    ${T(24, 172, 'policy.check → audit.log ● sealed', 'dg-ts')}
    ${T(300, 172, 'zero-trust', 'dg-ts')}
  `, '0 0 400 200'),

  /* ---------- RepoProof: CLI audit → checklist + report ---------- */
  repoproof: wrap(`
    <rect x="20" y="36" width="226" height="128" rx="8" class="dg-l"/>
    <circle cx="36" cy="52" r="3" class="dg-fsa"/><circle cx="50" cy="52" r="3" class="dg-fsa"/><circle cx="64" cy="52" r="3" class="dg-fsa"/>
    ${T(32, 82, '$ repoproof audit ./repo', 'dg-tb')}
    ${T(32, 104, '✓ deps clean', 'dg-t')}
    ${T(32, 124, '✓ no secrets', 'dg-t')}
    ${T(32, 144, '! review perms', 'dg-tw')}
    <circle cx="318" cy="100" r="42" class="dg-i"/>
    <circle cx="318" cy="100" r="42" class="dg-l" stroke-dasharray="200 64" transform="rotate(-90 318 100)"/>
    ${T(300, 105, 'PASS', 'dg-tb')}
    ${T(292, 162, 'report.json', 'dg-ts')}
    ${T(20, 184, 'local-first · mit', 'dg-ts')}
  `, '0 0 400 200'),

  /* ---------- Pehredar: phone sweep + shield ---------- */
  pehredar: wrap(`
    <path d="M96 70 Q120 96 96 122 M88 62 Q124 96 88 130" class="dg-i"/>
    <path d="M304 70 Q280 96 304 122 M312 62 Q276 96 312 130" class="dg-i"/>
    <rect x="156" y="26" width="88" height="148" rx="12" class="dg-l"/>
    <line x1="184" y1="36" x2="216" y2="36" class="dg-f"/>
    <path d="M200 78 l22 8 v14 c0 16 -10 26 -22 30 c-12 -4 -22 -14 -22 -30 v-14 z" class="dg-l"/>
    <path d="M192 100 l6 6 l12 -13" class="dg-l"/>
    <rect x="160" y="44" width="80" height="2.5" class="dg-scan" stroke="none"/>
    ${T(150, 192, 'live sweep ● rootcloak check', 'dg-ts')}
  `, '0 0 400 200'),

  /* ---------- C.U.R.E: USB → quarantine box ---------- */
  cure: wrap(`
    <rect x="28" y="84" width="72" height="30" rx="4" class="dg-l"/>
    <rect x="100" y="90" width="26" height="18" rx="2" class="dg-l"/>
    <line x1="108" y1="90" x2="108" y2="108" class="dg-f"/><line x1="118" y1="90" x2="118" y2="108" class="dg-f"/>
    ${arrow(126, 99, 168, 99)}
    <rect x="168" y="42" width="204" height="114" rx="8" class="dg-a" stroke-dasharray="6 5"/>
    ${T(182, 66, 'quarantine/', 'dg-tb')}
    ${T(182, 92, '✗ run key', 'dg-t')}
    ${T(182, 114, '✗ startup entry', 'dg-t')}
    ${T(182, 136, '✗ sched task', 'dg-t')}
    ${T(28, 172, 'usb-03 · portable · no install', 'dg-ts')}
  `, '0 0 400 200'),

  /* ---------- TokenGuard: API → proxy → LLM + budget ---------- */
  tokenguard: wrap(`
    <rect x="16" y="66" width="62" height="42" rx="8" class="dg-i"/>
    ${T(32, 91, 'API', 'dg-tb')}
    ${arrow(78, 87, 130, 87)}
    <rect x="130" y="66" width="72" height="42" rx="8" class="dg-l"/>
    ${T(141, 91, 'PROXY', 'dg-tb')}
    ${arrow(202, 87, 254, 87)}
    <rect x="254" y="66" width="62" height="42" rx="8" class="dg-i"/>
    ${T(268, 91, 'LLM', 'dg-tb')}
    ${T(16, 140, '$BUDGET', 'dg-tb')}
    <rect x="96" y="130" width="130" height="12" rx="6" class="dg-f"/>
    <rect x="99" y="133" width="82" height="6" rx="3" class="dg-fsa" stroke="none"/>
    ${T(236, 140, 'cutoff armed', 'dg-tw')}
    ${T(16, 172, 'anthropic · openai · gemini', 'dg-ts')}
  `, '0 0 400 200'),

  /* ---------- Mission Khaki: mock-test UI + phone (featured) ---------- */
  khaki: wrap(`
    ${T(24, 40, 'MOCK TEST 04', 'dg-tb')}
    ${T(24, 58, 'SSC · CGL', 'dg-ts')}
    <rect x="24" y="70" width="180" height="10" rx="5" class="dg-fsa" stroke="none"/>
    <rect x="24" y="86" width="140" height="10" rx="5" class="dg-fsa" stroke="none"/>
    <rect x="24" y="108" width="196" height="26" rx="6" class="dg-f"/>
    ${T(34, 125, 'A  B  C  D', 'dg-t')}
    <circle cx="196" cy="121" r="6" class="dg-l"/>
    <circle cx="196" cy="121" r="2.4" class="dg-fsa" stroke="none"/>
    <rect x="24" y="142" width="120" height="10" rx="5" class="dg-f"/>
    <rect x="24" y="142" width="76" height="10" rx="5" class="dg-fsa" stroke="none"/>
    ${T(24, 168, 'SECTION SCORE', 'dg-ts')}
    ${T(24, 192, 'EN', 'dg-tb')}${T(48, 192, 'HI', 'dg-tb')}${T(70, 192, 'AS', 'dg-tb')}
    ${T(24, 216, 'mock tests · study sets · practice', 'dg-ts')}
    <rect x="252" y="24" width="124" height="202" rx="16" class="dg-l"/>
    <line x1="292" y1="36" x2="336" y2="36" class="dg-f"/>
    <rect x="264" y="48" width="100" height="40" rx="8" class="dg-f"/>
    <circle cx="314" cy="68" r="13" class="dg-l"/>
    ${T(308, 73, '✓', 'dg-tb')}
    <rect x="264" y="98" width="100" height="12" rx="6" class="dg-fsa" stroke="none"/>
    <rect x="264" y="118" width="100" height="12" rx="6" class="dg-fsa" stroke="none"/>
    <rect x="264" y="138" width="64" height="12" rx="6" class="dg-fsa" stroke="none"/>
    <rect x="264" y="164" width="100" height="30" rx="8" class="dg-l"/>
    ${T(276, 183, 'START TEST', 'dg-tb')}
    <circle cx="282" cy="210" r="3" class="dg-fsa" stroke="none"/><circle cx="314" cy="210" r="3" class="dg-f"/><circle cx="346" cy="210" r="3" class="dg-f"/>
  `, '0 0 400 250'),
};

const MINIS = {
  /* ---------- KavachBench: payloads blocked ---------- */
  bench: wrap(`
    ${T(16, 34, 'attack →', 'dg-tw')}
    <line x1="16" y1="66" x2="120" y2="66" class="dg-l"/>
    <rect x="140" y="34" width="14" height="36" class="dg-fsa" stroke="none"/>
    <rect x="160" y="26" width="14" height="44" class="dg-fsa" stroke="none"/>
    <rect x="180" y="40" width="14" height="30" class="dg-fsa" stroke="none"/>
    <rect x="200" y="30" width="14" height="40" class="dg-fsa" stroke="none"/>
    <rect x="220" y="44" width="14" height="26" class="dg-fsa" stroke="none"/>
    <line x1="132" y1="58" x2="246" y2="58" class="dg-a"/>
    ${T(258, 40, 'BLOCKED', 'dg-tb')}
    ${T(258, 58, 'policy ✓', 'dg-ts')}
  `, '0 0 400 84'),

  /* ---------- Ustad: teacher → student ---------- */
  ustad: wrap(`
    <circle cx="60" cy="42" r="26" class="dg-l"/>
    ${T(36, 38, 'TEACH', 'dg-ts')}${T(48, 52, 'ER', 'dg-ts')}
    ${arrow(88, 42, 150, 42)}
    ${T(104, 32, 'lora', 'dg-tw')}
    <circle cx="182" cy="42" r="16" class="dg-l"/>
    ${T(168, 46, 'STU', 'dg-ts')}
    <polyline points="230,60 260,52 290,40 320,26 350,20" class="dg-i"/>
    ${T(230, 76, 'loss ↘', 'dg-ts')}
    ${T(300, 76, '4gb gpu', 'dg-tw')}
  `, '0 0 400 84'),

  /* ---------- Wick: CPU → layers → GPU ---------- */
  wick: wrap(`
    <rect x="16" y="22" width="52" height="40" rx="6" class="dg-i"/>
    ${T(28, 46, 'CPU', 'dg-tb')}
    <rect x="96" y="14" width="120" height="14" rx="4" class="dg-f"/>
    ${T(102, 25, 'L01', 'dg-ts')}
    <rect x="96" y="35" width="120" height="14" rx="4" class="dg-f"/>
    ${T(102, 46, 'L02', 'dg-ts')}
    <rect x="96" y="56" width="120" height="14" rx="4" class="dg-f"/>
    ${T(102, 67, 'L03', 'dg-ts')}
    <rect x="244" y="22" width="52" height="40" rx="6" class="dg-l"/>
    ${T(256, 46, 'GPU', 'dg-tb')}
    <path d="M68 42 H92 M216 42 H240 M150 70 V78 M150 78 H330 M330 78 V56" class="dg-f" stroke-dasharray="4 4"/>
    ${T(310, 76, 'low vram', 'dg-tw')}
  `, '0 0 400 84'),

  /* ---------- ShopFloor: job cards + handoff ---------- */
  shop: wrap(`
    <rect x="16" y="12" width="120" height="18" rx="4" class="dg-f"/>
    <circle cx="26" cy="21" r="3" class="dg-fsa" stroke="none"/>
    ${T(36, 25, 'JOB-114 · RUN', 'dg-ts')}
    <rect x="16" y="34" width="120" height="18" rx="4" class="dg-f"/>
    <circle cx="26" cy="43" r="3" class="dg-fal" stroke="none"/>
    ${T(36, 47, 'JOB-115 · DOWN', 'dg-ts')}
    <rect x="16" y="56" width="120" height="18" rx="4" class="dg-f"/>
    <circle cx="26" cy="65" r="3" class="dg-fis" stroke="none"/>
    ${T(36, 69, 'JOB-116 · IDLE', 'dg-ts')}
    ${arrow(136, 43, 190, 43)}
    <rect x="190" y="22" width="120" height="42" rx="6" class="dg-l"/>
    ${T(202, 40, 'SHIFT', 'dg-ts')}${T(202, 56, 'HANDOFF ✓', 'dg-tb')}
    ${T(322, 47, 'waste ↓', 'dg-ts')}
  `, '0 0 400 84'),
};

export function diagramSVG(key) {
  return DIAGRAMS[key] || '';
}

export function miniSVG(key) {
  return MINIS[key] || '';
}
