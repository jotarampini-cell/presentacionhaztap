// ==========================================================================
// HAZTAP — Home: timeline de slides (fade + slide simple, GPU-friendly)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // Split hero titles into animatable words
    document.querySelectorAll('.hero-title').forEach(title => {
        let html = '';
        const lines = title.innerHTML.split('<br>');
        lines.forEach((line, index) => {
            const words = line.trim().split(' ');
            words.forEach(word => {
                if (word.trim() !== '') {
                    html += `<div class="word"><div>${word}</div></div> `;
                }
            });
            if (index < lines.length - 1) html += '<br>';
        });
        title.innerHTML = html;
    });

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    gsap.set('.gsap-slide', { visibility: 'visible' });

    const upArrow = document.querySelector('.arrow-up');
    const downArrow = document.querySelector('.arrow-down');

    let tl = gsap.timeline({
        paused: true,
        onUpdate: function () {
            const progress = this.progress();

            const isSlide2Active = progress > 0.3 && progress < 0.7;
            if (isSlide2Active !== window._slide2MediaActive) {
                window._slide2MediaActive = isSlide2Active;
                if (isSlide2Active) {
                    if (window._playSlide2Videos) window._playSlide2Videos();
                    if (window._startSlide2Canvas) window._startSlide2Canvas();
                } else {
                    if (window._pauseSlide2Videos) window._pauseSlide2Videos();
                    if (window._stopSlide2Canvas) window._stopSlide2Canvas();
                }
            }
        }
    });

    let currentSlideIndex = 1;
    const totalSlides = 3;
    const slideLabels = ["", "slide1", "slide2", "slide3"];
    let isAnimating = false;

    function updateArrows() {
        if (currentSlideIndex === 1) {
            gsap.to(upArrow, { opacity: 0, y: 20, scale: 0.5, duration: 0.3, onComplete: () => upArrow.style.display = 'none' });
            gsap.to(downArrow, { opacity: 1, y: 0, scale: 1, display: 'flex', duration: 0.5, ease: "back.out(1.7)" });
        } else if (currentSlideIndex === totalSlides) {
            gsap.to(downArrow, { opacity: 0, y: -20, scale: 0.5, duration: 0.3, onComplete: () => downArrow.style.display = 'none' });
            gsap.to(upArrow, { opacity: 1, y: 0, scale: 1, display: 'flex', duration: 0.5, ease: "back.out(1.7)" });
        } else {
            gsap.to([upArrow, downArrow], { opacity: 1, y: 0, scale: 1, display: 'flex', duration: 0.5, ease: "back.out(1.7)" });
        }
    }

    function goToSlide(index) {
        if (index < 1 || index > totalSlides || isAnimating || currentSlideIndex === index) return;
        isAnimating = true;
        document.body.classList.add("is-scrolling");
        currentSlideIndex = index;
        updateArrows();

        tl.tweenTo(slideLabels[index], {
            duration: 0.6,
            ease: "power2.inOut",
            onComplete: () => {
                isAnimating = false;
                document.body.classList.remove("is-scrolling");
            }
        });
    }

    document.querySelectorAll('.gsap-scroll-arrow').forEach((arrow) => {
        arrow.addEventListener('click', function (e) {
            e.preventDefault();
            if (isAnimating) return;
            this.classList.add('clicked');
            setTimeout(() => this.classList.remove('clicked'), 150);
            if (this.classList.contains('arrow-up')) goToSlide(currentSlideIndex - 1);
            else goToSlide(currentSlideIndex + 1);
        });
    });

    window.addEventListener("wheel", (e) => {
        if (isAnimating) return;
        if (e.deltaY > 40) goToSlide(currentSlideIndex + 1);
        else if (e.deltaY < -40) goToSlide(currentSlideIndex - 1);
    }, { passive: true });

    let touchStartY = 0;
    window.addEventListener("touchstart", (e) => { touchStartY = e.changedTouches[0].screenY; }, { passive: true });
    window.addEventListener("touchend", (e) => {
        if (isAnimating) return;
        let touchEndY = e.changedTouches[0].screenY;
        if (touchStartY - touchEndY > 50) goToSlide(currentSlideIndex + 1);
        else if (touchEndY - touchStartY > 50) goToSlide(currentSlideIndex - 1);
    }, { passive: true });

    // Preparación inicial
    tl.addLabel("slide1", 0);
    gsap.set('.slide-1 .word > div', { y: '0%' });
    gsap.set('.slide-1 .fade-element', { autoAlpha: 1, y: 0 });

    // --- TRANSICIÓN 1: Slide 1 -> Slide 2 (fade + slide, sin clip-path) ---
    tl.to('.slide-1', { autoAlpha: 0, duration: 0.5, ease: "power1.inOut" }, 0);

    tl.to('.slide-2', {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut"
    }, 0.15);
    gsap.set('.slide-2', { y: 24 });
    tl.to('.slide-2', { y: 0, duration: 0.6, ease: "power2.out" }, 0.15);

    tl.to('.slide-2 .fade-element', { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.4);

    tl.addLabel("slide2", 1.1);

    // --- TRANSICIÓN 2: Slide 2 -> Slide 3 ---
    tl.to('.slide-2 .fade-element', { autoAlpha: 0, duration: 0.4, ease: "power1.in" }, 1.3)
      .to('.slide-2', { autoAlpha: 0, duration: 0.4, ease: "power1.inOut" }, 1.55);

    tl.to('.slide-3', {
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut"
    }, 1.65);
    gsap.set('.slide-3', { y: 24 });
    tl.to('.slide-3', { y: 0, duration: 0.6, ease: "power2.out" }, 1.65);

    tl.to('.slide-3 .word > div', { y: '0%', duration: 0.7, ease: "power3.out", stagger: 0.04 }, 1.85)
      .to('.slide-3 .fade-element', { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 1.95);

    tl.addLabel("slide3", 2.5);

    // Animación de entrada inicial
    updateArrows();

    let introTl = gsap.timeline();
    introTl.to('.slide-1 .word > div', { y: '0%', duration: 1, ease: "power3.out", stagger: 0.05 }, 0.3)
           .to('.slide-1 .fade-element', { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, "-=0.7");
});

// ==========================================================================
// SLIDE 2: Canvas de fondo difuminado (blobs de color de marca)
// ==========================================================================
(function () {
    const canvas = document.getElementById('slide-2-bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, raf, running = false;

    const colors = ['#A259FF', '#1ABCFE', '#0ACF83', '#F24E1E'];
    const blobs = colors.map((c, i) => ({
        color: c,
        angle: (i / colors.length) * Math.PI * 2,
        speed: 0.002 + i * 0.0005,
        radiusFactor: 0.28 + i * 0.03
    }));

    function resize() {
        W = canvas.width = canvas.offsetWidth || window.innerWidth;
        H = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    function draw() {
        if (!running) return;
        ctx.clearRect(0, 0, W, H);
        blobs.forEach(b => {
            b.angle += b.speed;
            const cx = W / 2 + Math.cos(b.angle) * W * 0.25;
            const cy = H / 2 + Math.sin(b.angle * 1.3) * H * 0.25;
            const r = Math.min(W, H) * b.radiusFactor;
            const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
            grad.addColorStop(0, b.color + 'CC');
            grad.addColorStop(1, b.color + '00');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.fill();
        });
        raf = requestAnimationFrame(draw);
    }

    window._startSlide2Canvas = function () {
        if (running) return;
        running = true;
        resize();
        raf = requestAnimationFrame(draw);
    };

    window._stopSlide2Canvas = function () {
        running = false;
        cancelAnimationFrame(raf);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();
})();

// ==========================================================================
// SWIPER: Carrusel de videos 3D coverflow
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const swiperContainer = document.querySelector('.swiper-video-slider');
    if (!swiperContainer) return;

    const videoSwiper = new Swiper('.swiper-video-slider', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        coverflowEffect: {
            rotate: 25,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        },
        keyboard: { enabled: true },
        loop: false,
    });

    setTimeout(() => { if (videoSwiper) videoSwiper.update(); }, 1000);

    const videos = document.querySelectorAll('.swiper-slide video');
    const muteBtn = document.getElementById('global-unmute-btn');
    let isMuted = true;

    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        const activeSlide = document.querySelector('.swiper-slide-active');
        const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

        videos.forEach(v => { v.muted = (v === activeVideo) ? isMuted : true; });

        if (isMuted) {
            muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg> Activar Sonido';
        } else {
            muteBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2V15H6L11 19V5Z"></path><path d="M19.07 4.93C21.5 7.36 21.5 11.3 19.07 13.73"></path><path d="M15.54 8.46C16.47 9.39 16.47 10.9 15.54 11.83"></path></svg> Silenciar';
        }
    });

    function handleVideoPlay() {
        if (!videoSwiper) return;
        const activeSlide = videoSwiper.slides[videoSwiper.activeIndex];
        const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

        videos.forEach(v => {
            if (v.paused) v.play().catch(() => {});
            v.muted = (v === activeVideo) ? isMuted : true;
        });
    }

    window._playSlide2Videos = handleVideoPlay;
    window._pauseSlide2Videos = function () {
        videos.forEach(v => v.pause());
    };

    videoSwiper.on('slideChange', handleVideoPlay);
});
