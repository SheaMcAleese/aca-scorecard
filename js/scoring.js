// Pure scoring engine. No DOM, no state: answers in, result out.
// Runs identically in the browser and under Node for the test suite.
//
// Model (locked Phase 1, README.md):
// - each answer is 1..5
// - pillar raw = sum of its five answers (5..25)
// - pillar score /100 = ((raw - 5) / 20) * 100, rounded
// - tiers: Holding >= 80, Leaking >= 50, Missing < 50
// - the leak = lowest score; ties break to the earliest pillar in the
//   sequence because the framework is sequential
// - allHolding when every pillar is Holding: no leak is named
function tierOf(score100) {
  if (score100 >= 80) return 'holding';
  if (score100 >= 50) return 'leaking';
  return 'missing';
}

function computeResults(answers, questions, pillars) {
  if (answers.length !== questions.length) {
    throw new Error('answers length mismatch: ' + answers.length + ' vs ' + questions.length);
  }
  answers.forEach((a, i) => {
    if (!Number.isInteger(a) || a < 1 || a > 5) {
      throw new Error('invalid answer at index ' + i + ': ' + a);
    }
  });

  const raw = pillars.map(() => 0);
  const counts = pillars.map(() => 0);
  questions.forEach((q, i) => { raw[q.p] += answers[i]; counts[q.p] += 1; });

  const results = pillars.map((p, i) => {
    const max = counts[i] * 5;
    const min = counts[i];
    const score = Math.round(((raw[i] - min) / (max - min)) * 100);
    return { key: p.key, name: p.name, raw: raw[i], score: score, tier: tierOf(score) };
  });

  let leakIdx = 0;
  for (let i = 1; i < results.length; i++) {
    if (results[i].score < results[leakIdx].score) leakIdx = i;
  }
  const allHolding = results.every(r => r.tier === 'holding');
  const overall = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);

  return { pillars: results, leakIdx: leakIdx, allHolding: allHolding, overall: overall };
}

if (typeof module !== 'undefined') module.exports = { tierOf, computeResults };
