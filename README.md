# Hamza Gold Collection — Price History Recorder

A tiny, free background job that records gold, silver, and USD/PKR prices
every 10 minutes into `data/price-history.json`, so the live board's 1H/4H/1D
badges can be accurate for every visitor from the moment they open the page —
not just after their own browser has been open long enough.

## Setup (10 minutes, no cost, no card required)

1. Go to https://github.com and create a free account if you don't have one.
2. Click "New repository". Name it anything (e.g. `hamza-gold-history`).
   Make it **Public** (so the price file can be read by the board without
   any login) and don't add a README (you already have one here).
3. Upload all the files in this folder into that repo, keeping the same
   folder structure (`.github/workflows/record-price.yml`,
   `scripts/record.mjs`, `data/price-history.json`). On GitHub's web
   interface: "Add file" → "Upload files", then drag in this whole folder.
4. Go to the repo's **Actions** tab. GitHub may ask you to enable Actions
   for the repo — click enable. You should see the "Record gold/silver/
   USD-PKR prices" workflow listed.
5. Click into it and press "Run workflow" once manually, to check it works
   and to get the first data point recorded immediately (don't wait for
   the schedule).
6. After it runs, check `data/price-history.json` in your repo — it should
   now have one entry in each of XAU/XAG/FX.
7. Copy your repo's raw file URL. It looks like:
   `https://raw.githubusercontent.com/YOUR-USERNAME/YOUR-REPO/main/data/price-history.json`
8. Paste that URL into the `REMOTE_HISTORY_URL` line near the top of the
   `<script>` in your live board HTML file (I've left a clear placeholder
   there for you), then re-save/host that file as usual.

## What to expect

- It records a data point every ~10 minutes. GitHub's free scheduled runs
  can occasionally be delayed by a few minutes under load — that's normal
  and won't meaningfully affect the 1H/4H/1D figures.
- **Important:** GitHub automatically disables scheduled workflows after
  60 days with no other activity in the repo. If your board's badges
  suddenly stop updating months from now, go back to the Actions tab and
  click "Enable workflow" (or just re-run it once manually) — it's a
  one-click fix, not a rebuild.
- The repo is public so the price file can be fetched by anyone's browser
  without a login, but there's nothing sensitive in it — just timestamps
  and gold/silver/PKR numbers.
