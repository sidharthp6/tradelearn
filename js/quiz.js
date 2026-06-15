// ============================================================
// TRADELEARN — QUIZ ENGINE
// ============================================================
// Usage: each module page defines const QUIZ = [...] then calls
//   initQuiz(QUIZ, 'module-id')
// after including progress.js and quiz.js
// ============================================================

// Quiz data schema (per question):
// { question: string, options: string[], correct: number (0-based), explanation: string }

let _q = { data: [], id: '', answered: 0, correct: 0, total: 0 };

function initQuiz(quizData, moduleId) {
  _q = { data: quizData, id: moduleId, answered: 0, correct: 0, total: quizData.length };
  _renderQuiz();

  // If quiz was previously attempted, show saved result
  const saved = getProgress().quizzes[moduleId];
  if (saved) _restoreQuizState(saved);
}

// --- Render ---

function _renderQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const questionsHtml = _q.data.map((q, qi) => {
    const optsHtml = q.options.map((opt, oi) =>
      `<button class="q-opt" data-qi="${qi}" data-oi="${oi}"
         onclick="_answer(this,${qi},${oi},${q.correct},'${_esc(q.explanation)}')">${opt}</button>`
    ).join('');

    return `
      <div class="quiz-question" id="qq-${qi}">
        <p class="q-text"><span class="q-num">Q${qi + 1}</span> ${q.question}</p>
        <div class="q-options">${optsHtml}</div>
        <div class="q-feedback hidden" id="qf-${qi}"></div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="quiz-wrap">
      <h2 class="quiz-title">Module Quiz</h2>
      <p class="quiz-sub">Answer all ${_q.total} question${_q.total !== 1 ? 's' : ''} to complete this module</p>
      <div class="quiz-questions">${questionsHtml}</div>
      <div class="quiz-score hidden" id="quiz-score">
        <div class="score-circle" id="score-circle"></div>
        <p id="score-msg"></p>
        <button class="btn btn-success" id="complete-btn" onclick="_completeModule()">
          Mark Module Complete ✓
        </button>
      </div>
    </div>`;
}

// --- Answer handler ---

function _answer(btn, qi, oi, correct, explanation) {
  const block = document.getElementById('qq-' + qi);
  if (block.classList.contains('answered')) return;
  block.classList.add('answered');

  block.querySelectorAll('.q-opt').forEach((b, i) => {
    b.disabled = true;
    if (i === correct)                  b.classList.add('correct');
    if (i === oi && oi !== correct)     b.classList.add('incorrect');
  });

  const fb = document.getElementById('qf-' + qi);
  fb.classList.remove('hidden');
  const ok = (oi === correct);
  if (ok) _q.correct++;
  _q.answered++;

  fb.innerHTML =
    `<span class="${ok ? 'fb-correct' : 'fb-incorrect'}">${ok ? '✓ Correct!' : '✗ Incorrect.'}</span> ${explanation}`;

  if (_q.answered === _q.total) {
    setTimeout(() => _showScore(_q.correct, _q.total, false), 500);
  }
}

// --- Score display ---

function _showScore(score, total, alreadyDone) {
  const wrap   = document.getElementById('quiz-score');
  const circle = document.getElementById('score-circle');
  const msg    = document.getElementById('score-msg');
  const btn    = document.getElementById('complete-btn');

  wrap.classList.remove('hidden');

  const pct = Math.round((score / total) * 100);
  circle.textContent = score + '/' + total;
  circle.className = 'score-circle ' +
    (pct >= 80 ? 'score-great' : pct >= 50 ? 'score-ok' : 'score-low');

  if (alreadyDone) {
    msg.textContent = 'You already completed this quiz.';
    if (isModuleComplete(_q.id)) {
      btn.textContent = 'Module Completed ✓';
      btn.disabled    = true;
    }
  } else {
    const messages = [
      'Keep studying — revisit the content above and try again.',
      'Good effort! Review any questions you missed and try again.',
      'Nice work! You have a solid understanding of this module.',
      'Excellent! You have mastered this module.'
    ];
    const idx = pct < 40 ? 0 : pct < 60 ? 1 : pct < 80 ? 2 : 3;
    msg.textContent = messages[idx];
    markQuizComplete(_q.id, score, total);
  }

  wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// --- Restore already-completed quiz ---

function _restoreQuizState(saved) {
  // Disable all option buttons, mark questions as answered
  document.querySelectorAll('.quiz-question').forEach(b => b.classList.add('answered'));
  document.querySelectorAll('.q-opt').forEach(b => b.disabled = true);
  _showScore(saved.score, saved.total, true);
}

// --- Mark complete ---

function _completeModule() {
  markModuleComplete(_q.id);
  const btn = document.getElementById('complete-btn');
  btn.textContent = 'Module Completed ✓';
  btn.disabled    = true;
  applySidebarState(); // refresh sidebar dots
}

// --- Utility ---

function _esc(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
