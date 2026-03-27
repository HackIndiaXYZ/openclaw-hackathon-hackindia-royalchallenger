const fs = require('fs');

const srcDirs = ['./src/components/sections', './src/components/ui', './src/app'];

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

let allFiles = [];
srcDirs.forEach(dir => {
  allFiles = allFiles.concat(walk(dir));
});

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Exact string replacements
  const dict = {
    'bg-[#04070F]': 'bg-bg-base',
    'bg-[#080D1A]': 'bg-bg-surface',
    'bg-[#0D1526]': 'bg-bg-elevated',
    'bg-[#111A2E]': 'bg-bg-deep',
    'text-[#04070F]': 'text-text-primary',
    'text-[#F0F4FF]': 'text-text-primary',
    'text-[#7A8BAD]': 'text-text-secondary',
    'text-[#3A4A66]': 'text-text-muted',
    'text-[#00D4FF]': 'text-accent-blue',
    'text-[#00FF88]': 'text-accent-green',
    'text-[#FF3B3B]': 'text-accent-red',
    'text-[#FFB800]': 'text-accent-amber',
    'text-[#7B61FF]': 'text-accent-purple',
    'bg-[#00D4FF]': 'bg-accent-blue',
    'bg-[#00D4FF]/10': 'bg-bg-glass',
    'border-[#00D4FF]': 'border-accent-blue',
    'border-[#00D4FF]/20': 'border-border-default',
    'border-[#00D4FF]/30': 'border-border-strong',
    'border-[#111A2E]': 'border-border-strong',
    'rgba(0,212,255,': 'rgba(0,50,125,',
    "'#04070F'": "'var(--color-bg-base)'",
    "'#00D4FF'": "'var(--color-accent-blue)'",
    '#00D4FF': 'var(--color-accent-blue)',
    '#04070F': 'var(--color-bg-base)',
    '#080D1A': 'var(--color-bg-surface)',
    'hover:bg-white text-black': 'hover:bg-accent-purple text-text-inverse',
    'text-black': 'text-text-primary'
  };

  for (const [key, val] of Object.entries(dict)) {
    if (content.includes(key)) {
      content = content.split(key).join(val);
    }
  }

  // Regex replacements
  content = content.replace(/bg-\[#04070F\]\/[0-9]+/g, 'bg-bg-glass');
  content = content.replace(/hover:shadow-\[0_0_20px_rgba\(0,212,255,[0-9.]+\)\]/g, 'hover:shadow-[0_20px_40px_rgba(27,27,37,0.06)]');
  content = content.replace(/shadow-\[0_0_20px_rgba\(0,212,255,[0-9.]+\)\]/g, 'shadow-[0_20px_40px_rgba(27,27,37,0.04)]');
  content = content.replace(/border-\[rgba\(0,212,255,[0-9.]+\)\]/g, 'border-border-default');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
