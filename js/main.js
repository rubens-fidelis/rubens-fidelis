// ——— Language Toggle ———
function setLang(lang, save) {
    document.documentElement.lang = lang;
    var show = (lang === 'pt-BR') ? 'pt' : 'en';
    var hide = (lang === 'pt-BR') ? 'en' : 'pt';
    document.querySelectorAll('[data-lang-' + hide + ']').forEach(function(el) {
        el.style.setProperty('display', 'none', 'important');
    });
    document.querySelectorAll('[data-lang-' + show + ']').forEach(function(el) {
        el.style.removeProperty('display');
    });
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    if (save !== false) localStorage.setItem('rf-lang', lang);
}

// Init: saved preference > first visit uses browser language
(function() {
    var saved = localStorage.getItem('rf-lang');
    if (saved) { setLang(saved); return; }
    var browserLang = navigator.language || navigator.userLanguage || 'en';
    // First visit: auto-detect but don't save, so toggle still works freely
    setLang(browserLang.startsWith('pt') ? 'pt-BR' : 'en', false);
})();

// ——— Scroll Reveal ———
const revealElements = document.querySelectorAll('.reveal, .timeline-item, .timeline-group');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ——— Nav scroll effect ———
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ——— Smooth scroll for nav links ———
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ——— Hide scroll indicator on scroll ———
const scrollIndicator = document.querySelector('.hero-scroll-indicator');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transition = 'opacity 0.5s ease';
    }
}, { passive: true });

// ——— Hamburger Menu ———
const hamburger = document.querySelector('.nav-hamburger');
const navOverlay = document.querySelector('.nav-overlay');
const overlayClose = document.querySelector('.nav-overlay-close');
const overlayNavLinks = document.querySelectorAll('.nav-overlay-links a');
const mainNavLangBtns = document.querySelectorAll('nav .lang-toggle .lang-btn');

let overlayScrollY = 0;

function openNav() {
    overlayScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '-' + overlayScrollY + 'px';
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    mainNavLangBtns.forEach(btn => btn.setAttribute('tabindex', '-1'));
    overlayClose.focus();
}

function closeNav() {
    if (navOverlay.getAttribute('aria-hidden') === 'true') return;
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, overlayScrollY);
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    mainNavLangBtns.forEach(btn => btn.removeAttribute('tabindex'));
    hamburger.focus();
}

hamburger.addEventListener('click', openNav);
overlayClose.addEventListener('click', closeNav);
overlayNavLinks.forEach(link => link.addEventListener('click', closeNav));

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navOverlay.getAttribute('aria-hidden') === 'false') closeNav();
});

// Focus trap
navOverlay.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(navOverlay.querySelectorAll('a[href], button:not([disabled])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// Auto-close on resize to desktop
window.matchMedia('(min-width: 1024px)').addEventListener('change', e => {
    if (e.matches) closeNav();
});
