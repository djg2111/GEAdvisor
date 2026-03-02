const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'uiService.ts');
let content = fs.readFileSync(file, 'utf8');

// Find the comment and extract the block
const marker = '// Build body contents.';
const idx = content.indexOf(marker);
if (idx < 0) {
  console.log('ERROR: marker not found');
  process.exit(1);
}

// Find the closing of the badges array
const filterJoin = '].filter(Boolean).join("");';
const endIdx = content.indexOf(filterJoin, idx);
if (endIdx < 0) {
  console.log('ERROR: end marker not found');
  process.exit(1);
}

const blockEnd = endIdx + filterJoin.length;
const oldBlock = content.substring(idx, blockEnd);
console.log('Old block length:', oldBlock.length);

// Build the velocity map declaration
const velocityMap = [
  '  const velocityClsMap: Record<string, string> = {',
  '    "Insta-Flip": "velocity-insta",',
  '    "Active": "velocity-active",',
  '    "Slow": "velocity-slow",',
  '    "Very Slow": "velocity-veryslow",',
  '  };',
].join('\r\n');

// Insert velocity map after the comment line
const commentEnd = oldBlock.indexOf('\r\n') + 2;
let newBlock = oldBlock.substring(0, commentEnd) + velocityMap + '\r\n' + oldBlock.substring(commentEnd);

// Now insert velocity badge line before the hype badge conditional
const hypeLine = '    item.volumeSpikeMultiplier > 1.5';
const hypeIdx = newBlock.indexOf(hypeLine);
if (hypeIdx < 0) {
  console.log('ERROR: hype line not found');
  process.exit(1);
}

const velocityBadgeLine = '    `<span class="velocity-badge ${velocityClsMap[item.tradeVelocity] ?? "velocity-slow"}">${item.tradeVelocity}</span>`,\r\n';
newBlock = newBlock.substring(0, hypeIdx) + velocityBadgeLine + newBlock.substring(hypeIdx);

content = content.substring(0, idx) + newBlock + content.substring(blockEnd);
fs.writeFileSync(file, content, 'utf8');
console.log('SUCCESS: Modal badges updated.');
