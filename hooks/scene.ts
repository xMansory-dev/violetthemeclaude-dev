// The backdrop: a calm, dim gradient in the palette's teal and navy, with faint
// fragments of code drifting along both edges. A mood, not a picture.

type Glyph = [x: number, y: number, text: string, size: number, color: string]

const TEAL = '#7fb3b8'
const BLUE = '#5bc0de'
const SAND = '#eadcc8'
const RUST = '#c6601f'

// Left edge, in a 300 wide column.
const LEFT: Glyph[] = [
  [40, 50, 'let x = 0;', 13, TEAL],
  [190, 80, '{ }', 26, TEAL],
  [20, 130, 'const vibe = true', 14, SAND],
  [210, 175, '++', 18, BLUE],
  [60, 220, '&lt;/&gt;', 30, BLUE],
  [170, 260, 'null', 13, SAND],
  [150, 310, '=&gt;', 20, TEAL],
  [30, 350, 'if (ok) {', 13, BLUE],
  [20, 400, 'git commit -m "wip"', 13, SAND],
  [220, 440, '%', 20, RUST],
  [200, 480, '[ ]', 22, BLUE],
  [40, 515, 'for (i of list)', 13, TEAL],
  [90, 570, 'fn()', 18, TEAL],
  [200, 605, '0b1010', 12, SAND],
  [140, 650, '// todo', 14, SAND],
  [30, 690, 'export *', 13, BLUE],
  [40, 740, '&amp;&amp;', 22, RUST],
  [210, 770, '::', 18, TEAL],
  [170, 810, 'import', 15, BLUE],
  [20, 850, 'try { } catch', 13, SAND],
  [80, 900, '0x2E6F73', 13, TEAL],
  [210, 935, ';', 26, SAND],
  [40, 975, 'npm i', 13, BLUE],
]

// Right edge, in a 300 wide column.
const RIGHT: Glyph[] = [
  [60, 45, 'type Props', 13, BLUE],
  [190, 95, '( )', 24, BLUE],
  [40, 150, 'npm run dev', 14, SAND],
  [220, 190, '?.', 18, TEAL],
  [200, 245, '#', 30, TEAL],
  [30, 285, 'useState()', 13, SAND],
  [60, 335, 'await ship()', 14, BLUE],
  [230, 370, '*', 22, RUST],
  [190, 420, '!==', 20, TEAL],
  [40, 460, 'SELECT * FROM', 12, BLUE],
  [30, 505, 'return 42', 14, SAND],
  [210, 540, '..', 18, TEAL],
  [180, 590, '{ }', 26, BLUE],
  [40, 630, 'git push', 13, TEAL],
  [70, 675, 'async', 16, TEAL],
  [200, 715, 'true', 13, SAND],
  [210, 760, '|&gt;', 22, RUST],
  [30, 800, 'def main():', 13, BLUE],
  [40, 845, '$ claude', 14, SAND],
  [220, 880, '[]', 20, TEAL],
  [150, 925, '&lt;/&gt;', 26, TEAL],
  [30, 970, 'console.log', 13, BLUE],
]

// A third, smaller layer between the others, spread evenly down each edge.
const EXTRA = [
  'map()', '0', '&lt;div&gt;', '!', 'fetch', '{}', 'yield', '1', 'str', '&gt;=',
  'class', '"ok"', '@', 'λ', 'end', '~/', 'len()', '&amp;', 'void', 'i++',
]
const COLORS = [TEAL, BLUE, SAND, TEAL, BLUE, SAND, RUST]
const MORE = [
  'enum', '=', 'git pull', '0.5', 'self', '//', 'NaN', '&lt;T&gt;', 'pip i', '[0]',
  'cd ..', '%%', 'go run', 'β', 'ls -la', '-&gt;', 'let', '#!', 'pub fn', '$_',
]
const spread = (words: string[], xs: number[], y0: number, size: number): Glyph[] =>
  words.map((t, i) => [xs[i % xs.length] ?? 100, y0 + i * 48, t, size, COLORS[(i + y0) % COLORS.length] ?? TEAL])

LEFT.push(...spread(EXTRA, [250, 130, 270, 110, 240], 30, 11))
RIGHT.push(...spread(EXTRA, [130, 250, 110, 270, 140], 30, 11))
LEFT.push(...spread(MORE, [10, 190, 60, 230, 120], 54, 12))
RIGHT.push(...spread(MORE, [230, 20, 170, 80, 200], 54, 12))

const glyphs = (list: Glyph[]): string =>
  list
    .map(
      ([x, y, t, s, c], i) =>
        `<text class="f${i % 3}" x="${x}" y="${y}" font-size="${s}" fill="${c}">${t}</text>`,
    )
    .join('')

const DOTS = (() => {
  let out = ''

  for (let y = 40; y < 1000; y += 48) {
    for (let x = 24; x < 300; x += 48) {
      out += `<circle cx="${x}" cy="${y}" r="1.2"/>`
    }
  }

  return out
})()

// ---------- the coding window, shown while Claude works ----------

type Token = [text: string, color: string]

const KW = '#5bc0de'
const STR = '#5fd39f'
const FN = '#eadcc8'
const COM = '#6f8d95'
const PUN = '#a9c3c7'

// Each line: indent (in characters) and its colored tokens.
const CODE: [indent: number, tokens: Token[]][] = [
  [0, [['import', KW], [' { plan } ', PUN], ['from', KW], [" './task'", STR]]],
  [0, [['const', KW], [' steps = ', PUN], ['await', KW], [' plan', FN], ['(goal)', PUN]]],
  [0, [['for', KW], [' (', PUN], ['const', KW], [' s ', PUN], ['of', KW], [' steps) {', PUN]]],
  [2, [['const', KW], [' diff = ', PUN], ['await', KW], [' write', FN], ['(s)', PUN]]],
  [2, [['await', KW], [' test', FN], ['(diff)', PUN]]],
  [0, [['}', PUN]]],
  [0, [['// ✓ все тесты прошли', COM]]],
  [0, [['git', FN], [' commit -m ', PUN], ['"feat: done"', STR]]],
]

const WIN_W = 300
const WIN_H = 250
const WIN_BG = '#0d1820'
const LINE_H = 20
const CODE_TOP = 52
const CHAR_W = 6.7
const CYCLE = 18 // seconds for one full typing loop
const STEP = 1.6 // seconds between the starts of two lines
const TYPE = 1.2 // seconds a line takes to type

const pct = (s: number): string => ((s / CYCLE) * 100).toFixed(2)

const codeLines = CODE.map(([indent, tokens], i) => {
  const y = CODE_TOP + i * LINE_H
  const x = 34 + indent * CHAR_W
  const len = tokens.reduce((n, [t]) => n + t.length, 0)
  const spans = tokens.map(([t, c]) => `<tspan fill="${c}">${t}</tspan>`).join('')
  const start = i * STEP

  // A curtain in the window's color covers the line and slides off it in
  // steps, one per character, so the line looks typed. It rests revealed, so
  // with motion turned off the window shows the finished code.
  const keys = `@keyframes t${i} {
0% { transform: scaleX(1); }
${pct(start)}% { transform: scaleX(1); animation-timing-function: steps(${len}, end); }
${pct(start + TYPE)}% { transform: scaleX(0); }
94% { transform: scaleX(0); }
97% { transform: scaleX(1); }
100% { transform: scaleX(1); }
}
.c${i} { transform: scaleX(0); transform-box: fill-box; transform-origin: 100% 50%; animation: t${i} ${CYCLE}s linear infinite; }`

  const markup = `<text x="14" y="${y}" font-size="10" fill="#3d5560">${i + 1}</text>
<text x="${x}" y="${y}" font-size="11">${spans}</text>
<rect class="c${i}" x="${x - 1}" y="${y - 12}" width="${len * CHAR_W + 8}" height="16" fill="${WIN_BG}"/>`

  return { keys, markup }
})

const promptY = CODE_TOP + CODE.length * LINE_H + 10

const WINDOW = `<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMin meet">
<g transform="translate(${1600 - WIN_W - 36} 44)">
<g class="pop">
<rect width="${WIN_W}" height="${WIN_H}" rx="14" fill="${WIN_BG}" stroke="#7fb3b8" stroke-opacity="0.22"/>
<rect width="${WIN_W}" height="30" rx="14" fill="#13232d"/>
<rect y="16" width="${WIN_W}" height="14" fill="#13232d"/>
<circle cx="18" cy="15" r="4.5" fill="#e5484d" fill-opacity="0.75"/>
<circle cx="34" cy="15" r="4.5" fill="#d97706" fill-opacity="0.75"/>
<circle cx="50" cy="15" r="4.5" fill="#5fd39f" fill-opacity="0.75"/>
<text x="${WIN_W / 2}" y="19" font-size="10.5" fill="#97adb2" text-anchor="middle">task.ts — Claude пишет код</text>
<circle class="live" cx="${WIN_W - 18}" cy="15" r="3.5" fill="#6ee7ef"/>
${codeLines.map(l => l.markup).join('\n')}
<text x="14" y="${promptY}" font-size="11" fill="#5fd39f">$</text>
<text x="28" y="${promptY}" font-size="11" fill="#c6d2d4">claude работает</text>
<rect class="cursor" x="${28 + 15 * CHAR_W + 4}" y="${promptY - 11}" width="7" height="14" fill="#6ee7ef"/>
<rect class="scan" x="1" y="31" width="${WIN_W - 2}" height="2" fill="#6ee7ef" fill-opacity="0.18"/>
</g>
</g>
</svg>`

const WINDOW_STYLE = `${codeLines.map(l => l.keys).join('\n')}
.cursor { animation: blink 1.1s steps(1, end) infinite; }
@keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
.live { animation: live 2.4s ease-in-out infinite; }
@keyframes live { 0% { opacity: 1; } 50% { opacity: 0.35; } 100% { opacity: 1; } }
.scan { animation: scan 6s linear infinite; }
@keyframes scan { from { transform: translateY(0px); } to { transform: translateY(${WIN_H - 36}px); } }
.pop { animation: pop 0.6s ease-out; }
@keyframes pop { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0px); } }`

const scene = (working: boolean): string => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
text { font-family: ui-monospace, Consolas, monospace; }
${working ? WINDOW_STYLE : ''}
.f0 { animation: f0 44s ease-in-out infinite alternate; }
.f1 { animation: f1 52s ease-in-out infinite alternate; }
.f2 { animation: f2 60s ease-in-out infinite alternate; }
.drift { animation: drift 70s ease-in-out infinite alternate; }
@keyframes f0 { from { transform: translateY(0px); } to { transform: translateY(-28px); } }
@keyframes f1 { from { transform: translateY(-14px); } to { transform: translateY(16px); } }
@keyframes f2 { from { transform: translateY(10px); } to { transform: translateY(-20px); } }
@keyframes drift { from { transform: translate(-40px, 0px); } to { transform: translate(40px, -30px); } }
</style>
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#0b1b26"/>
<stop offset="0.45" stop-color="#0a111d"/>
<stop offset="1" stop-color="#0f1a36"/>
</linearGradient>
<radialGradient id="tealGlow" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#0f3d3e" stop-opacity="0.7"/>
<stop offset="1" stop-color="#0f3d3e" stop-opacity="0"/>
</radialGradient>
<radialGradient id="navyGlow" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#22336a" stop-opacity="0.85"/>
<stop offset="1" stop-color="#1c2541" stop-opacity="0"/>
</radialGradient>
<radialGradient id="blueGlow" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#3a506b" stop-opacity="0.45"/>
<stop offset="1" stop-color="#3a506b" stop-opacity="0"/>
</radialGradient>
<radialGradient id="warmGlow" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#c6601f" stop-opacity="0.08"/>
<stop offset="1" stop-color="#c6601f" stop-opacity="0"/>
</radialGradient>
<linearGradient id="fadeL" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#fff" stop-opacity="1"/>
<stop offset="0.45" stop-color="#fff" stop-opacity="0.85"/>
<stop offset="1" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
<linearGradient id="fadeR" x1="1" y1="0" x2="0" y2="0">
<stop offset="0" stop-color="#fff" stop-opacity="1"/>
<stop offset="0.45" stop-color="#fff" stop-opacity="0.85"/>
<stop offset="1" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
<mask id="maskL"><rect width="300" height="1000" fill="url(#fadeL)"/></mask>
<mask id="maskR"><rect width="300" height="1000" fill="url(#fadeR)"/></mask>
<filter id="grain" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/>
<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.035 0"/>
</filter>
</defs>
<!-- gradient ground -->
<rect width="1600" height="1000" fill="url(#bg)"/>
<g class="drift">
<ellipse cx="250" cy="180" rx="700" ry="480" fill="url(#tealGlow)"/>
<ellipse cx="1350" cy="850" rx="760" ry="520" fill="url(#navyGlow)"/>
<ellipse cx="1250" cy="150" rx="500" ry="360" fill="url(#warmGlow)"/>
<ellipse cx="800" cy="520" rx="900" ry="420" fill="url(#blueGlow)"/>
<ellipse cx="150" cy="900" rx="560" ry="360" fill="url(#navyGlow)"/>
</g>
<!-- left edge -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMinYMid meet">
<g mask="url(#maskL)">
<g fill="#7fb3b8" fill-opacity="0.09">${DOTS}</g>
<g opacity="${working ? 0.5 : 0.34}">${glyphs(LEFT)}</g>
</g>
</svg>
<!-- right edge -->
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMid meet">
<g transform="translate(1300 0)">
<g mask="url(#maskR)">
<g fill="#7fb3b8" fill-opacity="0.09">${DOTS}</g>
<g opacity="0.34">${glyphs(RIGHT)}</g>
</g>
</g>
</svg>
${working ? `<!-- coding window -->\n${WINDOW}` : ''}
<!-- grain -->
<rect width="1600" height="1000" filter="url(#grain)"/>
</svg>`

export const SCENE = scene(false)
export const SCENE_WORKING = scene(true)
