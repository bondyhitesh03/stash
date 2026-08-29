# Stash — installable expense tracker with cross-device sync

Stash is a Progressive Web App (PWA). Once it's deployed, you install it
straight from the browser on both your Mac and your phone — no App Store,
no `.dmg`, no `.apk` — and it stays in sync between them because both
copies read and write to the same Supabase database in real time.

This README walks through everything from zero: setting up the backend,
running it locally, and installing it on your devices.

---

## 1. Create your Supabase project (free)

1. Go to [supabase.com](https://supabase.com) and sign up / sign in.
2. Click **New project**. Pick any name and password (you won't need the
   password day-to-day — you'll sign in with a magic-link email instead).
3. Wait ~2 minutes for it to finish provisioning.
4. Open **SQL Editor** in the left sidebar → **New query**, paste in the
   contents of [`supabase/schema.sql`](./supabase/schema.sql), and run it.
   This creates the `stash_data` table and locks it down so each person
   can only ever see their own data.
5. Open **Authentication → Providers** and confirm **Email** is enabled
   (it is by default). This is what sends you the sign-in link.
6. Open **Authentication → URL Configuration** and add the URLs you'll
   use to the **Redirect URLs** list:
   - `http://localhost:5173` (for local testing)
   - your real deployed URL once you have one (step 4 below), e.g.
     `https://stash-yourname.vercel.app`
7. Open **Settings → API**. You'll need two values from this page in a
   moment: **Project URL** and the **anon public** key.

## 2. Run it locally

You'll need [Node.js](https://nodejs.org) installed (v18+).

```bash npm install cp.env.example.env
```

Open `.env` and paste in your Project URL and anon key from step 1.7:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then:

```bash
npm run dev
```

Open the printed `http://localhost:5173` address. Enter your email, open
the sign-in link it sends you, and you're in. Add an expense — it's
already saving to Supabase, not just your browser.

## 3. Build it

```bash
npm run build
```

This produces a `dist/` folder — a complete, installable PWA (including
the manifest and offline service worker, generated automatically by
`vite-plugin-pwa`).

## 4. Deploy it somewhere with a public URL

A phone can't reach `localhost` on your Mac, so you need to host `dist/`
somewhere public. The easiest free option is **Vercel**:

```bash
npm install -g vercel
vercel
```

Follow the prompts (first run asks a few setup questions — accept the
defaults). When it asks about environment variables, or afterward in the
Vercel dashboard under **Settings → Environment Variables**, add the same
two values from your `.env`. Redeploy after adding them if you added them
after the first deploy.

Netlify works the same way if you'd rather use that — either drag-and-drop
the `dist/` folder in their dashboard, or connect your GitHub repo.

Once deployed, go back to Supabase **Authentication → URL Configuration**
and make sure your real deployed URL is in the **Redirect URLs** list (you
added a placeholder for this in step 1.6 — update it to the real one).

## 5. Install it

**On your phone (Android, Chrome):**
Open your deployed URL → tap the **⋮** menu → **Add to Home screen** /
**Install app**. It now opens full-screen like any other app.

**On your Mac (Chrome or Edge):**
Open your deployed URL → click the install icon in the address bar (or
**⋮** menu → **Install Stash…**). It opens in its own window and shows up
in Launchpad.

**On your Mac (Safari, macOS Sonoma+):**
Open your deployed URL → **File → Add to Dock**.

Sign in with the **same email** on both. Add an expense on your phone —
it appears on your Mac within a second or two, and vice versa, thanks to
Supabase Realtime.

---

## How the sync actually works

- All your data (expenses, budget, custom categories) lives in one row
  in the `stash_data` table, keyed to your Supabase user ID.
- Every change you make writes that row.
- Every device also *listens* for changes to that row (Supabase Realtime)
  and updates its screen the moment another device writes — no polling,
  no manual refresh.
- If you're offline, changes stay on that device and sync once you're
  back online; Settings shows a small sync status indicator so you can
  tell.
- This is last-write-wins: if you somehow edit the exact same thing on
  two devices in the same instant, the later write sticks. For a
  single-person expense tracker this essentially never comes up in
  practice.

## Wanting real native `.dmg` / `.apk` files later

This PWA already gets you installable, icon-on-the-home-screen apps on
both platforms with zero app-store friction. If you later want genuine
native binaries (e.g. to distribute to other people, or use native-only
device APIs), the natural next step — once this is working — is wrapping
the same codebase:

- **macOS `.dmg`**: [Tauri](https://tauri.app) (smaller, faster) or
  [Electron](https://www.electronjs.org)
- **Android `.apk`**: [Capacitor](https://capacitorjs.com) (wraps this
  exact web app) or a React Native rewrite

Both would reuse this same Supabase backend, so the data model and sync
logic here carry over unchanged.
