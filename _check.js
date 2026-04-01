const fs = require('fs');
const html = fs.readFileSync('blog.html', 'utf-8');

// Find the main inline script
const start = html.indexOf('<script>\nvar navLinks');
const end = html.indexOf('</script>', start);
if (start === -1 || end === -1) { console.log('Script not found'); process.exit(1); }

const scriptContent = html.slice(start + '<script>\n'.length, end);

try {
  new Function(scriptContent);
  console.log('SYNTAX OK');
} catch(e) {
  console.log('SYNTAX ERROR:', e.message);
}

// Also check posts count
const postsMatch = scriptContent.match(/id:\d+/g);
console.log('Posts found:', postsMatch ? postsMatch.length : 0);

// Check renderList is called
console.log('renderList() call present:', scriptContent.includes('renderList();'));
console.log('filteredPosts init:', scriptContent.includes('let filteredPosts = [...posts]'));
