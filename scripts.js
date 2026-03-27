/* ── CUSTOM CURSOR ─────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  dot.style.left  = mouseX + 'px';
  dot.style.top   = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .skill-tag, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { ring.style.width = '54px'; ring.style.height = '54px'; ring.style.borderColor = 'var(--accent)'; });
  el.addEventListener('mouseleave', () => { ring.style.width = '36px'; ring.style.height = '36px'; ring.style.borderColor = 'rgba(232,201,126,.5)'; });
});

/* Hide cursor on mobile */
if ('ontouchstart' in window) {
  dot.style.display = 'none'; ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ── NAVBAR ────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
});

/* ── MOBILE MENU ───────────────────────────────────── */
const toggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

toggle.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = toggle.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

function closeMobile() {
  menuOpen = false;
  mobileMenu.classList.remove('open');
  toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

/* ── SCROLL HELPERS ────────────────────────────────── */
function getNavbarOffset() {
  const nav = document.getElementById('navbar');
  return nav ? nav.offsetHeight + 10 : 0;
}

function smoothScrollTo(targetY) {
  window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
}

/* ── SCROLL TO TOP ─────────────────────────────────── */
function scrollToTop() {
  smoothScrollTo(0);
}

/* ── YEAR ──────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── INTERSECTION OBSERVER — Reveal on Scroll ──────── */
function createObserver(selector, threshold = 0.15) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });
  document.querySelectorAll(selector).forEach(el => observer.observe(el));
}

createObserver('.timeline-item');
createObserver('.skill-card');
createObserver('.project-card');
createObserver('.affil-card');
createObserver('.research-item');

/* ── SKILL BARS ────────────────────────────────────── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
barObserver.observe(document.getElementById('skillBars'));

/* ── COUNTER ANIMATION ─────────────────────────────── */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + '+';
  };
  requestAnimationFrame(step);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count));
      });
      countObserver.disconnect();
    }
  });
}, { threshold: 0.4 });
const aboutSection = document.getElementById('about');
if (aboutSection) countObserver.observe(aboutSection);

/* ── PROJECT FILTER ────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      /* Re-trigger visible animation */
      if (match) {
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 80);
      }
    });
  });
});

/* ── ACTIVE NAV LINK on Scroll ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + entry.target.id
          ? 'var(--accent)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => activeObserver.observe(s));

/* ── TILT EFFECT ON PROJECT CARDS ──────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── TYPING EFFECT on hero role ────────────────────── */
const roleEl = document.querySelector('.hero-role');
const roles = [
  '> BS Information Technology — AdDU',
  '> Front-End Developer',
  '> Musician',
  '> Gamer',
];
let roleIdx = 0, charIdx = 0, deleting = false;

function typeRole() {
  const current = roles[roleIdx];
  if (!deleting) {
    roleEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    roleEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 40 : 65);
}
setTimeout(typeRole, 1200);

/* ── SMOOTH ANCHOR LINKS ────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const targetTop = target.getBoundingClientRect().top + window.scrollY - getNavbarOffset();
    smoothScrollTo(targetTop);
  });
});