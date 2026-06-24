# Deploying ML² to Firebase Hosting

This guide walks through putting the app online using Firebase Hosting, from
a completely clean computer. Follow it in order — each step depends on the
one before it.

---

## Before you start: what you need

- A computer (Mac or Windows) — not an iPad, this part needs a real terminal
- A Google account (the same one tied to this project's Firebase database is ideal)
- About 20–30 minutes for the first deploy

---

## Step 1 — Install Node.js (skip if already installed)

Open a terminal and run:

```
node --version
```

If you see a version number (v18 or higher), skip to Step 2.

If you see "command not found": go to **nodejs.org**, download the **LTS**
version, run the installer, then **close and reopen your terminal** before
continuing.

---

## Step 2 — Unzip the project and install dependencies

1. Unzip the file you received. You'll get a folder — open a terminal and
   navigate into it:

   ```
   cd path/to/the/unzipped/folder
   ```

   (Mac shortcut: type `cd ` with a trailing space, then drag the folder
   into the terminal window — it fills in the path for you.)

2. Install the project's dependencies:

   ```
   npm install
   ```

   This takes a minute or two the first time.

---

## Step 3 — Set the real configuration before deploying

A few values in this project are placeholders that **must** be changed
before this goes live for real use:

### 3a. The dispatch email

Open `src/data/dispatchConfig.ts` and replace:

```ts
export const DISPATCH_EMAIL = "REPLACE_WITH_SECURE_HOSPITAL_ADDRESS@example.org";
```

with the actual secure hospital address that should receive reorder/dispatch
notifications.

### 3b. The edit password

The file `.env.local` already contains:

```
VITE_EDIT_PASSWORD="mlsquared"
```

Change this to whatever you want the real team password to be. This file is
already excluded from git (it won't be committed if you push this to
GitHub), but make sure to keep a private copy of it — Firebase Hosting itself
doesn't read this file; you'll re-enter the same value as an environment
variable in Step 6.

### 3c. (Optional, recommended) Firebase App Check

This is a real security layer but requires a one-time setup in the Firebase
console. You can deploy without it and add it later — the app works either
way, just without this extra protection until you do this:

1. Go to the [Firebase console](https://console.firebase.google.com), open
   this project.
2. In the left sidebar, find **App Check**.
3. Register your web app, choose **reCAPTCHA v3** as the provider.
4. Firebase will give you a **site key** — copy it.
5. Add it to `.env.local`:

   ```
   VITE_RECAPTCHA_SITE_KEY="paste-your-site-key-here"
   ```

6. **Leave enforcement "Unenforced" for now.** Only switch it to "Enforced"
   in the App Check dashboard after confirming the live app works normally
   with the key in place — switching too early, before confirming the key
   works, can lock out the real app along with anyone trying to bypass it.

---

## Step 4 — Build the app

```
npm run build
```

This compiles everything into a `dist` folder — this is the actual set of
files that gets uploaded to Firebase. If this step shows errors, **stop and
fix them before continuing** — don't deploy a build that failed.

---

## Step 5 — Install the Firebase CLI (one-time, per computer)

```
npm install -g firebase-tools
```

Then log in (this opens a browser window to sign into your Google account):

```
firebase login
```

---

## Step 6 — Connect this project to your Firebase project

If a `.firebaserc` file doesn't already exist in the folder, run:

```
firebase use --add
```

It will list your Firebase projects — pick the one this app's database
belongs to (the same project referenced in `firebase-applet-config.json`).

### Set the environment variables Firebase Hosting needs

Firebase Hosting (the static-file hosting part) doesn't run server code, so
the `VITE_...` variables need to be baked in at **build time**, not set
later in a dashboard. This means: make sure `.env.local` has the real values
**before** running `npm run build` in Step 4. If you change `.env.local`
after building, you must run `npm run build` again before redeploying.

---

## Step 7 — Deploy

If this is the very first deploy, initialize hosting (only needed once):

```
firebase init hosting
```

When asked:
- **What do you want to use as your public directory?** → type `dist`
- **Configure as a single-page app (rewrite all urls to /index.html)?** → **Yes**
- **Set up automatic builds with GitHub?** → No (unless you want this later)
- If it asks to overwrite `firebase.json` — say **No**, this project already
  has one configured with security headers.

Then deploy:

```
firebase deploy --only hosting
```

When it finishes, it prints a URL like:

```
Hosting URL: https://your-project-id.web.app
```

**That's the live app.** Open it in any browser, on any device.

---

## Step 8 — Verify it actually works

Before telling anyone to use it:

- Open the URL on your own phone and confirm the set list shows **30 sets**
- Try the password gate with your real password from Step 3b
- Submit a test flag and confirm it appears in the Secure Archive
- Check the browser tab shows the ML² icon and title
- On iPhone Safari: tap Share → **Add to Home Screen** — confirm it installs
  with the ML² icon and opens full-screen

---

## Making changes after the first deploy

Every time you edit the code:

```
npm run build
firebase deploy --only hosting
```

That's it — two commands. The live URL stays the same; it just updates the
content. This typically takes under a minute.

If you only changed `.env.local` (e.g. rotating the password), you still
need to run `npm run build` first — environment variables are baked into the
build, not read live.

---

## Firestore rules and database

The database itself (Firestore) is **separate** from hosting and is not
touched by `firebase deploy --only hosting`. If you ever update
`firestore.rules`, deploy those specifically with:

```
firebase deploy --only firestore:rules
```

---

## If something goes wrong

- **Build fails (Step 4):** copy the exact error text — it's a real bug to
  fix in the code, not a Firebase issue.
- **`firebase deploy` fails with a permissions error:** run `firebase login`
  again, and confirm `firebase use` is pointed at the right project.
- **The live site shows old data after deploying:** hard-refresh the
  browser (the static files may be cached) — Ctrl+Shift+R / Cmd+Shift+R.
- **App Check breaks the live app after enforcing it:** go back into the
  Firebase console → App Check → and switch enforcement back to
  "Unenforced" immediately, then double check the site key in `.env.local`
  matches exactly what the console shows, rebuild, and redeploy before
  re-enforcing.
