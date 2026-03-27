const fs = require('fs');
const pfPath = 'c:/Users/bingi/CivicPulse AI/civicpulse/src/components/ui/civicpulse-platform.tsx';
let txt = fs.readFileSync(pfPath, 'utf8');

// 1. Remove navbar (between <motion.header and </motion.header>)
txt = txt.split('<motion.header')[0] + '{/* Navbar global in layout */}' + txt.split('</motion.header>')[1];

// 2. Fix colors
txt = txt.split('#F0F4FF').join('var(--color-text-primary)');
txt = txt.split('#7A8BAD').join('var(--color-text-secondary)');
txt = txt.split('#3A4A66').join('var(--color-text-muted)');
txt = txt.split('#0D1526').join('var(--color-bg-surface)');
txt = txt.split('#1A2340').join('var(--color-text-primary)');
txt = txt.split('#5A6A88').join('var(--color-text-secondary)');
txt = txt.split('rgba(4,7,15,0.82)').join('var(--color-bg-glass)');

// Background adjustments
txt = txt.split('background: "#ffffff"').join('background: "var(--color-bg-surface)"');
txt = txt.split('background: "#F7F8FA"').join('background: "var(--color-bg-elevated)"');

// Font families
txt = txt.split("'Space Grotesk', sans-serif").join('var(--font-body)');
txt = txt.split("'Outfit', sans-serif").join('var(--font-display)');

// Remove hero and CTA backgrounds
txt = txt.split(`backgroundImage: "url('/images/hero-cityscape.png')"`).join(`background: "transparent"`);
txt = txt.split(`backgroundImage: "url('/images/cta-background.png')"`).join(`background: "transparent"`);
txt = txt.split(`backgroundImage: "url('/images/testimonial-bg.png')"`).join(`background: "transparent"`);

// Fix text-shadow hardcoded values
txt = txt.split(`textShadow: "0 0 20px rgba(0,50,125,0.45), 0 0 60px rgba(0,50,125,0.15)"`).join(`textShadow: "none"`);
txt = txt.split(`textShadow: "0 0 20px rgba(0,50,125,0.35)"`).join(`textShadow: "none"`);
txt = txt.split(`textShadow: "0 0 20px rgba(0,50,125,0.45)"`).join(`textShadow: "none"`);
txt = txt.split(`textShadow: word === "VOICE" ? "0 0 20px rgba(0,50,125,0.45), 0 0 60px rgba(0,50,125,0.15)" : "none"`).join(`textShadow: "none"`);
txt = txt.split(`textShadow: word === "NEEDS" ? "0 0 20px rgba(0,50,125,0.45), 0 0 60px rgba(0,50,125,0.15)" : "none"`).join(`textShadow: "none"`);

// Reduce harsh retro grid opacities
txt = txt.split('rgba(0,50,125,0.055)').join('rgba(195,198,213,0.3)');
txt = txt.split('rgba(0,50,125,0.045)').join('rgba(195,198,213,0.25)');
txt = txt.split('rgba(0,50,125,0.03)').join('rgba(195,198,213,0.15)');
txt = txt.split('rgba(0,50,125,0.012)').join('rgba(195,198,213,0.1)');

// The 'background: "radial-gradient(..." for the CTA
txt = txt.split(`background: "radial-gradient(ellipse, rgba(195,198,213,0.3) 0%, transparent 65%)"`).join(`background: "transparent"`);

fs.writeFileSync(pfPath, txt);
console.log('PATCHED SUCCESSFULLY');
