# SYL Hermanos — Node conversion

This is the original `sylhermanos` PHP site (single-page company profile:
home, about, principals, careers, contact) rebuilt as a **Node.js static
build** so it can be deployed on Vercel with no PHP or server runtime.

## What changed vs. the PHP version

- `modules/core/database/db.php` → `src/data.js`. Same logic: it tries a
  MySQL/MariaDB connection first (for the two admin-manageable galleries),
  and falls back to scanning `public/assets/library/images/...` or the
  hardcoded arrays, exactly like the PHP did. **No database is configured
  yet** (the PHP admin/login pages were empty stubs, so the DB tables were
  never actually populated either) — the site currently runs entirely off
  the folder scan / hardcoded data, same as it does live today.
- `header.php` + `landingpage.php` → `src/page.js`, a template function
  that renders the exact same HTML, with the PHP `foreach` loops replaced
  by JS `.map()`.
- `lp-mobile-view.php` → split into `public/assets/css/mobile.css` (the
  responsive overrides) and `public/assets/js/protect.js` (the right-click /
  devtools / screenshot / print-blocking script — carried over as-is; see
  note below).
- `landingpage_script.php` → `public/assets/js/landingpage.js` (nav,
  carousels, theme toggle — unchanged).
- `footer.php` was **not** converted — it was dead code in the PHP project
  (a leftover template, never `include`d anywhere).
- Only the Font Awesome files actually referenced (`css/all.min.css` +
  the 4 `webfonts/*.woff2`) were copied — the original `Font-Awesome-7.x`
  folder was 139 MB of mostly-unused SVGs/OTFs/sprites. Likewise,
  `a.css`, `b.css`, `df.css`, `df.js`, and Swiper were dropped — they
  weren't referenced by the page.
- `administration.php` and `login.php` were empty stubs with no real code,
  so there was nothing to port.

## Note on the devtools/screenshot-blocking script

`protect.js` (from `lp-mobile-view.php`) disables right-click on images,
blocks F12/Ctrl+Shift+I/print, and pops a repeating `alert()` while dev
tools are open. This was already live on the PHP site, so it's carried
over unchanged for parity — but it's the kind of thing worth reconsidering
for a client-facing preview (repeated alerts are disruptive, and none of
this actually stops a determined visitor). Delete
`public/assets/js/protect.js` and its `<script>` tag in `src/page.js` if
you'd rather not have it.

## Build & preview locally

```bash
npm install        # only needed if you want the optional mysql2 dependency
npm run build       # generates dist/index.html + copies assets → dist/
npm run serve        # serve dist/ locally to preview
```

## Deploying to Vercel

This repo includes a `vercel.json` that tells Vercel to run `npm run build`
and serve the `dist/` folder — no framework preset needed ("Other" is fine).

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel: **New Project → Import** the repo.
3. Leave the build command / output directory as detected from
   `vercel.json` (`npm run build` / `dist`).
4. Deploy.

If you later wire up a real MySQL database for the admin-managed
galleries, set these environment variables in Vercel (Project Settings →
Environment Variables) — the build will pick them up automatically:

```
DB_HOST=
DB_PORT=3306
DB_NAME=sylhermanos
DB_USER=
DB_PASS=
```

Since this is a static build, the database is only read **at build time**,
not per request — that avoids the classic "serverless function can't hold
a MySQL connection" problem entirely. Updating a gallery row would mean
triggering a new Vercel deployment (e.g. a "Redeploy" click, or a webhook)
to regenerate the page.
