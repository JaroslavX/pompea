# Pompeya (pompeya.org.ua)

Next.js 16 (App Router) site for the Pompeian novena. Testimonies come from MongoDB Atlas, the feedback forms send mail through SMTP.
It runs on a shared cPanel host (uahosting) behind nginx + Phusion Passenger, on the main domain `https://pompeya.org.ua/`.

> `AGENTS.md`: this Next.js version has breaking changes. Read `node_modules/next/dist/docs/` before changing framework code.

## TL;DR: ship a change

```bash
# 1. on your computer, in this folder
npm run dev                       # edit and check locally (http://localhost:3000)
scripts/build-release.sh          # builds and writes ~/Downloads/pompeya-release-<id>.zip

# 2. upload that zip to /home/pompe120/pompeya-next/  (cPanel -> File Manager -> Upload)

# 3. cPanel -> Terminal
bash ~/pompeya-next/scripts/server-deploy.sh pompeya-release-<id>.zip

# 4. cPanel -> Setup Node.js App -> Restart (only if the site did not change), then verify (see "Verify")
```

Everything else below explains why, what to check, and what to do when it breaks.
Env var changes (passwords, `SMTP_PASS`, ...) need **no release**: edit them in cPanel → Setup Node.js App and click Restart.

## Where things are in the code

| I want to change... | Edit |
|---|---|
| Text of an article page (История, Вервиця, Параман, ...) | `src/app/<route>/page.tsx` (most hold the legacy HTML inside `dangerouslySetInnerHTML`) |
| Left/right menu and links | `src/components/RightMenu.tsx` |
| Header, footer, page frame, Google Analytics tag | `src/app/layout.tsx` |
| Colors, fonts, card styles | `src/app/globals.css` |
| Home page (testimony of the day, pagination) | `src/app/page.tsx`, `src/lib/dailyPage.ts` |
| Feedback forms and the mail they send | `src/app/feedback/page.tsx`, `src/app/feedback2/page.tsx`, `src/app/actions.ts`, `src/lib/formGuard.ts` |
| Images, fonts, static files | `public/` (served at `/images/...`, `/img/...`, `/fonts/...`) |
| Redirects from the old PHP site, headers, cache id | `next.config.mjs` |
| Add a new page | new folder `src/app/<name>/page.tsx` (+ link it in `RightMenu.tsx`) |

After **any** change, run a release (TL;DR above). Rules:
- A change to `public/` also needs a release, because the deploy script copies `public/` into `~/public_html/` (nginx serves those files directly).
- Do not add `next.config.ts` (production has no TypeScript); keep `next.config.mjs`.
- Do not use `<Image>` features that need `/_next/image` (the optimizer is off, `images.unoptimized: true`).
- Adding a dependency: `npm install <pkg>`, commit `package.json` + `package-lock.json`. The deploy script reinstalls on the server by itself when the lockfile changed.
- Run `npm audit --omit=dev` before releasing; it should say 0 vulnerabilities.

### Testimonies (data, not code)

They live in MongoDB Atlas: database `site`, collection `testimonials`, documents with `title`, `text`, `author`, `date`. Edit them in Atlas (Browse Collections) or Compass; no release needed.
The home page (`/`, no `?page=`) shows one testimony per day (Kyiv date), walking oldest → newest and then starting over (`src/lib/dailyPage.ts`). Adding a testimony changes the cycle length, so that day's pick can change. `/?page=N` shows exactly page N (newest first).

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build check
```

Local `.env` (git-ignored, never commit or paste it): `MONGODB_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NEXT_PUBLIC_GA_ID`.
`NEXT_PUBLIC_GA_ID` is read at **build** time: it must be in your local `.env` when you run `scripts/build-release.sh`, or Analytics is missing from that release.
`MONGODB_URI` must be the plain `mongodb://` string with the three shard hosts, not `mongodb+srv://` (see "Why it is odd").

## Releasing a new version (details)

### 1. Build (your computer)

```bash
scripts/build-release.sh
```

It sets a new `deploymentId` in `next.config.mjs` (this adds `?dpl=<id>` to every asset URL so stale nginx/browser caches are bypassed), runs `npm run build`, and writes `~/Downloads/pompeya-release-<id>.zip` with `.next`, `public`, `server.js`, `next.config.mjs`, `package*.json` and `scripts/server-deploy.sh`. No `.env`, no `node_modules`. It prints the id and the exact deploy command.
Check first: `npm run build` must pass, and `npm audit --omit=dev` should show 0 vulnerabilities.

### 2. Upload

cPanel → **File Manager** → open `pompeya-next` (`/home/pompe120/pompeya-next`) → **Upload** → the zip.

### 3. Deploy (cPanel → Terminal)

```bash
bash ~/pompeya-next/scripts/server-deploy.sh pompeya-release-<id>.zip
```

It does, in order: keeps the old build in `~/pompeya-prev` (rollback copy), replaces `.next`, `public`, `server.js`, `next.config.mjs` (not `node_modules`), deletes the zip, reinstalls the packages in `~/pompeya-modules` **only if** `package-lock.json` changed (about a minute, needs about 350 MB of free quota), refreshes the static copies in `~/public_html` (`_next/static` and everything from `public/`), and touches `tmp/restart.txt`.

*Only the very first time* (the script is not on the server yet):

```bash
cd ~/pompeya-next && unzip -oq pompeya-release-<id>.zip scripts/server-deploy.sh && bash scripts/server-deploy.sh pompeya-release-<id>.zip
```

Before deploying, check space: `du -sh ~` must stay well under 1000 MB (about 500 MB is normal). If low, `rm -rf ~/.npm ~/.trash/*`, and delete `~/pompeya-prev` or `~/old_site` when they are no longer needed.

### 4. Restart (if needed)

cPanel → **Setup Node.js App** → your app → **Restart**. Usually the script's restart is enough; do it if the site still serves the old version.

### Verify (from any terminal; `?x=$RANDOM` bypasses the nginx cache)

```bash
curl -sI "https://pompeya.org.ua/?x=$RANDOM" | grep -i -E "^HTTP|x-powered-by|x-frame"     # 200, Passenger, security headers
curl -s  "https://pompeya.org.ua/?x=$RANDOM" | grep -o 'data-dpl-id="[^"]*"'              # must equal the id build-release printed
curl -s  "https://pompeya.org.ua/?x=$RANDOM" | grep -c "Помилка завантаження"             # 0 = database OK
curl -s  "https://pompeya.org.ua/?x=$RANDOM" | grep -o 'article-title">[^<]*' | head -1   # today's testimony
curl -s  "https://pompeya.org.ua/?page=1&x=$RANDOM" | grep -o 'article-title">[^<]*' | head -1   # newest testimony
```

Then open `https://pompeya.org.ua/` in a **private window**, click a few pages, check images and the two forms (`/feedback`, `/feedback2`). If the browser still shows old content but the commands above are right, it is the nginx or browser cache: hard-reload (Ctrl+Shift+R), or purge the nginx cache in cPanel / ask uahosting.

### Rollback

```bash
cd ~/pompeya-next && rm -rf .next public && cp -a ~/pompeya-prev/. .
rm -rf ~/public_html/_next/static && cp -r ~/pompeya-next/.next/static ~/public_html/_next/static
cp -rf ~/pompeya-next/public/. ~/public_html/
touch ~/pompeya-next/tmp/restart.txt
```

If the packages changed in the bad release, also restore them: `cd ~/pompeya-modules && cp ~/pompeya-prev/package*.json . 2>/dev/null; npm ci --omit=dev` (needs the older lockfile).

### Deploying over SSH (optional, lets Claude do steps 2-4)

SSH is enabled on the host (`pompe120@141.95.64.76`, port 22). A dedicated key exists locally at `~/.ssh/pompeya_deploy` (passphrase-protected) and is authorized in cPanel → SSH Access. The same steps then run as: `scp` the zip to `pompeya-next/`, `ssh` and run `server-deploy.sh`, verify with the curl commands. Nothing is stored in the repo.
Remove the key in cPanel → SSH Access when you no longer want that access; do not reuse the passphrase for anything else.

## How production is set up

| Piece | Where / how |
|---|---|
| App files | `~/pompeya-next/` (`.next`, `public`, `server.js`, `next.config.mjs`, `package.json`, `scripts/`) |
| Dependencies | `~/pompeya-modules/node_modules` (outside the app folder on purpose, see "Why it is odd") |
| Web root | `~/public_html/` holds only the Passenger `.htaccess` block plus **static copies**: `_next/static/` and everything from `public/` |
| Entry point | `server.js`: Passenger startup file; adds `~/pompeya-modules/node_modules` to `NODE_PATH`, repairs the `.next/node_modules/*` link, boots Next |
| Node app | cPanel → **Setup Node.js App**: root `pompeya-next`, URL `pompeya.org.ua` (empty path), startup file `server.js`, Node 24, Production |
| Env vars | Set in the Node.js app screen (not read from `.env`): `MONGODB_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NEXT_PUBLIC_GA_ID` |
| Old PHP site | Backed up in `~/old_site` (delete when not needed). Old URLs `/files/<page>.php` and `/<page>.php` redirect to the new pages (`redirects()` in `next.config.mjs`) |
| Database | MongoDB Atlas, cluster "Pompea" (Frankfurt), database `site`, collection `testimonials`. Atlas **Network Access** must contain the server's outbound IP (`curl -s https://api.ipify.org` on the server) |
| Analytics | Google Analytics 4, `G-CWG9JF9B37`, via `@next/third-parties` in `layout.tsx` (needs `NEXT_PUBLIC_GA_ID` at build time). Check GA4 → Reports → Realtime |
| Disk quota | 1000 MB total. `~/.npm` fills it fast, so delete it after any npm run |

### Why it is odd (read this before "fixing" things)

- **`mongodb+srv://` does not work**: the SRV record for `pompea.j7bzloo.mongodb.net` does not exist in DNS. Use the plain `mongodb://` string with the three shard hosts (`ac-nesprsg-shard-00-0{0,1,2}.j7bzloo.mongodb.net:27017`, `ssl=true&authSource=admin`).
- **CloudLinux deletes `~/pompeya-next/node_modules`** (symlink handling of the Node.js selector). So dependencies live in `~/pompeya-modules` and `server.js` resolves them via `NODE_PATH`. Do **not** use the "Run NPM Install" button.
- **nginx serves static files itself** from `~/public_html/` and sends missing paths to the old PHP catch-all, not to the app. That is why `.next/static` and `public/` must be copied into `public_html/` on every deploy.
- **`/_next/image` is not reachable**, so `images.unoptimized: true`. `<Image>` points straight at files in `public/`.
- **nginx caches responses**, including HTML (`x-cache`, `vary: User-Agent`). Asset URLs get `?dpl=<deploymentId>` so stale JS/CSS/images are bypassed; stale **HTML** needs a cache purge in cPanel or by the host.
- `next.config.mjs` is the only config file. Do not add a `next.config.ts`.

## Debugging

First look at the logs (cPanel → Terminal):

```bash
tail -n 60 ~/logs/passenger.log                 # search the Error ID shown on the Passenger error page
ls ~/pompeya-next/stderr.log && tail -n 40 ~/pompeya-next/stderr.log
cd ~/pompeya-next && node server.js              # run the app by hand to see startup errors (Ctrl+C to stop)
du -sh ~                                         # disk quota
ls ~/pompeya-modules/node_modules/next/package.json
```

| Symptom | Cause / fix |
|---|---|
| Passenger "could not be started" page | Read the log above. `Cannot find module 'next'` means `~/pompeya-modules/node_modules` is missing: reinstall (`cd ~/pompeya-modules && source ~/nodevenv/pompeya-next/24/bin/activate && npm ci --omit=dev`) |
| `Unexpected token '<'` in the console, unstyled page | JS/CSS requests got HTML: `~/public_html/_next/static` missing or stale, or nginx cached an HTML answer. Redo the static copy (`cp -r ~/pompeya-next/.next/static ~/public_html/_next/static`); a new release gives new `?dpl=` URLs |
| Images broken | `public/` not copied into `~/public_html/`, or `/_next/image` URLs in the HTML (the optimizer must stay off) |
| "Помилка завантаження бази даних" on the home page | Atlas IP allowlist (add the server IP), or wrong/rotated `MONGODB_URI` in the Node.js app screen. The real error is logged as `DB Error:` in the Passenger log |
| `querySrv ENOTFOUND` | You used the `mongodb+srv://` string. Use the plain `mongodb://` one |
| Browser shows the old PHP site or an old page | nginx/browser cache. Compare `curl` with `?x=$RANDOM` against the browser; private window; purge the cache. `dig +short pompeya.org.ua` should be `141.95.64.76` |
| `-122` / "disk quota exceeded" | Quota is 1000 MB. `du -sh ~`, then `rm -rf ~/.npm ~/.trash/*`, delete `~/pompeya-prev` / `~/old_site` if unneeded |
| Feedback form lands on `/404` | Failed mail (`Mail Error:` in the log): `SMTP_PASS`/`SMTP_*` missing or wrong in the Node.js app env vars. Also the rate limit (5 submissions per 10 minutes per IP), so repeated testing ends on `/404` too |
| Home page shows the same testimony all day | Expected, it changes at Kyiv midnight. If stuck after midnight, purge the nginx cache |
| Analytics shows nothing | Build had no `NEXT_PUBLIC_GA_ID` (set it in local `.env`, release again), or an ad blocker hides your own visits. Check GA4 Realtime in a private window with extensions off |
| Release works locally but not on the server | Compare `grep -o 'data-dpl-id="[^"]*"'` on the live page with the id the build printed; if it differs the old build is still running: Restart the app |

## Security measures (what exists and where)

- **Dependencies** are kept free of known vulnerabilities (`npm audit --omit=dev` should print 0). Re-check before each release.
- **Headers** (`next.config.mjs`): `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`; `poweredByHeader` is off. No CSP on purpose (Google Analytics and the inline legacy article HTML would break it).
- **Feedback forms** (`src/app/actions.ts`, `src/lib/formGuard.ts`, `src/components/Honeypot.tsx`):
  - hidden honeypot field `website`: a bot that fills it is redirected to `/successful` and nothing is mailed;
  - per-IP rate limit, 5 submissions per 10 minutes (in memory, per server process); over the limit redirects to `/404`;
  - inputs are trimmed, stripped of control characters and length-capped; names are stripped of line breaks, quotes and `<>`; the email is validated;
  - mail is sent *from* the site's own mailbox (`SMTP_USER`) with the visitor's address only in `Reply-To`.
- **Database**: the site only reads `site.testimonials`. Use an Atlas user with read-only access to that database and allow only the server IP in Network Access (not `0.0.0.0/0`).
- **Secrets** live only in the cPanel Node.js app variables and the local, git-ignored `.env`. Never commit or paste them. If one was pasted anywhere (chat, tickets), rotate it: Atlas → Database Access for Mongo, cPanel for MySQL/mail passwords, then update the Node.js app variables and Restart.
- Before big changes take a `public_html` + `~/pompeya-next` zip backup in File Manager.
