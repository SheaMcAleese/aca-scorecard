// Flow control and rendering. Scoring lives in scoring.js, copy in
// content.js, questions in questions.js, service wiring in config.js.
let answers = new Array(QUESTIONS.length).fill(null);
let current = 0;
let lastResult = null;
let advancing = false;  // blocks double-taps during the 220ms advance window

function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function startScorecard() {
  answers = new Array(QUESTIONS.length).fill(null);
  current = 0;
  advancing = false;
  // Reset the email capture card in case a previous run already submitted.
  const form = document.getElementById('captureForm');
  const btn = document.getElementById('emailBtn');
  form.style.display = '';
  document.getElementById('captureDone').style.display = 'none';
  document.getElementById('captureError').textContent = '';
  document.getElementById('emailInput').value = '';
  btn.disabled = false;
  btn.textContent = 'Email my results';
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
  if (advancing) return;
  advancing = true;
  answers[current] = value;
  document.querySelectorAll('#answers button').forEach(b => b.classList.remove('picked'));
  btn.classList.add('picked');
  setTimeout(() => {
    advancing = false;
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

  // Capture and waitlist stay hidden until wired in config.js. The capture
  // card needs EmailJS (it does the actual sending); Kit is best-effort
  // list-building alongside it, not required for the card to show.
  const emailReady = CONFIG.EMAILJS_PUBLIC_KEY && CONFIG.EMAILJS_SERVICE_ID && CONFIG.EMAILJS_TEMPLATE_ID;
  document.getElementById('capture').style.display = emailReady ? '' : 'none';
  document.getElementById('nextStep').style.display = CONFIG.WAITLIST_URL ? '' : 'none';
  if (CONFIG.WAITLIST_URL) document.getElementById('waitlistLink').href = CONFIG.WAITLIST_URL;

  show('results');
  requestAnimationFrame(() => {
    document.querySelectorAll('.bar-fill').forEach(b => { b.style.width = b.dataset.w + '%'; });
  });
}

// Kit builds the list (v3 subscribe endpoint, public API key, safe for
// client-side use; the API secret never appears in this project). Best
// effort only: list-building must never stop the results email from
// sending, so failures here are logged, not thrown. Wired by setting
// CONFIG.KIT_FORM_ID and CONFIG.KIT_API_KEY per KIT_SETUP.md. The five
// aca_* custom fields must exist in Kit first or Kit silently discards
// them (KIT_SETUP.md, step 1).
async function subscribeToKit(email, r, leak) {
  if (!CONFIG.KIT_FORM_ID || !CONFIG.KIT_API_KEY) return;
  const res = await fetch('https://api.convertkit.com/v3/forms/' + CONFIG.KIT_FORM_ID + '/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      api_key: CONFIG.KIT_API_KEY,
      email: email,
      fields: {
        aca_accountability: r.pillars[0].score,
        aca_consistency: r.pillars[1].score,
        aca_action: r.pillars[2].score,
        aca_overall: r.overall,
        aca_leak: leak
      }
    })
  });
  if (!res.ok) throw new Error('Kit responded ' + res.status);
}

// EmailJS delivers the actual results email (Kit's free plan has no
// sequences/automations to do this). The leak-pillar action plan is built
// here from the same MOVES/VERDICTS data the results screen uses, so the
// email and the on-screen result can never drift apart. See
// EMAILJS_SETUP.md for the template these params fill in.
function buildEmailParams(email, r, leak) {
  const leakPillar = r.pillars[r.leakIdx];
  const moves = MOVES[leakPillar.key];
  return {
    to_email: email,
    accountability_score: r.pillars[0].score,
    consistency_score: r.pillars[1].score,
    action_score: r.pillars[2].score,
    overall_score: r.overall,
    leak_line: r.allHolding
      ? 'All three pillars are holding. That puts you in rare company, and the work now is holding all three when pressure rises. It always rises.'
      : 'Your leak is ' + leak + '. The sequence matters. Each pillar depends on the one before it. Skip one and the whole thing leaks. Start with the leak.',
    moves_intro: r.allHolding ? ('Keep it moving: three ways to raise ' + leakPillar.name.toLowerCase()) : 'Your next three moves',
    move_1_head: moves[0].head, move_1_body: moves[0].body,
    move_2_head: moves[1].head, move_2_body: moves[1].body,
    move_3_head: moves[2].head, move_3_body: moves[2].body,
    waitlist_url: CONFIG.WAITLIST_URL || ''
  };
}

async function sendResultsEmail(email, r, leak) {
  if (!CONFIG.EMAILJS_PUBLIC_KEY || !CONFIG.EMAILJS_SERVICE_ID || !CONFIG.EMAILJS_TEMPLATE_ID) {
    throw new Error('Email service not configured');
  }
  const params = buildEmailParams(email, r, leak);
  await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, params, {
    publicKey: CONFIG.EMAILJS_PUBLIC_KEY
  });
}

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
  subscribeToKit(email, lastResult, leak).catch(err => console.warn('Kit subscribe failed', err));
  try {
    await sendResultsEmail(email, lastResult, leak);
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
