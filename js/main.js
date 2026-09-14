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
        // Brand-new role in its first month: keep the "Current" label
        // instead of rendering an awkward "0 mo".
        if (years === 0 && months === 0) {
            el.textContent = lang === 'pt' ? 'Atual' : 'Current';
            return;
        }
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

// ——— Ambient wave background ———
// Fixed dot-field behind all content: subtle intensity, 2× tempo. Dims toward
// 25% opacity on scroll so body text stays crisp, pauses when the tab hides,
// and renders one static frame under prefers-reduced-motion.
(function() {
    const canvas = document.getElementById('bg');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wave tuning — subtle intensity, 2× tempo, organic particle scatter
    const SPEED = 2;
    const SPACING = 8, JITTER = 3.5, BASE_A = 0.05, MAX_A = 0.55, GAMMA = 1.6, MIX_K = 0.85, DISP = 5;
    const GREEN = [0, 255, 102], MINT = [234, 255, 242];

    let W = 0, H = 0, grid = [];
    let pScale = 1, aComp = 1;          // particle scale: <1 on small viewports (finer dust)
    let rafId = 0, running = false, t = 0, last = 0;
    // Start off-screen so the cursor swell is inactive until a real mousemove
    const mouse = { x: -1, y: -1, sx: -1, sy: -1 };

    const rand = (lo, hi) => lo + Math.random() * (hi - lo);

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        W = window.innerWidth;
        H = window.innerHeight;
        // Small viewports: shrink particle geometry so dots read as fine dust,
        // not oversized blobs (clamps to 1 at >=1100px — desktop unchanged)
        pScale = Math.max(0.5, Math.min(1, W / 1100));
        aComp = Math.pow(1 / pScale, 0.35);             // slight alpha lift for smaller dots
        const spacing = SPACING * Math.max(0.75, pScale);
        const jitter = JITTER * Math.max(0.75, pScale);
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        grid = [];
        for (let y = 0; y <= H + spacing; y += spacing)
            for (let x = 0; x <= W + spacing; x += spacing)
                grid.push({
                    x: x + rand(-jitter, jitter),
                    y: y + rand(-jitter, jitter),
                    s: rand(0.6, 1.35) * pScale,        // sub-pixel sizes → particle dust
                    b: rand(0.55, 1),                   // per-particle brightness
                    o1: rand(-6, 6) * pScale, o2: rand(-6, 6) * pScale,  // crest cluster offsets
                    ph: rand(0, 6.28)
                });
        if (reducedMotion) draw(0);
    }

    function elevation(x, y, st, mx, my) {
        let z =
            Math.sin(x * 0.006 + st * 0.55) * Math.cos(y * 0.007 - st * 0.38) +
            0.55 * Math.sin((x + y) * 0.0035 + st * 0.7) +
            0.35 * Math.sin(x * 0.013 - st * 0.9 + y * 0.004);
        const dx = x - mx, dy = y - my, d2 = dx * dx + dy * dy;
        if (d2 < 25600) z += (1 - Math.sqrt(d2) / 160) * 0.9;   // cursor swell (160px radius)
        return z / 1.9;
    }

    function draw(tt) {
        ctx.clearRect(0, 0, W, H);
        const mx = mouse.sx * W, my = mouse.sy * H;
        const yOff = (mouse.sy - 0.5) * -10;
        const st = tt * SPEED;
        for (let i = 0; i < grid.length; i++) {
            const g = grid[i];
            const z = elevation(g.x, g.y, st + g.ph * 0.15, mx, my + yOff);
            const m = (z + 1) / 2;                              // 0..1 coverage everywhere
            const twinkle = 0.75 + 0.25 * Math.sin(tt * 1.8 + g.ph * 7);
            const a = (BASE_A + MAX_A * Math.pow(m, GAMMA)) * g.b * twinkle * aComp;
            if (a < 0.018) continue;
            const k = Math.min(m * MIX_K, 1);
            const r = (GREEN[0] + (MINT[0] - GREEN[0]) * k) | 0;
            const gc = (GREEN[1] + (MINT[1] - GREEN[1]) * k) | 0;
            const b = (GREEN[2] + (MINT[2] - GREEN[2]) * k) | 0;
            const y = g.y + z * DISP;
            ctx.fillStyle = 'rgba(' + r + ',' + gc + ',' + b + ',' + a.toFixed(3) + ')';
            ctx.fillRect(g.x, y, g.s, g.s);
            if (m > 0.7) {                                      // crest density: extra motes pile up
                ctx.fillStyle = 'rgba(' + r + ',' + gc + ',' + b + ',' + (a * 0.45).toFixed(3) + ')';
                ctx.fillRect(g.x + g.o1, y + g.o2, g.s * 0.8, g.s * 0.8);
            }
        }
    }

    function frame(now) {
        if (!last) last = now;
        t += Math.min((now - last) / 1000, 0.05);
        last = now;
        mouse.sx += (mouse.x - mouse.sx) * 0.06;
        mouse.sy += (mouse.y - mouse.sy) * 0.06;
        draw(t);
        rafId = requestAnimationFrame(frame);
    }
    function start() {
        if (running) return;
        running = true;
        last = 0;
        rafId = requestAnimationFrame(frame);
    }
    function stop() {
        running = false;
        cancelAnimationFrame(rafId);
    }

    // Scroll dim: fade toward 25% as content sections take over
    function applyScrollDim() {
        canvas.style.opacity = Math.max(0.25, 1 - window.scrollY / 700).toFixed(3);
    }

    window.addEventListener('resize', () => {
        clearTimeout(resize._t);
        resize._t = setTimeout(resize, 150);
    }, { passive: true });
    window.addEventListener('scroll', applyScrollDim, { passive: true });
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX / W;
        mouse.y = e.clientY / H;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
    });

    resize();
    applyScrollDim();
    if (!reducedMotion) start();
})();
