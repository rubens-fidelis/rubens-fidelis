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
