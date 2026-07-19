# EmailJS setup for the ACA Scorecard

Cost: $0. EmailJS sends the results email straight from the browser, no
backend needed, free up to 200 emails a month (plenty for launch volume).
This replaces the Kit automation Kit's free plan does not include. Kit is
still used, just for building your subscriber list (KIT_SETUP.md); this is
the piece that actually delivers the email.

One-time setup, about 15 minutes.

## 1. Sign up

Go to emailjs.com, create a free account.

## 2. Connect an email service

EmailJS: Email Services, then Add New Service. Pick Gmail (or whichever
inbox you want the emails to send from) and connect it. After connecting,
copy the Service ID it shows you.

## 3. Create the template

EmailJS: Email Templates, then Create New Template. Name it: ACA Scorecard
Results.

Set the "To email" field to `{{to_email}}`.

Set the subject to:

    Your ACA Scorecard

Paste this into the body (switch the editor to plain text/code view if it
tries to force a visual builder). The double-curly parts fill in
automatically per subscriber, already personalised, nothing more to
configure:

```
Your numbers are in.

Accountability: {{accountability_score}} out of 100
Consistency: {{consistency_score}} out of 100
Action: {{action_score}} out of 100
Overall: {{overall_score}} out of 100

{{leak_line}}

{{moves_intro}}:

1. {{move_1_head}} {{move_1_body}}

2. {{move_2_head}} {{move_2_body}}

3. {{move_3_head}} {{move_3_body}}

The scorecard is the front door of the ACA Framework, the operating system
behind ELV8 Performance. The next step is The ACA Framework for Coaches, a
six week programme built on this exact system. Doors open after the World
Cup, and the waitlist hears first.

{{waitlist_url}}

High performance isn't an accident.

Shea McAleese
4x Olympian, 320+ international caps, high performance coach

P.S. One short follow-up lands in a couple of days on working your leak
pillar.
```

Save the template, then copy its Template ID.

## 4. Get your public key

EmailJS: Account, then General. Copy the Public Key.

## 5. Paste all three into the app

Open js/config.js and fill in:

- EMAILJS_PUBLIC_KEY: 'the public key from step 4'
- EMAILJS_SERVICE_ID: 'the service ID from step 2'
- EMAILJS_TEMPLATE_ID: 'the template ID from step 3'

That is the only code change. The email capture card appears automatically
once all three are set (independent of whether Kit is also wired).

## 6. Test before launch

1. Run the scorecard end to end with your own email.
2. Check your inbox: the results email arrives within a minute or two,
   right numbers, exactly one action plan block matching your leak.
3. Try a run where you deliberately answer for a different leak pillar,
   confirm the email's action plan matches that pillar, not the first one.

If the email never arrives, check EmailJS: Email Services, the connected
account may need re-authorising, or check the account's monthly send count
has not hit the 200 free limit.

## The weekly follow-up (manual, replaces Kit's automation)

Kit's free plan has no automation to send the second email 2 days later,
so this one small step stays manual. Once a week (Monday works well):

1. In Kit, open Subscribers, filter to people who joined the ACA Scorecard
   form, sorted newest first.
2. Anyone who joined since your last check gets the follow-up. At launch
   volume this is a short list; copy their email addresses.
3. Kit: Send, then Broadcasts, New broadcast. Paste the subject and body
   from email/follow-up-email.md, address it to those specific people
   (Kit lets you send a broadcast to a manually entered list of emails, or
   filter by "subscribed to form" if your account's UI offers it), send.

If Kit's actual screens do not match this description when you get there
(the last guide was wrong once already), tell me what you see and I will
adjust the steps rather than guess again.
