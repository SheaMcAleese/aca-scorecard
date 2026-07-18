// Flow control and rendering. Scoring lives in scoring.js, copy in
// content.js, questions in questions.js, service wiring in config.js.
let answers = new Array(QUESTIONS.length).fill(null);
let current = 0;
let lastResult = null;

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function startScorecard() {
  answers = new Array(QUESTIONS.length).fill(null);
  current = 0;
  renderQuestion();
  show('quiz');
}

function renderQuestion() {
  const q = QUESTIONS[current];
  document.getElementById('progressFill').style.width = (current / QUESTIONS.length * 100) + '%';
  document.getElementById('qCount').textContent = 'Question ' + (current + 1) + ' of ' + QUESTIONS.length;
  document.getElementById('pillarLabel').textContent = PILLARS[q.p].label;
  document.getElementById('qText').textContent = q.t;
  document.getElementById('backBtn').disabled = current === 0;
  const box = document.getElementById('answers');
  box.innerHTML = '';
  SCALE.forEach((label, i) => {
    const b = document.createElement('button');
    b.textContent = label;
    if (answers[current] === i + 1) b.classList.add('picked');
    b.onclick = () => pick(i + 1, b);
    box.appendChild(b);
  });
}

function pick(value, btn) {
  answers[current] = value;
  document.querySelectorAll('#answers button').forEach(b => b.classList.remove('picked'));
  btn.classList.add('picked');
  setTimeout(() => {
    if (current < QUESTIONS.length - 1) {
      current++;
      renderQuestion();
    } else {
      showResults();
    }
  }, 220);
}

function goBack() {
  if (current > 0) { current--; renderQuestion(); }
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('quiz').classList.contains('active')) return;
  const n = parseInt(e.key, 10);
  if (n >= 1 && n <= 5) {
    const btn = document.querySelectorAll('#answers button')[n - 1];
    if (btn) pick(n, btn);
  }
});

function showResults() {
  const r = computeResults(answers, QUESTIONS, PILLARS);
  lastResult = r;
  const leak = r.pillars[r.leakIdx];

  document.getElementById('resultHead').innerHTML = r.allHolding
    ? 'All three <em>holding</em>'
    : 'Your leak: <em>' + leak.name + '</em>';
  document.getElementById('totalLine').textContent = 'Overall ' + r.overall + ' out of 100';
  document.getElementById('verdict').textContent = r.allHolding ? VERDICTS.all : VERDICTS[leak.key];

  const cards = document.getElementById('pillarCards');
  cards.innerHTML = '';
  r.pillars.forEach((p, i) => {
    const isLeak = !r.allHolding && i === r.leakIdx;
    const card = document.createElement('div');
    card.className = 'pillar-card' + (isLeak ? ' leak' : '');
    card.innerHTML =
      '<div class="pillar-head"><span class="pillar-name">' + p.name + '</span>' +
      '<span class="pillar-score">' + p.score + ' / 100</span></div>' +
      '<div class="bar-track"><div class="bar-fill" data-w="' + p.score + '"></div></div>' +
      '<p class="tier">' + TIER_WORD[p.tier] + '</p>' +
      '<p class="pillar-read">' + READS[p.key][p.tier] + '</p>';
    cards.appendChild(card);
  });

  // Action plan: the leak pillar's moves. When all three hold, show the
  // moves for the lowest score anyway, framed by the "all holding" verdict.
  const movesBox = document.getElementById('movesList');
  movesBox.innerHTML = '';
  MOVES[leak.key].forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'move';
    el.innerHTML = '<span class="num">0' + (i + 1) + '</span>' +
      '<p class="body"><strong></strong> <span class="move-body"></span></p>';
    el.querySelector('strong').textContent = m.head;
    el.querySelector('.move-body').textContent = m.body;
    movesBox.appendChild(el);
  });
  document.getElementById('movesEyebrow').textContent = r.allHolding
    ? 'Keep it moving: three ways to raise ' + leak.name.toLowerCase()
    : 'Your next three moves';

  // Paid gate: OFF in v1. Appears only when BOTH flag and link are set in
  // config.js. It hides the action plan behind the payment link. This is a
  // client-side gate only; see README.md before ever turning it on.
  const gated = CONFIG.PAYWALL_ENABLED && CONFIG.PAYMENT_LINK;
  document.getElementById('movesList').style.display = gated ? 'none' : '';
  document.getElementById('movesLocked').style.display = gated ? '' : 'none';
  if (gated) document.getElementById('unlockLink').href = CONFIG.PAYMENT_LINK;

  // Capture and waitlist stay hidden until wired in config.js.
  document.getElementById('capture').style.display = (CONFIG.KIT_FORM_ID && CONFIG.KIT_API_KEY) ? '' : 'none';
  document.getElementById('nextStep').style.display = CONFIG.WAITLIST_URL ? '' : 'none';
  if (CONFIG.WAITLIST_URL) document.getElementById('waitlistLink').href = CONFIG.WAITLIST_URL;

  show('results');
  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
  });
}

// Kit email capture via the v3 subscribe endpoint (public API key, safe for
// client-side use; the API secret never appears in this project). Wired by
// setting CONFIG.KIT_FORM_ID and CONFIG.KIT_API_KEY per KIT_SETUP.md; until
// both are set the card is hidden. The five aca_* custom fields must exist
// in Kit first or Kit silently discards them (KIT_SETUP.md, step 1).
async function submitEmail(event) {
  event.preventDefault();
  if (!lastResult) return;
  const input = document.getElementById('emailInput');
  const btn = document.getElementById('emailBtn');
  const errEl = document.getElementById('captureError');
  const email = input.value.trim();
  errEl.textContent = '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = 'That email does not look right. Check it and go again.';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Sending';
  const leak = lastResult.allHolding ? 'None, all holding' : lastResult.pillars[lastResult.leakIdx].name;
  try {
    const res = await fetch('https://api.convertkit.com/v3/forms/' + CONFIG.KIT_FORM_ID + '/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        api_key: CONFIG.KIT_API_KEY,
        email: email,
        fields: {
          aca_accountability: lastResult.pillars[0].score,
          aca_consistency: lastResult.pillars[1].score,
          aca_action: lastResult.pillars[2].score,
          aca_overall: lastResult.overall,
          aca_leak: leak
        }
      })
    });
    if (!res.ok) throw new Error('Kit responded ' + res.status);
    document.getElementById('captureForm').style.display = 'none';
    document.getElementById('captureDone').style.display = '';
  } catch (err) {
    btn.disabled = false;
    btn.textContent = 'Email my results';
    errEl.textContent = 'That did not go through. Check your connection and try again.';
  }
}

function shareResult() {
  if (!lastResult) return;
  const url = CONFIG.SHARE_URL;
  const text = lastResult.allHolding
    ? 'I just ran the ACA Scorecard: ' + lastResult.overall + ' out of 100, all three pillars holding. Fifteen questions, three minutes, uncomfortably honest.'
    : 'I just ran the ACA Scorecard: ' + lastResult.overall + ' out of 100, and my leak is ' + lastResult.pillars[lastResult.leakIdx].name + '. Fifteen questions, three minutes, uncomfortably honest.';
  if (navigator.share) {
    navigator.share({ title: 'The ACA Scorecard', text: text, url: url }).catch(() => {});
    return;
  }
  const payload = text + ' ' + url;
  const toast = () => {
    const t = document.getElementById('copiedToast');
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1800);
  };
  const legacyCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = payload;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(); } catch (e) {}
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(payload).then(toast, legacyCopy);
  } else {
    legacyCopy();
  }
}

function retake() { startScorecard(); }
