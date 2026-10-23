# Pompeya 

```bash
# 1. on your computer, in this folder
npm run dev                       # edit and check locally (http://localhost:3000)
scripts/build-release.sh          # builds and writes ~/Downloads/pompeya-release-<id>.zip

# 2. upload that zip to ~/pompeya-next/  (cPanel -> File Manager -> Upload)

# 3. cPanel -> Terminal
bash ~/pompeya-next/scripts/server-deploy.sh pompeya-release-<id>.zip

# 4. cPanel -> Setup Node.js App -> Restart (only if the site did not change), then verify (see "Verify")
```

Env var changes (passwords, `SMTP_PASS`, ...) need **no release**: edit them in cPanel → Setup Node.js App and click Restart.
Testimonies are data, not code: edit them in MongoDB Atlas, no release needed.

## Changing the site

| I want to change... | Edit |
|---|---|
| Text of an article page (История, Вервиця, Параман, ...) | `src/app/<route>/page.tsx` (most hold legacy HTML in `dangerouslySetInnerHTML`) |
| Menu and links | `src/components/RightMenu.tsx` |
| Header, footer, page frame, Google Analytics tag | `src/app/layout.tsx` |
| Colors, fonts, card styles | `src/app/globals.css` |
| Home page (testimony of the day, pagination) | `src/app/page.tsx`, `src/lib/dailyPage.ts` |
| Feedback forms and their mail | `src/app/feedback*/page.tsx`, `src/app/actions.ts`, `src/lib/formGuard.ts` |
| Images, fonts, static files | `public/` (served at `/images/...`, `/img/...`, `/fonts/...`) |
| Old-URL redirects, security headers | `next.config.mjs` |
| A new page | new `src/app/<name>/page.tsx`, linked from `RightMenu.tsx` |

Rules:
- Any change, including `public/`, needs a release (the deploy script copies `public/` into `~/public_html/`).
- Keep `next.config.mjs` as the only config file (production has no TypeScript, so no `next.config.ts`).
- Do not rely on `/_next/image`; the optimizer is off (`images.unoptimized: true`).
- New dependency: `npm install <pkg>` and commit `package.json` + `package-lock.json`. The deploy script reinstalls on the server when the lockfile changed.
- Before releasing: `npm run build` passes and `npm audit --omit=dev` shows 0 vulnerabilities.

### Local setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill it in (`.env` is git-ignored; never commit or paste it). Variables: `MONGODB_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NEXT_PUBLIC_GA_ID`.
- `NEXT_PUBLIC_GA_ID` is read at **build** time, so it must be in `.env` when you build a release, or Analytics is missing from it.
- `MONGODB_URI` must be the plain `mongodb://` string with the three shard hosts, not `mongodb+srv://` (see "Production quirks").

### Testimonies

MongoDB Atlas, database `site`, collection `testimonials`, fields `title`, `text`, `author`, `date`.
`/` shows one testimony per day (Kyiv date), walking oldest → newest and then starting over (`src/lib/dailyPage.ts`); adding one changes the cycle length, so that day's pick can change. `/?page=N` shows exactly page N (newest first).

## Releasing

**1. Build** (`scripts/build-release.sh`): sets a new `deploymentId` in `next.config.mjs` (adds `?dpl=<id>` to every asset URL, bypassing stale caches), runs `npm run build`, and writes `~/Downloads/pompeya-release-<id>.zip` (`.next`, `public`, `server.js`, `next.config.mjs`, `package*.json`, `scripts/server-deploy.sh`; no `.env`, no `node_modules`). It prints the id and the deploy command.

**2. Upload:** cPanel → File Manager → `~/pompeya-next` → Upload the zip. Check space first: `du -sh ~` should be well under 1000 MB (about 500 MB is normal); otherwise free some (see Debugging).

**3. Deploy:** `bash ~/pompeya-next/scripts/server-deploy.sh pompeya-release-<id>.zip`. It keeps the old build in `~/pompeya-prev`, replaces `.next`, `public`, `server.js` and the config (not `node_modules`), reinstalls `~/pompeya-modules` only if `package-lock.json` changed (about a minute, needs about 350 MB free), refreshes the static copies in `~/public_html`, deletes the zip and touches `tmp/restart.txt`.
The very first time the script is not on the server yet:
`cd ~/pompeya-next && unzip -oq pompeya-release-<id>.zip scripts/server-deploy.sh && bash scripts/server-deploy.sh pompeya-release-<id>.zip`

**4. Restart:** Setup Node.js App → Restart, if the site still serves the old version.

### Verify

`?x=$RANDOM` bypasses the nginx cache:

```bash
curl -sI "https://pompeya.org.ua/?x=$RANDOM" | grep -i -E "^HTTP|x-powered-by|x-frame"          # 200, Passenger, security headers
curl -s  "https://pompeya.org.ua/?x=$RANDOM" | grep -o 'data-dpl-id="[^"]*"'                   # equals the id build-release printed
curl -s  "https://pompeya.org.ua/?x=$RANDOM" | grep -c "Помилка завантаження"                  # 0 = database OK
curl -s  "https://pompeya.org.ua/?x=$RANDOM" | grep -o 'article-title">[^<]*' | head -1        # today's testimony
curl -s  "https://pompeya.org.ua/?page=1&x=$RANDOM" | grep -o 'article-title">[^<]*' | head -1  # newest testimony
```

Then open the site in a private window, click a few pages, and test both forms (`/feedback`, `/feedback2`). If the browser still shows old content while the commands are right, it is a cache: hard-reload (Ctrl+Shift+R) or purge the nginx cache (cPanel, or ask uahosting).

### Rollback

```bash
cd ~/pompeya-next && rm -rf .next public && cp -a ~/pompeya-prev/. .
rm -rf ~/public_html/_next/static && cp -r .next/static ~/public_html/_next/static
cp -rf public/. ~/public_html/ && touch tmp/restart.txt
```

If the bad release changed dependencies, reinstall the old ones too (`~/pompeya-prev` has the old `package*.json`).

### Deploying over SSH (optional)

SSH is enabled (`<cpanel-user>@<server-ip>`, port 22) with a dedicated, passphrase-protected key, authorized in cPanel → SSH Access. Host, user and key path are kept outside the repo. With it, Claude can do steps 2-4: `scp` the zip, run `server-deploy.sh` over `ssh`, run the verify commands. Nothing secret is stored in the repo. Remove the key in cPanel when you no longer want that access.

## Production setup

| Piece | Where / how |
|---|---|
| App files | `~/pompeya-next/` (`.next`, `public`, `server.js`, `next.config.mjs`, `package.json`, `scripts/`) |
| Dependencies | `~/pompeya-modules/node_modules` (outside the app folder on purpose) |
| Web root | `~/public_html/`: only the Passenger `.htaccess` block plus static copies of `_next/static/` and `public/` |
| Entry point | `server.js` (Passenger startup file): adds `~/pompeya-modules/node_modules` to `NODE_PATH`, repairs the `.next/node_modules/*` link, boots Next |
| Node app | cPanel → Setup Node.js App: root `pompeya-next`, URL `pompeya.org.ua` (empty path), startup `server.js`, Node 24, Production |
| Env vars | In the Node.js app screen, not read from `.env`: `MONGODB_URI`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NEXT_PUBLIC_GA_ID` |
| Old PHP site | Backup in `~/old_site`. Old URLs `/files/<page>.php` and `/<page>.php` redirect to the new pages (`redirects()` in `next.config.mjs`) |
| Database | MongoDB Atlas, cluster "Pompea" (Frankfurt). Network Access must contain the server's outbound IP (`curl -s https://api.ipify.org` on the server) |
| Analytics | GA4 (Measurement ID in `NEXT_PUBLIC_GA_ID`) via `@next/third-parties` in `layout.tsx`; check GA4 → Reports → Realtime |
| Disk quota | 1000 MB total |

### Production quirks (read before "fixing" things)

- **`mongodb+srv://` does not work**: the SRV record of the cluster host does not exist in DNS. Use `mongodb://` with the three shard hosts (`<shard-00-00>,<shard-00-01>,<shard-00-02>`, port 27017, from Atlas → Connect → Drivers → older connection string) and `ssl=true&authSource=admin` (error otherwise: `querySrv ENOTFOUND`).
- **CloudLinux deletes `~/pompeya-next/node_modules`**, hence `~/pompeya-modules` and `NODE_PATH`. Never click "Run NPM Install".
- **nginx serves static files itself** from `~/public_html/` and sends missing paths to the old PHP catch-all, not to the app. So `.next/static` and `public/` must be copied there on every deploy, and `/_next/image` is unreachable.
- **nginx caches responses**, HTML included. `?dpl=<id>` refreshes JS/CSS/images on every release; stale HTML needs a cache purge.

## Debugging

```bash
tail -n 60 ~/logs/passenger.log                  # search the Error ID from the Passenger error page
tail -n 40 ~/pompeya-next/stderr.log             # if it exists
cd ~/pompeya-next && node server.js              # run the app by hand to see startup errors (Ctrl+C to stop)
du -sh ~                                         # disk quota
```

| Symptom | Cause / fix |
|---|---|
| Passenger "could not be started" | Read the log. `Cannot find module 'next'`: `~/pompeya-modules/node_modules` is missing, so reinstall: `source ~/nodevenv/pompeya-next/24/bin/activate && cd ~/pompeya-modules && npm ci --omit=dev` |
| Unstyled page, `Unexpected token '<'` in the console, broken images | Static copies missing or stale in `~/public_html` (`_next/static`, `images/`, ...): redo the copy from the Rollback block, or release again |
| "Помилка завантаження бази даних" | Server IP not in Atlas Network Access, or wrong/rotated `MONGODB_URI` in the Node.js app screen. Real error: `DB Error:` in the log |
| Old PHP site or old page in the browser | Cache. Compare `curl ...?x=$RANDOM` with the browser, use a private window, purge the cache. `dig +short pompeya.org.ua` should return the server IP |
| Live `data-dpl-id` differs from the id the build printed | The old build is still running: Restart the app |
| `-122` / "disk quota exceeded" | `rm -rf ~/.npm ~/.trash/*`; delete `~/pompeya-prev` / `~/old_site` if unneeded |
| Feedback form ends on `/404` | `SMTP_*` missing or wrong (`Mail Error:` in the log), or the rate limit (5 per 10 minutes per IP; repeated testing hits it too) |
| Home shows the same testimony all day | Normal until Kyiv midnight; if stuck after that, purge the cache |
| Analytics empty | Build had no `NEXT_PUBLIC_GA_ID` (set it in `.env`, release again), or an ad blocker hides your own visits |

## Security

- **Dependencies:** `npm audit --omit=dev` should print 0; re-check before each release.
- **Headers** (`next.config.mjs`): `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`; no `X-Powered-By`. No CSP on purpose (Google Analytics and the inline legacy HTML would break it).
- **Feedback forms** (`actions.ts`, `formGuard.ts`, `Honeypot.tsx`): hidden honeypot field `website` (a filled one is redirected to `/successful`, nothing is mailed); per-IP rate limit of 5 submissions per 10 minutes (in memory, per process); trimmed, control-character-free, length-capped input; names stripped of line breaks, quotes and `<>`; email validated; mail is sent from the site's own mailbox (`SMTP_USER`) with the visitor only in `Reply-To`.
- **Database:** the site only reads `site.testimonials`. Use an Atlas user with read-only access to that database and allow only the server IP (not `0.0.0.0/0`).
- **Secrets** live only in the Node.js app variables and the local `.env`. Never commit or paste them; if one leaks, rotate it (Atlas → Database Access, cPanel for MySQL/mail), update the variables, Restart.
- Take a `public_html` + `~/pompeya-next` zip backup (File Manager) before big changes.
