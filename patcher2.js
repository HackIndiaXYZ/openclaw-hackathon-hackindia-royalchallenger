const fs = require('fs');
const pfPath = 'c:/Users/bingi/CivicPulse AI/civicpulse/src/components/ui/civicpulse-platform.tsx';
let txt = fs.readFileSync(pfPath, 'utf8');

// Replace border-radius: 0 with 999px to align with Stitch Pill Buttons
txt = txt.split('borderRadius: 0').join('borderRadius: 9999');
txt = txt.split('rounded-none').join('rounded-full');

fs.writeFileSync(pfPath, txt);
console.log('Button border-radius patched!');
