# Kit setup for the ACA Scorecard

Cost: $0, on Kit's FREE Newsletter plan (up to 10,000 subscribers,
unlimited forms, landing pages, and broadcasts). Sign up at kit.com and
pick the free plan.

Correction (19 Jul 2026): an earlier version of this guide said the free
plan includes one automation and one email sequence. On checking a real
account, Kit's free plan does not — Sequences and Visual Automations are
both locked behind the paid Creator plan ($39/mo), which Shea has decided
against. So Kit's job here is now just building the subscriber list (this
guide); EMAILJS_SETUP.md handles actually sending the results email, for
free, from the browser. Do that guide too, it is the one that matters for
the app to work.

One-time setup, about 15 minutes in your Kit account. Do the steps in
order: the custom fields must exist before anything else, because Kit
silently discards data sent to fields that do not exist yet.

## 1. Create the five custom fields

Kit: Subscribers, then Custom Fields (or open any subscriber and Add a
custom field). Create these five, named exactly like this, lowercase with
underscores:

- aca_accountability
- aca_consistency
- aca_action
- aca_overall
- aca_leak

After creating them, check the field key Kit shows matches the name above
exactly. The app sends scores to these keys; a mismatch means the emails
show blanks.

## 2. Create the form

Kit: Grow, then Landing Pages and Forms, then Create new, choose Form,
inline, any template (it is never displayed anywhere, it only exists as
the address the app posts to). Name it: ACA Scorecard.

Find the form ID: open the form and look at the URL, the number in it is
the form ID (for example .../forms/1234567/edit means the ID is 1234567).

IMPORTANT, in the form's Settings:
- Incentive: turn OFF "Send incentive email" (auto-confirm subscribers).
  If you leave double opt-in on, people get a confirm-your-email message
  instead of their results, and the results email only arrives after they
  confirm. For a results-delivery flow you want it off.

## 3. Get your public API key

Kit: Settings, then Developer (or API Keys). Copy the v3 API Key, the one
labelled public. Never copy the API Secret into anything in this project.

## 4. Paste both into the app

Open js/config.js and fill in:

- KIT_FORM_ID: 'the number from step 2'
- KIT_API_KEY: 'the public key from step 3'

That is the only code change. The email capture card appears automatically
once both are set.

## 5. Create the waitlist landing page

Kit: Grow, then Landing Pages and Forms, then Create new, choose Landing
page. Name it: The ACA Framework for Coaches waitlist. Keep the page dead
simple: headline, one line on the six week programme, email field. Publish
and copy its URL into WAITLIST_URL in js/config.js. The waitlist block on
the results screen appears automatically once it is set.

Anyone who joins there is your pre-sale evidence list for the 31 October
build-or-kill decision.

## 6. Test before launch

1. Run the scorecard end to end with your own email.
2. Check the subscriber in Kit: the five aca_ fields should hold your
   scores and leak. (This confirms the list is building correctly. The
   actual email arriving in your inbox is EmailJS's job, tested in
   EMAILJS_SETUP.md step 6.)

If scores show blank against the subscriber, the field keys from step 1
do not match; fix the field names and retest.

## Next: EMAILJS_SETUP.md

Kit's part is done. Go do EMAILJS_SETUP.md now, that is what actually
sends the results email and the weekly follow-up.
