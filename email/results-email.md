# Results email (email 1 of 2)

Superseded 19 Jul 2026: this file is now reference copy only. It is no
longer pasted into Kit — Kit's free plan cannot send it (no
sequences/automations). The email itself is now built and sent by the app
via EmailJS; see EMAILJS_SETUP.md for the live template (same copy, EmailJS
`{{ }}` placeholders instead of Kit Liquid) and js/app.js's
buildEmailParams() for the logic. Sent immediately when someone submits
the capture form on the results screen.

The three-move blocks are character-identical to the app (js/content.js),
signed off by Shea 18 July 2026. If one changes, change all three: here,
EMAILJS_SETUP.md's template, and content.js.

---

## Subject

Your ACA Scorecard

## Body

Your numbers are in.

Accountability: {{ subscriber.aca_accountability }} out of 100
Consistency: {{ subscriber.aca_consistency }} out of 100
Action: {{ subscriber.aca_action }} out of 100
Overall: {{ subscriber.aca_overall }} out of 100

{% if subscriber.aca_leak == "None, all holding" %}
All three pillars are holding. That puts you in rare company, and the work now is holding all three when pressure rises. It always rises.
{% else %}
Your leak is {{ subscriber.aca_leak }}.

The sequence matters. Each pillar depends on the one before it. Skip one and the whole thing leaks. Start with the leak.
{% endif %}

{% if subscriber.aca_leak == "Accountability" %}
Your next three moves:

1. Take the stairs. At the next result that stings, ask one question before any explanation leaves your mouth: what was my role in this?

2. One standard. Write down the standard you ask of the people around you. Hold yourself to it first.

3. Beat the review. Book ten minutes a week to review yourself honestly, before anyone else has to do it for you.
{% endif %}
{% if subscriber.aca_leak == "Consistency" %}
Your next three moves:

1. Protect what compounds. Name the behaviours that compound for you, preparation, recovery, reflection, and give each one a protected slot in your week.

2. Set your Tuesday standard. Write down the standard you hold on the day everyone is watching, then hold it on an ordinary Tuesday.

3. Judge the process. One line each night: did the standard hold? The result does not get a vote.
{% endif %}
{% if subscriber.aca_leak == "Action" %}
Your next three moves:

1. Name the next controllable action. Then take it today. Not the plan, the action.

2. Split the page. Two columns: what you control, what you do not. Your energy goes on the first column only.

3. Move before you feel ready. Take the imperfect step. Moving teaches you what another round of planning never will.
{% endif %}

The scorecard is the front door of the ACA Framework, the operating system behind ELV8 Performance. The next step is The ACA Framework for Coaches, a six week programme built on this exact system. Doors open after the World Cup, and the waitlist hears first.

[Join the waitlist]

(Setup note, do not paste this line: make [Join the waitlist] a button linked to the waitlist landing page from KIT_SETUP.md step 5, then delete any leftover placeholder text.)

High performance isn't an accident.

Shea McAleese
4x Olympian, 320+ international caps, high performance coach

P.S. One short follow-up lands in a couple of days on working your leak pillar. After that, the occasional letter worth reading. Unsubscribe any time.
