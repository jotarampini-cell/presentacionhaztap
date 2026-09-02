/* ==========================================================================
   HAZTAP GSAP MENU - JavaScript de Animaciones
   Requiere: GSAP 3.12.2
   Estrategia: transform translateY/translateX (sin clip-path para evitar conflictos)
   ========================================================================== */

document.addEventListener('haztap:header-ready', function () {

    // =========================================================================
    // CUSTOM CURSOR — Global, Awwwards-level
    // =========================================================================
    (function initCursor() {
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const dot = document.createElement('div'); dot.id = 'hts-cursor-dot';
        const ring = document.createElement('div'); ring.id = 'hts-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;
        const LERP = 0.12;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.set(dot, { x: mouseX, y: mouseY });
        });

        let rafActive = true;
        (function rafLoop() {
            if (rafActive) {
                ringX += (mouseX - ringX) * LERP;
                ringY += (mouseY - ringY) * LERP;
                gsap.set(ring, { x: ringX, y: ringY });
            }
            requestAnimationFrame(rafLoop);
        })();

        document.addEventListener('visibilitychange', () => {
            rafActive = !document.hidden;
        });

        const hoverTargets = 'a, button, [role="button"], .header-menu-btn, input, label, select, textarea, .hts-gallery-slide';
        document.addEventListener('mouseover', e => {
            if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hover');
        });
        document.addEventListener('mouseout', e => {
            if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hover');
        });

        document.addEventListener('mousedown', () => document.body.classList.add('cursor-pressing'));
        document.addEventListener('mouseup', () => document.body.classList.remove('cursor-pressing'));

        document.addEventListener('mouseleave', () => document.body.classList.add('cursor-out'));
        document.addEventListener('mouseenter', () => document.body.classList.remove('cursor-out'));
    })();


    const menu = document.getElementById('haztap-fullscreen-menu');
    const menuBtn = document.querySelector('.header-menu-btn');
    const navItems = menu ? menu.querySelectorAll('.gsap-nav-ul li a') : [];
    const metaCol = menu ? menu.querySelector('.menu-meta-col') : null;
    const menuFooter = menu ? menu.querySelector('.menu-footer') : null;
    const searchForm = menu ? menu.querySelector('.menu-search-form') : null;
    const searchIcon = menu ? menu.querySelector('.menu-search-icon-btn') : null;

    if (!menu || !menuBtn) return;

    const isMobile = () => window.innerWidth <= 1024;

    let isOpen = false;

    gsap.set(menu, {
        x: isMobile() ? '100%' : '0%',
        y: isMobile() ? '0%' : '-100%',
        visibility: 'hidden'
    });
    gsap.set(navItems, { y: '110%', opacity: 0 });
    gsap.set(metaCol, { opacity: 0, y: 20 });
    gsap.set(menuFooter, { opacity: 0 });

    function openMenu() {
        isOpen = true;
        menu.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');

        const mainHeader = document.getElementById('gsap-custom-header');
        if (mainHeader) mainHeader.classList.add('menu-is-active');

        const lines = menuBtn.querySelectorAll('.line');
        gsap.to(lines[0], { y: 8, rotation: 45, duration: 0.4, ease: 'power2.inOut' });
        gsap.to(lines[1], { opacity: 0, scaleX: 0, duration: 0.25, ease: 'power2.in' });
        gsap.to(lines[2], { y: -8, rotation: -45, duration: 0.4, ease: 'power2.inOut' });

        const mobile = isMobile();
        const tl = gsap.timeline();

        gsap.set(menu, { visibility: 'visible' });
        tl.to(menu, {
            x: '0%',
            y: '0%',
            duration: mobile ? 0.55 : 0.65,
            ease: 'power3.inOut'
        });

        tl.to(navItems, {
            y: '0%', opacity: 0.25,
            duration: 0.55, ease: 'power3.out', stagger: 0.03
        }, '-=0.65');

        tl.to(metaCol, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.55');

        tl.to(menuFooter, { opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.45');
    }

    function closeMenu() {
        isOpen = false;
        menuBtn.setAttribute('aria-expanded', 'false');

        const mainHeader = document.getElementById('gsap-custom-header');
        if (mainHeader) mainHeader.classList.remove('menu-is-active');

        const lines = menuBtn.querySelectorAll('.line');
        gsap.to(lines[0], { y: 0, rotation: 0, duration: 0.4, ease: 'power2.inOut' });
        gsap.to(lines[1], { opacity: 1, scaleX: 1, duration: 0.3, delay: 0.08, ease: 'power2.out' });
        gsap.to(lines[2], { y: 0, rotation: 0, duration: 0.4, ease: 'power2.inOut' });

        const mobile = isMobile();
        const closeX = mobile ? '100%' : '0%';
        const closeY = mobile ? '0%' : '-100%';

        const tl = gsap.timeline({
            onComplete: () => {
                menu.classList.remove('is-open');
                gsap.set(menu, { visibility: 'hidden' });
                gsap.set(navItems, { y: '110%', opacity: 0 });
                gsap.set(metaCol, { opacity: 0, y: 20 });
                gsap.set(menuFooter, { opacity: 0 });
            }
        });

        tl.to(navItems, { y: '-80%', opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.03 });
        tl.to(metaCol, { opacity: 0, duration: 0.25 }, '-=0.25');
        tl.to(menuFooter, { opacity: 0, duration: 0.25 }, '-=0.25');

        tl.to(menu, {
            x: closeX, y: closeY,
            duration: mobile ? 0.6 : 0.65,
            ease: 'power3.inOut'
        }, '-=0.15');
    }

    menuBtn.addEventListener('click', () => {
        if (!isOpen) { openMenu(); } else { closeMenu(); }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && isOpen) closeMenu();
    });

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            navItems.forEach(o => { if (o !== item) gsap.to(o, { opacity: 0.06, duration: 0.3 }); });
        });
        item.addEventListener('mouseleave', () => {
            navItems.forEach(o => gsap.to(o, { opacity: 0.25, duration: 0.4 }));
        });
    });

    if (searchIcon && searchForm) {
        searchIcon.addEventListener('click', () => {
            const input = searchForm.querySelector('input[type="text"]');
            const expanded = searchForm.classList.toggle('is-expanded');
            if (expanded) {
                gsap.fromTo(input, { width: 0, opacity: 0 },
                    {
                        width: 220, opacity: 1, duration: 0.5, ease: 'power2.out',
                        onComplete: () => input.focus()
                    });
            } else {
                gsap.to(input, { width: 0, opacity: 0, duration: 0.35, ease: 'power2.in' });
            }
        });
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (!isOpen) {
                gsap.set(menu, {
                    x: isMobile() ? '100%' : '0%',
                    y: isMobile() ? '0%' : '-100%'
                });
            }
        }, 200);
    });

    const mainHeader = document.getElementById('gsap-custom-header');
    if (mainHeader && !document.body.classList.contains('is-home')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                mainHeader.classList.add('is-scrolled');
            } else {
                mainHeader.classList.remove('is-scrolled');
            }
        }, { passive: true });
    }

});
