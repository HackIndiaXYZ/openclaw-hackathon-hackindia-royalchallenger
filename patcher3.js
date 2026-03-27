const fs = require('fs');
const pfPath = 'c:/Users/bingi/CivicPulse AI/civicpulse/src/components/ui/civicpulse-platform.tsx';
let txt = fs.readFileSync(pfPath, 'utf8');

// The hex colors for accents used in the tracker/icons
txt = txt.split('#00FF88').join('var(--color-accent-green)');
txt = txt.split('#FFB800').join('var(--color-accent-amber)');
txt = txt.split('#FFD700').join('var(--color-accent-amber)');
txt = txt.split('#FF3B3B').join('var(--color-accent-red)');
txt = txt.split('#7B61FF').join('var(--color-accent-blue)');
txt = txt.split('#FF6B35').join('var(--color-accent-red)');
txt = txt.split('#E8EAF0').join('var(--color-border-subtle)');

// Convert stray old text colors
txt = txt.split('#3A4A66').join('var(--color-text-muted)');

fs.writeFileSync(pfPath, txt);
console.log('Hex accents patched successfully!');
