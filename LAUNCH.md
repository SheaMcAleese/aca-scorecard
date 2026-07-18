# Launching the ACA Scorecard

Everything is built, tested, and committed. These are your go-live steps,
in order. Budget about 45 minutes end to end, most of it in Kit.

## Step 1: Kit (about 20 minutes)

Work through KIT_SETUP.md top to bottom: five custom fields, the form
(double opt-in OFF), your public API key, the waitlist landing page, and
the two-email automation using the copy in email/. Finish its step 7 test
AFTER deploy (step 4 below), because the test needs the live site.

## Step 2: Fill in the config

Open js/config.js and set:

- KIT_FORM_ID (from Kit, step 2 of the guide)
- KIT_API_KEY (public key only, step 3 of the guide)
- WAITLIST_URL (your waitlist landing page URL)

Leave PAYWALL_ENABLED false and PAYMENT_LINK empty. Commit the change:
open Terminal in the aca-suite folder and run:

    git add -A && git commit -m "Wire Kit config"

## Step 3: Deploy to GitHub Pages (about 5 minutes)

1. On github.com, create a new PUBLIC repository named exactly:
   aca-scorecard (under your SheaMcAleese account). No README, no
   gitignore, completely empty.
2. In Terminal, from the aca-suite folder:

    git remote add origin https://github.com/SheaMcAleese/aca-scorecard.git
    git push -u origin main

3. On the repo page: Settings, then Pages, then under Build and
   deployment choose Deploy from a branch, branch main, folder / (root),
   Save.
4. Wait a few minutes, then open:
   https://sheamcaleese.github.io/aca-scorecard/

If you name the repo anything other than aca-scorecard, the URL changes,
so update these three places and re-commit: og:url and og:image in
index.html, and SHARE_URL in js/config.js.

## Step 4: Test the real path (do not skip)

On your PHONE, using the live URL, not a preview:

1. Open the link. Landing loads fast, fonts and logo show.
2. Run the full scorecard. Back button works. Results feel right.
3. Email yourself the results. Confirmation message appears.
4. In Kit: your subscriber exists and the five aca_ fields hold your
   scores and leak.
5. Results email arrives within minutes, right numbers, exactly one
   action plan block, waitlist button works.
6. Tap Share your score, send it to yourself, check the link and text.
7. Paste the URL into a LinkedIn message draft: the Find your leak share
   card should render.
8. Retake works.
9. Repeat the run once on a laptop.
10. Set the automation wait to 2 days if you shortened it for testing.

If anything on this list fails, stop and tell Claude what step broke.

## Step 5: Launch

- Announce it: run the announcement through the Content Engine ("run this
  through the engine"), linking the live URL. Your existing ACA series
  posts are the natural warm-up.
- Add the link wherever ELV8 lives: LinkedIn featured section, elv8.nz.
- Archive the old aca-audit repo folder (ELV8 - Claude/aca-audit/ can
  move to Archive/; it never deployed, nothing links to it).

## Rollback

Bad deploy: repo Settings, Pages, set Source to None. The site goes dark
in minutes. Fix, push, re-enable. Nothing about the app can touch your
Kit list or send email on its own; worst case is a page outage.

## Maintenance map

- Question wording: js/questions.js
- Results copy, verdicts, reads, action-plan moves: js/content.js (keep
  email/results-email.md in step, the copy is duplicated there on purpose)
- Kit, waitlist, paid gate switches: js/config.js
- Landing copy: index.html (the #landing section)
- Look and feel: css/styles.css
- Share card image: edit design/og-card.html, then re-render from the
  aca-suite folder with:

      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        --headless --disable-gpu --screenshot="assets/og.png" \
        --window-size=1200,630 --hide-scrollbars \
        "file://$(pwd)/design/og-card.html"

  (design/ stays local only, it is gitignored and never deploys)

After launch, tell Claude to add the live URL to the Build Ledger and the
Fleet Medic's watch list so it gets pinged every Monday.
