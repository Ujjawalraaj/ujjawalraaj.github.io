/* ============================================
   UJJAWAL RAJ — PORTFOLIO SCRIPTS
   Performance-Optimized Build
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── LOADER / TERMINAL ANIMATION ─────────────────────────
    const loader = document.getElementById('loader');
    const terminalLines = document.querySelectorAll('.terminal-line');

    terminalLines.forEach((line) => {
        const delay = parseInt(line.dataset.delay, 10);
        setTimeout(() => line.classList.add('visible'), delay);
    });

    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        animateHero();
    }, 1200);

    // ─── UNIFIED SCROLL HANDLER (Single RAF loop) ─────────────
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroContent = document.querySelector('.hero-content');
    let ticking = false;

    function onScroll() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // 1. Scroll progress bar
        const scrollPercent = (scrollY / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';

        // 2. Navbar background
        navbar.classList.toggle('scrolled', scrollY > 50);

        // 3. Active nav highlight
        const checkY = scrollY + 200;
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (checkY >= section.offsetTop) {
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
                break;
            }
        }

        // 4. Hero parallax (desktop only — disabled on mobile to prevent early fade)
        if (heroContent && scrollY < window.innerHeight && window.innerWidth > 768) {
            heroContent.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
            heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
        } else if (heroContent && window.innerWidth <= 768) {
            heroContent.style.transform = '';
            heroContent.style.opacity = '';
        }

        // 5. Scroll-to-top button
        const scrollTopBtn = document.getElementById('scrollTop');
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollY > 600);

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });

    // ─── MOBILE MENU ──────────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // ─── HERO ANIMATION ───────────────────────────────────────
    function animateHero() {
        const reveals = document.querySelectorAll('.hero .reveal-up');
        reveals.forEach((el, i) => {
            setTimeout(() => el.classList.add('revealed'), i * 120);
        });
        animateCounters();
    }

    // ─── COUNTER ANIMATION ────────────────────────────────────
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            const duration = 1200;
            const start = performance.now();

            function updateCounter(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(updateCounter);
        });
    }

    // ─── SCROLL REVEAL (IntersectionObserver — no scroll listener) ──
    const revealElements = document.querySelectorAll('.reveal-up:not(.hero .reveal-up), .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─── CONTACT FORM (Formspree Integration) ─────────────────
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = this.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                btn.innerHTML = '<span>Message Sent!</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
                btn.style.background = '#28c840';
                btn.style.opacity = '1';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    this.reset();
                }, 3000);
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            btn.innerHTML = '<span>Failed — Try Again</span>';
            btn.style.background = '#ff5f57';
            btn.style.opacity = '1';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });

    // ─── SCROLL TO TOP ───────────────────────────────────────────
    document.getElementById('scrollTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ─── KEYBOARD NAVIGATION (Accessibility) ─────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
        if (e.key === 'Escape') {
            const mm = document.getElementById('mobileMenu');
            const hb = document.getElementById('hamburger');
            if (mm && mm.classList.contains('active')) {
                hb.classList.remove('active');
                mm.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
    document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));

    // ─── EASTER EGG (For devs who inspect) ───────────────────────
    console.log('%c Hey there, fellow developer! 👋', 'color: #e8c47c; font-size: 18px; font-weight: bold;');
    console.log('%c If you\'re inspecting this, you\'ll appreciate that:', 'color: #e4e4f0; font-size: 13px;');
    console.log('%c  ✓ No frameworks — Pure HTML/CSS/JS', 'color: #8888a4; font-size: 12px;');
    console.log('%c  ✓ Single RAF scroll loop (zero scroll jank)', 'color: #8888a4; font-size: 12px;');
    console.log('%c  ✓ IntersectionObserver for reveals (no scroll listeners)', 'color: #8888a4; font-size: 12px;');
    console.log('%c  ✓ Passive event listeners throughout', 'color: #8888a4; font-size: 12px;');
    console.log('%c  ✓ will-change on animated elements only', 'color: #8888a4; font-size: 12px;');
    console.log('%c\n Like what you see? Let\'s talk → rajpr8769@gmail.com', 'color: #e8c47c; font-size: 14px;');

});
