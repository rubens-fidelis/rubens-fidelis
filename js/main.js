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
    refreshTenures();
    refreshCareerYears();
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

// ——— Dynamic tenure for the current role ———
// Spans marked [data-tenure-start="YYYY-MM"] render a live duration from that
// month to now, so the current job never shows a stale "3 yr 10 mo" value.
// Formatting mirrors the existing hand-written badges ("3 yr 10 mo" / "3 a 10 m").
function formatTenure(years, months, lang) {
    const yr = lang === 'pt' ? 'a' : 'yr';
    const mo = lang === 'pt' ? 'm' : 'mo';
    if (years > 0 && months > 0) return years + ' ' + yr + ' ' + months + ' ' + mo;
    if (years > 0) return years + ' ' + yr;
    return months + ' ' + mo;
}

function refreshTenures() {
    const now = new Date();
    document.querySelectorAll('[data-tenure-start]').forEach(function(el) {
        var parts = el.dataset.tenureStart.split('-').map(Number);
        if (parts.length !== 2 || parts.some(isNaN)) return;
        var years = now.getFullYear() - parts[0];
        var months = now.getMonth() - (parts[1] - 1);
        if (months < 0) { years--; months += 12; }
        var lang = el.closest('[data-lang-pt]') ? 'pt' : 'en';
        el.textContent = formatTenure(years, months, lang);
    });
}

// ——— Dynamic total career years ———
// Elements marked [data-career-years="YYYY-MM"] render floor(now − start).
// The stat card and EN copy show "N+"; PT copy wraps the number in
// "mais de … anos", so inside a [data-lang-pt] ancestor the "+" is dropped.
function refreshCareerYears() {
    var now = new Date();
    document.querySelectorAll('[data-career-years]').forEach(function(el) {
        var parts = el.dataset.careerYears.split('-').map(Number);
        if (parts.length !== 2 || parts.some(isNaN)) return;
        var years = now.getFullYear() - parts[0];
        if (now.getMonth() < parts[1] - 1) years--; // start month not yet reached
        el.textContent = el.closest('[data-lang-pt]') ? String(years) : years + '+';
    });
}

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
let navScrolled = false;
window.addEventListener('scroll', () => {
    const should = window.scrollY > 60;
    if (should !== navScrolled) { navScrolled = should; nav.classList.toggle('scrolled', should); }
}, { passive: true });

// ——— Smooth scroll for nav links ———
let isNavOpen = false;
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (isNavOpen) return;
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ——— Hide scroll indicator on scroll ———
const scrollIndicator = document.querySelector('.hero-scroll-indicator');
let scrollIndicatorHidden = false;
window.addEventListener('scroll', () => {
    if (!scrollIndicatorHidden && window.scrollY > 100) {
        scrollIndicatorHidden = true;
        scrollIndicator.style.opacity = '0';
    }
}, { passive: true });

// ——— Hamburger Menu ———
const hamburger = document.querySelector('.nav-hamburger');
const navOverlay = document.querySelector('.nav-overlay');
const overlayClose = document.querySelector('.nav-overlay-close');
const overlayNavLinks = document.querySelectorAll('.nav-overlay-links a');
const mainNavLangBtns = document.querySelectorAll('nav .lang-toggle .lang-btn');

if (hamburger && navOverlay && overlayClose) {
    let overlayScrollY = 0;

    function openNav() {
        overlayScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.top = '-' + overlayScrollY + 'px';
        isNavOpen = true;
        navOverlay.classList.add('open');
        navOverlay.setAttribute('aria-hidden', 'false');
        navOverlay.removeAttribute('inert');
        hamburger.setAttribute('aria-expanded', 'true');
        mainNavLangBtns.forEach(btn => btn.setAttribute('tabindex', '-1'));
        overlayClose.focus();
    }

    function closeNav(scrollTarget) {
        if (!isNavOpen) return;
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        if (scrollTarget) {
            scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo(0, overlayScrollY);
        }
        isNavOpen = false;
        navOverlay.classList.remove('open');
        navOverlay.setAttribute('aria-hidden', 'true');
        navOverlay.setAttribute('inert', '');
        hamburger.setAttribute('aria-expanded', 'false');
        mainNavLangBtns.forEach(btn => btn.removeAttribute('tabindex'));
        if (hamburger.offsetParent !== null) hamburger.focus();
    }

    hamburger.addEventListener('click', openNav);
    overlayClose.addEventListener('click', () => closeNav());
    overlayNavLinks.forEach(link => link.addEventListener('click', function() {
        const target = document.querySelector(this.getAttribute('href'));
        closeNav(target || null);
    }));

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isNavOpen) closeNav();
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
}
