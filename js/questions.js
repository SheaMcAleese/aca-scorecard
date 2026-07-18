// The approved 15-question set (Shea, 18 July 2026).
// Questions 1-12 carry over from the ACA Self-Audit character for character.
// Q5, Q10, Q15 approved new in Phase 0.
// p: pillar index. 0 = Accountability, 1 = Consistency, 2 = Action.
const PILLARS = [
  { key: 'accountability', name: 'Accountability', label: 'Pillar one · Accountability' },
  { key: 'consistency',    name: 'Consistency',    label: 'Pillar two · Consistency' },
  { key: 'action',         name: 'Action',         label: 'Pillar three · Action' }
];

const QUESTIONS = [
  // Accountability
  { p: 0, t: 'When a result goes against me, my first question is about my own role in it, not about what happened to me.' },
  { p: 0, t: 'I hold myself to the same standard I ask of the people around me.' },
  { p: 0, t: 'I own the outcome before I reach for the explanation.' },
  { p: 0, t: 'I review myself honestly before anyone else has to do it for me.' },
  { p: 0, t: 'When something goes wrong, I look at my part in it without sliding into blame, of myself or of anyone else.' },
  // Consistency
  { p: 1, t: 'My standard on an ordinary Tuesday matches my standard on the day everyone is watching.' },
  { p: 1, t: 'The behaviours that compound, preparation, recovery, reflection, are protected in my week rather than squeezed in.' },
  { p: 1, t: 'When I am tired, doubted, or under pressure, my standards hold.' },
  { p: 1, t: 'I show up the same way whether or not anyone is watching.' },
  { p: 1, t: 'I judge myself on the process I ran, not only on the result everyone else was watching.' },
  // Action
  { p: 2, t: 'When I am unclear, I move to create clarity rather than wait for it to arrive.' },
  { p: 2, t: 'At any moment I can name my next controllable action, and I take it.' },
  { p: 2, t: 'I separate what I control from what I do not, and I put my energy on the first.' },
  { p: 2, t: 'When the stakes rise, I choose my response rather than react on instinct.' },
  { p: 2, t: 'I trust an imperfect step to teach me more than another round of planning would.' }
];

const SCALE = ['Never', 'Rarely', 'About half the time', 'Most of the time', 'Every time'];

if (typeof module !== 'undefined') module.exports = { PILLARS, QUESTIONS, SCALE };
