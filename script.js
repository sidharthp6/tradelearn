// ============================================================
// TRADELEARN — CORE SCRIPTS
// ============================================================

// === SCROLL FADE ANIMATIONS ===
function initFadeAnimations() {
  const faders = document.querySelectorAll('.fade');
  if (!faders.length) return;

  function check() {
    const vh = window.innerHeight;
    faders.forEach(el => {
      if (el.getBoundingClientRect().top < vh - 60) {
        el.classList.add('show');
      }
    });
  }

  window.addEventListener('scroll', check, { passive: true });
  check(); // run immediately on load
}

// === MOBILE NAVBAR ===
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    }
  });
}

// === SIDEBAR TOGGLE (module pages, mobile) ===
function initSidebarToggle() {
  const btn     = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!btn || !sidebar) return;

  function openSidebar()  {
    sidebar.classList.add('open');
    overlay && overlay.classList.add('open');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay && overlay.classList.remove('open');
  }

  btn.addEventListener('click', () =>
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar()
  );
  overlay && overlay.addEventListener('click', closeSidebar);
}

// === ACTIVE NAV LINK ===
function setActiveNav() {
  // Module pages set data-active-nav on <body> to point at their parent section
  const page = document.body.dataset.activeNav || location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    a.classList.toggle('active', href === page);
  });
}

// === CONTACT FORM ===
function validateForm(e) {
  if (e) e.preventDefault();

  const emailEl = document.getElementById('email');
  if (!emailEl || !emailEl.value.trim()) {
    emailEl && emailEl.focus();
    return false;
  }

  // Show polished success message instead of alert
  const success = document.getElementById('form-success');
  const form    = document.getElementById('contact-form');
  if (form)    form.style.display = 'none';
  if (success) success.style.display = 'block';

  return false; // never submit on a static site
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initFadeAnimations();
  initMobileNav();
  initSidebarToggle();
  setActiveNav();
});
