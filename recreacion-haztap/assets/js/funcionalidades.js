/* ==========================================================================
   Haztap — Funcionalidades JS
   Desktop: Sticky phone with 3D rotation scrub + feature highlight
   Mobile:  Simple scroll fade-in for features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const showcase = document.querySelector('.hts-cine-showcase');
    if (!showcase) return;

    // =========================================================================
    // TITLE SPLIT-TEXT ANIMATION (Awwwards-style char reveal)
    // =========================================================================
    const titleEl = showcase.querySelector('.hts-showcase-title');
    const labelEl = showcase.querySelector('.hts-showcase-label');

    if (titleEl) {
        // Manual split: wrap each word in .hts-title-word, each char in .hts-title-char
        const rawText = titleEl.textContent.trim();
        const words = rawText.split(' ');

        titleEl.innerHTML = words.map(word => {
            const chars = word.split('').map(char =>
                `<span class="hts-title-char">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
            return `<span class="hts-title-word">${chars}</span>`;
        }).join('');

        const chars = titleEl.querySelectorAll('.hts-title-char');

        // Label fades in first, then chars cascade up
        const headerTl = gsap.timeline({
            scrollTrigger: {
                trigger: showcase.querySelector('.hts-showcase-header'),
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        if (labelEl) {
            gsap.set(labelEl, { opacity: 0, y: 20 });
            headerTl.to(labelEl, {
                opacity: 1, y: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        }

        headerTl.fromTo(chars, 
            {
                yPercent: 120,
                opacity: 0,
                rotationX: -90,
                transformOrigin: "bottom center"
            },
            {
                yPercent: 0,
                opacity: 1,
                rotationX: 0,
                duration: 1.2,
                ease: 'power4.out',
                stagger: {
                    amount: 0.4,
                    from: "start"
                }
            }, 
            labelEl ? '-=0.5' : 0
        );
    }

    let mm = gsap.matchMedia();

    // =========================================================================
    // DESKTOP (>900px) — Sticky phone + feature highlight
    // =========================================================================
    mm.add('(min-width: 901px)', () => {

        const phone    = document.getElementById('htsPhone3d');
        const features = showcase.querySelectorAll('.hts-features-col .hts-feature-item');

        if (!phone || !features.length) return;

        // ── 1. Initial phone state ── (angles reducidos para preservar nitidez de la imagen)
        gsap.set(phone, { rotationY: -12, rotationX: 6, z: -30 });

        // ── 1.5. Phone Entrance Animation (Awwwards Style) ──
        gsap.fromTo(phone, 
            { y: 120, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: showcase,
                    start: 'top 65%', // Empieza a animarse cuando la sección entra al 65% del viewport
                }
            }
        );

        // ── 2. Phone 3D rotation scrubs with the entire feature column ──
        const featuresCol = document.getElementById('htsFeaturesCol');
        if (featuresCol) {
            gsap.to(phone, {
                rotationY: 12,
                rotationX: -3,
                z: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: featuresCol,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: 2,
                    invalidateOnRefresh: true
                }
            });
        }

        // ── 3. Feature items: highlight the one in the center of viewport ──
        features.forEach((feature) => {
            ScrollTrigger.create({
                trigger: feature,
                start: 'top 60%',
                end: 'bottom 40%',
                onEnter:      () => feature.classList.add('is-active'),
                onLeave:      () => feature.classList.remove('is-active'),
                onEnterBack:  () => feature.classList.add('is-active'),
                onLeaveBack:  () => feature.classList.remove('is-active'),
            });
        });

        // ── 4. Subtle ambient glow pulsation on the phone ──
        const glow = phone.querySelector('.hts-ambient-glow');
        if (glow) {
            gsap.to(glow, {
                opacity: 0.6,
                scale: 1.2,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        }

        return () => {
            // Cleanup on breakpoint change
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });

    // =========================================================================
    // MOBILE (≤900px) — Fade in each feature on scroll
    // =========================================================================
    mm.add('(max-width: 900px)', () => {

        const mobileFeatures = showcase.querySelectorAll('.hts-mobile-item');
        const mobilePhone    = document.getElementById('htsPhone3dMobile');

        // Feature items: simple fade-in per item
        mobileFeatures.forEach((feature) => {
            ScrollTrigger.create({
                trigger: feature,
                start: 'top 78%',
                end: 'bottom 22%',
                onEnter:     () => feature.classList.add('is-active'),
                onLeave:     () => feature.classList.remove('is-active'),
                onEnterBack: () => feature.classList.add('is-active'),
                onLeaveBack: () => feature.classList.remove('is-active'),
            });
        });

        // Phone: pop-in animation when it enters view
        if (mobilePhone) {
            gsap.fromTo(mobilePhone,
                { scale: 0.85, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: mobilePhone,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        }

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    });

});
