document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.gsap === 'undefined') {
        return;
    }
    document.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
    document.documentElement.style.setProperty('overflow-y', 'scroll', 'important');
    document.documentElement.style.setProperty('height', 'auto', 'important');
    document.body.style.setProperty('overflow', 'visible', 'important');
    document.body.style.setProperty('height', 'auto', 'important');

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── 1. CINEMATIC HERO ENTRY ─────────────────────────────────────────────
    const heroTrack   = document.getElementById('htsHeroTrack');
    const heroTitle   = document.getElementById('htsHeroTitle');
    const heroSubtitle = document.getElementById('htsHeroSubtitle');
    const heroContent = document.querySelector('.hts-cine-hero-content');
    const heroImgWrap = document.querySelector('.hts-cine-hero-image-wrap');
    const heroMeta    = document.querySelector('.hts-hero-meta');
    const heroBottom  = document.querySelector('.hts-hero-bottom-meta');

    if (heroTrack && heroContent && heroImgWrap) {
        if (heroTitle) {
            const letters = heroTitle.textContent.trim().split('');
            heroTitle.innerHTML = letters
                .map(l => l === ' '
                    ? '<span style="display:inline-block;width:0.3em"> </span>'
                    : `<span class="hts-letter" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${l}</span></span>`)
                .join('');
        }

        const tlEntry = gsap.timeline({ delay: 0.1 });

        if (heroMeta) {
            tlEntry.fromTo(heroMeta,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out" }, 0
            );
        }

        if (heroTitle) {
            tlEntry.fromTo('.hts-letter > span',
                { yPercent: 120 },
                { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.04 }, 0.15
            );
        }

        if (heroBottom) {
            tlEntry.fromTo(heroBottom,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, 0.7
            );
        }

        if (heroSubtitle && !prefersReducedMotion) {
            tlEntry.fromTo(heroSubtitle,
                { opacity: 0, y: 14 },
                { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.55
            );
        } else if (heroSubtitle) {
            heroSubtitle.style.opacity = '1';
        }

        const tlHero = gsap.timeline({
            scrollTrigger: {
                trigger: heroTrack,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.2,
                invalidateOnRefresh: true
            }
        });

        tlHero.to(heroContent,
            { opacity: 0, y: -100, scale: 0.92, ease: "none", force3D: true }, 0
        )
        .fromTo(heroImgWrap,
            { scale: 0.35, opacity: 0, borderRadius: "24px" },
            { scale: 1, opacity: 1, borderRadius: "0px", ease: "none", force3D: true }, 0
        );
    }

    // ─── 2. BRIEF — CINEMATIC PARAGRAPH REVEAL ───────────────────────────────
    const briefSection = document.querySelector('.hts-cine-brief');
    const briefBody    = document.getElementById('htsBriefBody');

    const splitIntoWordSpans = (p) => {
        if (!p || p.querySelector('.hts-word__in')) return p ? p.querySelectorAll('.hts-word__in') : null;
        if (p.querySelector('a, strong, em, span:not(.hts-word)')) return null;
        const text = (p.textContent || '').trim();
        if (!text) return null;

        const words = text.split(/\s+/);
        p.textContent = '';
        const frag = document.createDocumentFragment();
        words.forEach((w, idx) => {
            const outer = document.createElement('span');
            outer.className = 'hts-word';
            const inner = document.createElement('span');
            inner.className = 'hts-word__in';
            inner.textContent = w;
            outer.appendChild(inner);
            frag.appendChild(outer);
            if (idx !== words.length - 1) frag.appendChild(document.createTextNode(' '));
        });
        p.appendChild(frag);
        return p.querySelectorAll('.hts-word__in');
    };

    const animateWordReveal = (containerSelector, sectionEl, opts = {}) => {
        const paras = gsap.utils.toArray(`${containerSelector} > p`);
        if (!paras.length) return;

        const {
            perspective   = 1200,
            rotateX       = 55,
            yPct          = 110,
            staggerEach   = 0.018,
            ease          = "power3.out",
            startPct      = 78,
        } = opts;

        paras.forEach((p, pIdx) => {
            const wordEls = splitIntoWordSpans(p);
            if (!wordEls || !wordEls.length) return;

            gsap.set(wordEls, {
                opacity: 0,
                yPercent: yPct,
                rotateX,
                transformPerspective: perspective,
                transformOrigin: '50% 100%'
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionEl || p,
                    start: `top ${startPct - pIdx * 3}%`,
                    toggleActions: "play none none none",
                    once: true,
                }
            });

            tl.to(wordEls, {
                opacity: 1,
                yPercent: 0,
                rotateX: 0,
                ease,
                duration: 0.8,
                stagger: { each: staggerEach, from: 'start' }
            });
        });
    };

    if (!prefersReducedMotion && briefBody) {
        animateWordReveal('#htsBriefBody', briefSection || briefBody);
    }

    // ─── 3. HORIZONTAL SCROLL GALLERY ────────────────────────────────────────
    const galleryTrack = document.getElementById('htsGalleryTrack');
    const galleryWrap  = document.getElementById('htsGalleryWrap');
    const gallery      = document.getElementById('htsGallery');

    if (galleryTrack && galleryWrap && gallery) {

        const setGalleryHeight = () => {
            const scrollDistance = gallery.scrollWidth - window.innerWidth;
            galleryTrack.style.height = `${scrollDistance + window.innerHeight}px`;
            return scrollDistance;
        };

        let scrollDist = setGalleryHeight();

        window.addEventListener('resize', () => {
            scrollDist = setGalleryHeight();
            ScrollTrigger.refresh();
        });

        window.addEventListener('load', () => {
            scrollDist = setGalleryHeight();
            ScrollTrigger.refresh();
        });

        gsap.to(gallery, {
            x: () => -scrollDist,
            ease: "none",
            force3D: true,
            scrollTrigger: {
                trigger: galleryTrack,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
                invalidateOnRefresh: true,
                fastScrollEnd: true
            }
        });

        const galleryTitleEl = document.querySelector('.hts-gallery-title-slide h2');
        if (galleryTitleEl) {
            const rawText = galleryTitleEl.textContent.trim();
            galleryTitleEl.innerHTML = rawText.split('').map(ch =>
                ch === ' '
                    ? '<span style="display:inline-block;width:0.25em"> </span>'
                    : `<span class="hts-vis-letter"><span>${ch}</span></span>`
            ).join('');

            const letterInners = galleryTitleEl.querySelectorAll('.hts-vis-letter > span');

            gsap.set(letterInners, { yPercent: 110, opacity: 0 });

            const tlVisEntry = gsap.timeline({
                scrollTrigger: {
                    trigger: galleryTrack,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
            tlVisEntry.to(letterInners, {
                yPercent: 0,
                opacity: 1,
                duration: 1.1,
                ease: 'power4.out',
                stagger: { each: 0.055, from: 'start' }
            });

            gsap.to(galleryTitleEl, {
                x: '-18vw',
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: galleryTrack,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 2,
                    invalidateOnRefresh: true
                }
            });

            const slideCount = document.querySelectorAll('.hts-gallery-slide').length;
            if (slideCount > 0) {
                const counter = document.createElement('div');
                counter.className = 'hts-gallery-counter';
                counter.textContent = `01 / 0${slideCount}`;
                galleryTitleEl.parentElement.appendChild(counter);

                gsap.fromTo(counter,
                    { opacity: 0, y: 14 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6,
                        scrollTrigger: {
                            trigger: galleryTrack,
                            start: 'top 85%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            }
        }

        const slides = document.querySelectorAll('.hts-gallery-slide');
        slides.forEach((slide) => {
            gsap.fromTo(slide,
                { scale: 0.88, opacity: 0.5 },
                {
                    scale: 1, opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: galleryTrack,
                        start: "top 90%",
                        end: "top 20%",
                        scrub: 1
                    }
                }
            );
        });
    }

    // ─── 5. NEXT PROJECT FOOTER — PARALLAX REVEAL ────────────────────────────
    const nextSection = document.querySelector('.hts-cine-next');
    const nextContent = document.querySelector('.hts-next-content');
    const nextBg      = document.querySelector('.hts-next-bg');

    if (nextSection) {
        if (nextBg) {
            gsap.fromTo(nextBg,
                { scale: 1.15, y: -30 },
                {
                    scale: 1, y: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: nextSection,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }

        if (nextContent) {
            gsap.fromTo(nextContent,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1.1, ease: "power3.out",
                    scrollTrigger: {
                        trigger: nextSection,
                        start: "top 70%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }

    // ─── 4.5 SECONDARY BRIEF — SAME ENGINE, MORE DRAMA ───────────────────────
    const briefSecondary     = document.querySelector('.hts-cine-brief-secondary');
    const briefSecondaryBody = document.getElementById('htsBriefSecondaryBody');
    const liveCta            = document.getElementById('htsLiveCta');

    if (!prefersReducedMotion && briefSecondary && briefSecondaryBody) {
        const dividerEl = document.querySelector('.hts-secondary-divider');
        if (dividerEl) {
            gsap.fromTo(dividerEl,
                { scaleX: 0, transformOrigin: 'left center' },
                {
                    scaleX: 1, duration: 1, ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: briefSecondary,
                        start: 'top 82%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        animateWordReveal('#htsBriefSecondaryBody', briefSecondary, {
            rotateX:     65,
            yPct:        115,
            staggerEach: 0.016,
            ease:        'power4.out',
            startPct:    82,
        });
    }

    if (liveCta) {
        if (!prefersReducedMotion) {
            gsap.set(liveCta, {
                opacity: 0, y: 30,
                rotateX: 20,
                transformPerspective: 900,
                transformOrigin: '50% 100%'
            });
            ScrollTrigger.create({
                trigger: liveCta,
                start: 'top 88%',
                onEnter: () => gsap.to(liveCta, {
                    opacity: 1, y: 0, rotateX: 0,
                    duration: 1.0, ease: 'power4.out',
                    clearProps: 'transformPerspective,rotateX',
                    overwrite: 'auto'
                })
            });
        }
    }

    window.addEventListener('load', () => { ScrollTrigger.refresh(); });
});
