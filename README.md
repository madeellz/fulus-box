# Fulus Box 💸 — Mohamed & Marmora's money diary

A retro, red, Alexandria-flavoured expense tracker for two, built for iPhone (X / 11).
Static files only: no server, no database, no tracking.

```
fulus-box/
├── index.html            ← page structure (welcome screen, tabs, add form)
├── style.css             ← retro red design, fonts, layout
├── app.js                ← CONFIG, categories, jokes, advice and all the logic
├── manifest.webmanifest  ← "Add to Home Screen" app info
├── README.md
└── assets/
    ├── favicon.svg
    ├── apple-touch-icon.png
    └── icon-512.png
```

## What it does

* **Welcome screen**: pick **Mohamed** or **Marmora**. Each person has their own history.
  Tap the name chip (top right) to switch.
* **➕ Add**: amount (Arabic digits work too), date/time (defaults to **now**, with
  Yesterday and 2-days-ago shortcuts, and you can pick any date from 1 Oct 2026),
  category, payment method (Cash / Card / InstaPay / Vodafone Cash) and a note.
* **History**: grouped by day with daily totals. Filter by month and category, and switch
  between **Mine / Partner's / Ours**. Tap an entry to edit, delete, react with an emoji,
  or ask **🤨 "Explain this!"**.
* **Analysis**: **W1 (1–7), W2 (8–14), W3 (15–21), W4 (22–end)** or the **whole month**.
  Shows the total, **biggest and lowest category**, daily average, biggest single expense,
  most expensive day, a donut chart, bars per category with budget status, a week-by-week
  chart, a "who spent more" duel and the categories you didn't touch.
* **More**: **categories per month**. Each month has its own list: remove, add back or
  create new ones. A new month starts as a copy of the previous one, so changes never
  rewrite old months. You can also set **monthly budgets** per category for each person,
  and send or import backups.

## ✏️ Things you can edit (top of `app.js`)

* `PEOPLE`: names, emojis and nicknames.
* `DEFAULT_CATS`: the starting categories (name, Arabic name, emoji).
* `JOKES`, `ADVICE`, `CAT_TOASTS`: add your own jokes and advice.
* `BIG_SPEND`: the amount that triggers the "Mohamed, sit down" message.

## 🔒 Where the data lives (important)

Like Baby Adel, everything is saved **in the browser on each phone** (localStorage).

* Mohamed's phone and Marmora's phone **do not sync automatically**.
* To see **Ours 💞** with both people's spending, go to **More → Send backup**, send the file
  on WhatsApp, and the other person taps **More → Import**. Entries are merged by ID, so
  importing twice never creates duplicates. Reactions and "Explain this" questions travel
  the same way.
* If you both use **one phone**, "Ours" works straight away.
* Clearing Safari website data or using Private mode erases entries, so send a backup
  now and then.

Want real automatic sync later? You'd need a small free backend (e.g. Firebase or
Supabase). The app is ready to extend for that.

## 🚀 Publish on GitHub Pages

1. On github.com: **+ → New repository** → name it e.g. `fulus-box` → **Public** → Create.
2. **Add file → Upload files** → drag in everything **inside** the `fulus-box` folder
   (`index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `README.md`) **and** the
   `assets` folder → **Commit changes**.
   `index.html` must be at the top level of the repository.
3. **Settings → Pages** → Source: **Deploy from a branch** → Branch **main**, folder **/ (root)** → Save.
4. After 1–2 minutes you'll have `https://YOUR-USERNAME.github.io/fulus-box/`.
5. On each iPhone, open it in **Safari** → **Share → Add to Home Screen**. It opens full-screen
   like an app with the red coin icon.

To update: open the file on GitHub → ✏️ → edit → **Commit changes** → refresh the phone after
about a minute. Data on the phones is not affected by updates.

## Fine print
Jokes are affectionate. No real financial advice here, just Egyptian wisdom. 🙂
