const fs = require('fs');
const path = require('path');

const files = [
  'src/app/admin/categories/new/page.js',
  'src/app/admin/page.js',
  'src/app/cart/page.js',
  'src/app/checkout/page.js',
  'src/app/favorites/page.js',
  'src/app/login/page.js',
  'src/app/products/page.js'
];

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace unescaped quotes in JSX
    content = content.replace(/(\s|>)([^<]*)'([^<]*?)(<|$)/g, (match, before, text1, text2, after) => {
      if (text1.includes('"') || text2.includes('"')) {
        return match; // Skip if already contains quotes
      }
      return before + text1 + '&apos;' + text2 + after;
    });
    
    content = content.replace(/(\s|>)([^<]*)"([^<]*?)(<|$)/g, (match, before, text1, text2, after) => {
      if (text1.includes("'") || text2.includes("'")) {
        return match; // Skip if already contains quotes
      }
      return before + text1 + '&quot;' + text2 + after;
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed quotes in ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
});

console.log('Quote fixing complete!');
