# ACA Suite (working name: The ACA Scorecard)

Launch-ready v1 of the ACA assessment product for ELV8 Performance.
Supersedes `aca-audit/` (decision: Shea, 18 July 2026). The aca-audit repo
never deployed; archive it once this ships.

## What v1 is

One mobile-first single-page web app, static host (GitHub Pages):

1. Landing screen that converts to the assessment
2. 15-question ACA assessment (5 per pillar, 1 to 5 frequency scale)
3. Results: score out of 100 per pillar, weakest pillar named as the leak
4. Tailored action plan for the leak pillar, drawn from ELV8_ACA_Framework.md
5. Email capture via Kit; Kit automation emails the results
6. Soft CTA: waitlist for The ACA Framework for Coaches (feeds the 20-pre-sale
   validation bar, decision date 31 Oct 2026)

Parked for v2: dashboard, paid tiers, accounts, login. A paid gate is built
behind a config flag but OFF and disconnected in v1: with PAYWALL_ENABLED
true AND a PAYMENT_LINK set in js/config.js, the action plan hides behind
an unlock button pointing at the payment link. Both stay unset in v1. Know
before turning it on: it is a client-side gate (no backend), so it filters
honest users, it does not stop a determined one. Real enforcement means
delivering the plan by email after purchase instead; decide that when the
gate earns its keep.

## Stack (decided Phase 1)

- Vanilla HTML + CSS + JS. No framework, no build step, no npm. A solo founder
  can edit any file in a text editor and re-push.
- Fonts: Google Fonts (Playfair Display, Montserrat), same as elv8.nz.
- Email: Kit form endpoint, posted from the browser with fetch. Custom fields
  carry the three pillar scores + leak pillar so the Kit automation can send a
  personalised results email. No secret keys in the client: the public form
  action endpoint only.
- Host: GitHub Pages, project site. Proposed repo name: `aca-scorecard`
  (final URL: sheamcaleese.github.io/aca-scorecard). Confirm at Phase 6.

## File structure

```
aca-suite/
  index.html          SPA shell: landing, quiz, results screens
  css/styles.css      All styling, tokens from brand/DESIGN.md verbatim
  js/config.js        Kit form ID, feature flags (PAYWALL_ENABLED=false)
  js/questions.js     The approved 15-question set + answer scale
  js/content.js       Results copy: pillar reads, verdicts, action plans
  js/app.js           Flow, scoring engine, Kit submit
  assets/             Logo, og image
  design/             Internal design preview + og card source (gitignored,
                      never deploys; keep locally for og.png re-renders)
  README.md           This file
  LAUNCH.md           Written in Phase 6: deploy steps + launch checklist
```

Content lives in `js/questions.js` and `js/content.js` only, so copy edits
never touch logic.

## Scoring model (spec; engine built and edge-tested in Phase 2)

- Each answer scores 1 to 5 (Never .. Every time).
- Pillar raw score: sum of its 5 answers, range 5 to 25.
- Pillar score /100: ((raw - 5) / 20) * 100, rounded. All-Never = 0,
  all-Every time = 100.
- Tiers per pillar: Holding / Leaking / Missing (thresholds fixed in Phase 2
  and aligned with the audit's tier language).
- The leak: lowest pillar score. Ties break to the earliest pillar in the
  sequence, because the framework is sequential (Accountability before
  Consistency before Action).

## Data flow

Answers stay in the browser. Nothing is sent anywhere unless the user submits
the email form. On submit: email + pillar scores + leak go to Kit; Kit tags
the subscriber and an automation sends the results email. Waitlist CTA adds a
second tag on the same subscriber.

## Hard rules carried from the brief

- ACA content only from `_context/ELV8_ACA_Framework.md`. No invented
  methodology. Shea's wording character for character once he supplies it.
- Zero em dashes, zero emojis in user-facing copy. Verify by character scan.
- Palette lock: #222222 / #FFFFFF / #D4AF37 plus DESIGN.md neutrals. No green.
- Gold appears once per screen. Sharp corners everywhere (radius 0).
- No live deploy, no live payment, no sending: Shea does the go-live step.
