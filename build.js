const fs = require('fs');
const path = require('path');
const {
  loadAboutUsGallery,
  loadTeamGallery,
  loadPrincipalLogos,
  loadAwardItems,
  loadPrincipalDirectory,
  loadCareerOpenings,
} = require('./src/data');
const { renderPage } = require('./src/page');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function main() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });

  // 1. Copy every static asset (css/js/images/fonts) as-is.
  copyDir(PUBLIC_DIR, DIST_DIR);

  // 2. Load page data (DB-backed with folder/static fallback, same as the PHP site).
  const [aboutGalleryItems, teamGalleryItems] = await Promise.all([
    loadAboutUsGallery(),
    loadTeamGallery(),
  ]);
  const principalLogoItems = loadPrincipalLogos();
  const awardItems = loadAwardItems();
  const principalDirectoryItems = loadPrincipalDirectory();
  const careerOpenings = loadCareerOpenings();

  // 3. Render the page and write it out.
  const html = renderPage({
    aboutGalleryItems,
    teamGalleryItems,
    principalLogoItems,
    awardItems,
    principalDirectoryItems,
    careerOpenings,
  });

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);

  console.log(`Built dist/index.html`);
  console.log(`  about gallery items: ${aboutGalleryItems.length}`);
  console.log(`  team gallery items: ${teamGalleryItems.length}`);
  console.log(`  principal logos: ${principalLogoItems.length}`);
  console.log(`  principal directory: ${principalDirectoryItems.length}`);
  console.log(`  career openings: ${careerOpenings.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
