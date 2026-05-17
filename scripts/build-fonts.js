#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DIST_FONTS = path.join(__dirname, '..', 'dist', 'fonts');

const FONTS = [
  {
    pkg: '@fontsource/plus-jakarta-sans',
    weights: [400, 500, 600, 700, 800],
  },
  {
    pkg: '@fontsource/inter',
    weights: [400, 500, 600],
  },
];

// Extract only the latin @font-face block from a fontsource CSS file.
// Fontsource lists subsets in order; the last block (no unicode-range restriction)
// is the latin base subset — that is the one we keep.
function extractLatinBlock(css) {
  const blocks = [];
  const regex = /@font-face\s*\{[^}]+\}/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    blocks.push(match[0]);
  }
  // The latin base block has no unicode-range line
  return blocks.find(b => !b.includes('unicode-range')) ?? blocks[blocks.length - 1];
}

fs.mkdirSync(DIST_FONTS, { recursive: true });

const cssBlocks = [];

for (const { pkg, weights } of FONTS) {
  const pkgDir = path.join(__dirname, '..', 'node_modules', pkg);

  for (const weight of weights) {
    const cssPath = path.join(pkgDir, `${weight}.css`);
    const css = fs.readFileSync(cssPath, 'utf8');
    const block = extractLatinBlock(css);

    // Rewrite src: url(./files/font-file.woff2) → url(./fonts/font-file.woff2)
    const rewritten = block.replace(/url\(\.\/files\//g, 'url(./fonts/');
    cssBlocks.push(rewritten);

    // Copy woff2 only (woff2 has universal modern-browser support)
    const filesDir = path.join(pkgDir, 'files');
    const prefix = pkg.replace('@fontsource/', '');
    const woff2 = `${prefix}-latin-${weight}-normal.woff2`;
    fs.copyFileSync(path.join(filesDir, woff2), path.join(DIST_FONTS, woff2));
  }
}

fs.writeFileSync(
  path.join(__dirname, '..', 'dist', 'fonts.css'),
  cssBlocks.join('\n\n') + '\n',
);

console.log(`Built dist/fonts.css (${cssBlocks.length} @font-face rules)`);
console.log(`Copied ${cssBlocks.length} .woff2 files to dist/fonts/`);
