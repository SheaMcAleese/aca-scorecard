// All results copy lives here so wording edits never touch logic.
// READS and VERDICTS carry over from the shipped ACA Self-Audit.
// MOVES drawn from _context/ELV8_ACA_Framework.md, signed off by Shea
// 18 July 2026. His wording wins: edit only with his sign-off, and keep
// the email templates in email/ in step with any change.
const TIER_WORD = { holding: 'Holding', leaking: 'Leaking', missing: 'Missing' };

const READS = {
  accountability: {
    holding: 'You look at yourself clearly and own what you find. Protect this. It is the pillar everything else stands on.',
    leaking: 'You own it when it is comfortable. Under pressure the explanations creep in, and that is exactly when it counts.',
    missing: 'The escalator of excuses is winning. Nothing above this line fixes itself until you take the stairs.'
  },
  consistency: {
    holding: 'Your structure holds when motivation fades. That is rare, and it compounds whether anyone claps or not.',
    leaking: 'The big days get your best. Tuesdays do not. The gap between those two is the gap in your results.',
    missing: 'You are running on motivation, and motivation is weather. Build structure that holds when the weather turns.'
  },
  action: {
    holding: 'You move before you feel ready and let clarity catch up. Keep choosing the next controllable action.',
    leaking: 'You know what to do, and you wait for certainty before doing it. A perfect plan is usually fear dressed up as preparation.',
    missing: 'You are parked. A GPS cannot help a parked car. Name one controllable action and take it today.'
  }
};

const VERDICTS = {
  all: 'You see yourself clearly, you show up the same way regardless of circumstance, and you move when it matters. The work now is holding all three when pressure rises. It always rises.',
  accountability: 'Your leak is Accountability, and the sequence is not arbitrary. Consistency amplifies whatever sits underneath it, so without honest self-perception you can be consistently mediocre. Start here.',
  consistency: 'Your leak is Consistency. You can see it clearly, you just do not repeat it. Accountability without consistency is insight with no follow-through. Structure beats intention.',
  action: 'Your leak is Action. The foundation is there, now move. Clarity comes from moving, not from waiting. Pick the next controllable action and take it this week.'
};

// Two to three concrete moves per pillar, each traceable to a line in the
// framework file. Shown for the leak pillar only.
const MOVES = {
  accountability: [
    { head: 'Take the stairs.', body: 'At the next result that stings, ask one question before any explanation leaves your mouth: what was my role in this?' },
    { head: 'One standard.', body: 'Write down the standard you ask of the people around you. Hold yourself to it first.' },
    { head: 'Beat the review.', body: 'Book ten minutes a week to review yourself honestly, before anyone else has to do it for you.' }
  ],
  consistency: [
    { head: 'Protect what compounds.', body: 'Name the behaviours that compound for you, preparation, recovery, reflection, and give each one a protected slot in your week.' },
    { head: 'Set your Tuesday standard.', body: 'Write down the standard you hold on the day everyone is watching, then hold it on an ordinary Tuesday.' },
    { head: 'Judge the process.', body: 'One line each night: did the standard hold? The result does not get a vote.' }
  ],
  action: [
    { head: 'Name the next controllable action.', body: 'Then take it today. Not the plan, the action.' },
    { head: 'Split the page.', body: 'Two columns: what you control, what you do not. Your energy goes on the first column only.' },
    { head: 'Move before you feel ready.', body: 'Take the imperfect step. Moving teaches you what another round of planning never will.' }
  ]
};

if (typeof module !== 'undefined') module.exports = { TIER_WORD, READS, VERDICTS, MOVES };
