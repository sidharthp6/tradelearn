// ============================================================
// TRADELEARN — PROGRESS ENGINE (localStorage)
// ============================================================

const TL_KEY = 'tl_progress';

const ALL_MODULES = [
  'basics-1', 'basics-2', 'basics-3',
  'markets-1', 'markets-2', 'markets-3', 'markets-4',
  'strategies-1', 'strategies-2', 'strategies-3'
];

// --- Read / write ---

function getProgress() {
  try {
    const raw = localStorage.getItem(TL_KEY);
    return raw ? JSON.parse(raw) : { modules: [], quizzes: {} };
  } catch (e) {
    return { modules: [], quizzes: {} };
  }
}

function _saveProgress(data) {
  try { localStorage.setItem(TL_KEY, JSON.stringify(data)); } catch (e) {}
}

// --- Public API ---

function markModuleComplete(id) {
  const d = getProgress();
  if (!d.modules.includes(id)) {
    d.modules.push(id);
    _saveProgress(d);
  }
}

function markQuizComplete(id, score, total) {
  const d = getProgress();
  d.quizzes[id] = { score, total, ts: Date.now() };
  _saveProgress(d);
}

function isModuleComplete(id) {
  return getProgress().modules.includes(id);
}

function getCompletedCount()  { return getProgress().modules.length; }
function getTotalModules()    { return ALL_MODULES.length; }

function resetProgress() {
  localStorage.removeItem(TL_KEY);
}

// --- UI helpers ---

// Update dot indicators in the sidebar
function applySidebarState() {
  const d = getProgress();
  document.querySelectorAll('.sidebar-link[data-module]').forEach(link => {
    const mid = link.dataset.module;
    const dot = link.querySelector('.mod-status');
    if (!dot) return;
    if (d.modules.includes(mid)) {
      dot.textContent = '✓';
      dot.classList.add('done');
    }
  });
}

// Update module-card completed state on section overview pages
function applyModuleCardState() {
  const d = getProgress();

  document.querySelectorAll('[data-module-card]').forEach(card => {
    if (d.modules.includes(card.dataset.moduleCard)) {
      card.classList.add('completed');
    }
  });

  // Section-level progress bar
  const section = document.body.dataset.section;
  const fill    = document.getElementById('section-progress-fill');
  const label   = document.getElementById('section-progress-label');

  if (section && fill) {
    const sectionMods = ALL_MODULES.filter(m => m.startsWith(section + '-'));
    const done  = sectionMods.filter(m => d.modules.includes(m)).length;
    const total = sectionMods.length;
    fill.style.width = Math.round((done / total) * 100) + '%';
    if (label) label.textContent = done + ' of ' + total + ' modules complete';
  }
}

// Populate homepage dashboard widgets
function renderHomepageDashboard() {
  const d     = getProgress();
  const done  = d.modules.length;
  const total = getTotalModules();
  const pct   = Math.round((done / total) * 100);

  const fill  = document.getElementById('overall-progress-fill');
  const pctEl = document.getElementById('overall-pct');
  const doneEl  = document.getElementById('modules-completed');
  const totalEl = document.getElementById('modules-total');
  const quizEl  = document.getElementById('quizzes-completed');

  if (fill)    fill.style.width  = pct + '%';
  if (pctEl)   pctEl.textContent = pct + '%';
  if (doneEl)  doneEl.textContent  = done;
  if (totalEl) totalEl.textContent = total;
  if (quizEl)  quizEl.textContent  = Object.keys(d.quizzes).length;

  // Apply completion class to course-section cards on homepage
  document.querySelectorAll('[data-section-card]').forEach(card => {
    const sec = card.dataset.sectionCard;
    const secMods  = ALL_MODULES.filter(m => m.startsWith(sec + '-'));
    const secDone  = secMods.filter(m => d.modules.includes(m)).length;
    const countEl  = card.querySelector('.section-done-count');
    if (countEl) countEl.textContent = secDone + '/' + secMods.length;
    if (secDone === secMods.length && secMods.length > 0) {
      card.classList.add('completed');
    }
  });
}
