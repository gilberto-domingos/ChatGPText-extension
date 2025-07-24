### commanders

tree -L 3
tree -a -I "node_modules|.git"
tree -a -I "node_modules|.git" -L 3
npx tsc --watch
npm run build
npm run dev

### project

📁 src/ (source)
Where you write and edit your files.

Example: src/popup.ts, src/popup.html, src/style.css.

📁 dist/ (distribution)
This is where the browser is ready, the files are stored, the Chrome uses when you load the extension with "Load unpacked."

It should contain: dist/popup.html, dist/background.js, dist/content.js, etc.
