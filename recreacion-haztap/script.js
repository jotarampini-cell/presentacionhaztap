// ==========================================================================
// HAZTAP — Recreación de script.js (partículas, GSAP timeline, swiper)
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

            const wasCanvasPaused = window._heroCanvasPaused;
            window._heroCanvasPaused = progress > 0.1;
            if (wasCanvasPaused && !window._heroCanvasPaused && window._heroCanvasResume) {
                window._heroCanvasResume();
            }

            const isSlide2Active = progress > 0.45 && progress < 0.85;
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
            duration: 0.9,
            ease: "power3.inOut",
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

    // --- TRANSICIÓN 1: Slide 1 -> Slide 2 ---
    tl.to('.slide-1 .word > div', { y: '-100%', duration: 1, ease: "power2.inOut", stagger: 0.05 }, 0)
      .to('.slide-1 .fade-element', { autoAlpha: 0, y: -30, duration: 1, ease: "power2.inOut", stagger: 0.1 }, 0.2)
      .to('.slide-1 .slide-bg', { scale: 1.2, duration: 2, ease: "none" }, 0)
      .to('.slide-1 .slide-exit-overlay', { opacity: 1, duration: 2, ease: "none" }, 0);

    tl.to('.slide-2', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 2,
        ease: "power3.inOut"
    }, 0.5);

    gsap.set('.slide-2 .slide-bg', { scale: 1.1 });
    tl.to('.slide-2 .slide-bg', { scale: 1, duration: 2.5, ease: "power2.out" }, 0.5);

    tl.to('.slide-2 .word > div', { y: '0%', duration: 1, ease: "power2.out", stagger: 0.05 }, 1.5)
      .to('.slide-2 .fade-element', { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.1 }, 1.8);

    tl.addLabel("slide2", 2.8);

    // --- TRANSICIÓN 2: Slide 2 -> Slide 3 ---
    tl.to('.slide-2 .word > div', { x: '-100%', autoAlpha: 0, duration: 1, ease: "power2.in", stagger: 0.05 }, 3)
      .to('.slide-2 .fade-element', { autoAlpha: 0, x: -30, duration: 1, ease: "power2.in", stagger: 0.1 }, 3.2)
      .to('.slide-2 .slide-bg', { scale: 1.15, duration: 2, ease: "none" }, 3)
      .to('.slide-2 .slide-exit-overlay', { opacity: 1, duration: 2, ease: "none" }, 3);

    tl.to('.slide-3', {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 2,
        ease: "power2.inOut"
    }, 3.5);

    gsap.set('.slide-3 .slide-bg', { scale: 1.2 });
    tl.to('.slide-3 .slide-bg', { scale: 1, duration: 2.5, ease: "power2.out" }, 3.5);

    tl.to('.slide-3 .word > div', { y: '0%', duration: 1, ease: "power3.out", stagger: 0.05 }, 4.5)
      .to('.slide-3 .fade-element', { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, 4.8);

    tl.addLabel("slide3", 5.8);

    // Animación de entrada inicial
    updateArrows();
    gsap.set('.slide-1 .slide-bg', { scale: 1.0 });

    let introTl = gsap.timeline();
    introTl.to('.slide-1 .word > div', { y: '0%', duration: 1, ease: "power3.out", stagger: 0.05 }, 0.4)
           .to('.slide-1 .fade-element', { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }, "-=0.7");
});

// ==========================================================================
// HERO CANVAS: Red de partículas interactiva
// ==========================================================================
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, raf;
    let paused = false;
    window._heroCanvasPaused = false;

    const colors = ['#A259FF', '#1ABCFE', '#0ACF83', '#F24E1E', '#7B61FF'];
    let particles = [];
    const mouse = { x: null, y: null, radius: 180 };

    window.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    class Particle {
        constructor() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 1.2;
            this.vy = (Math.random() - 0.5) * 1.2;
            this.size = Math.random() * 2.5 + 1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rgb = hexToRgb(this.color);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 0.8)`;
            ctx.fill();
        }
        update() {
            if (this.x > W || this.x < 0) this.vx = -this.vx;
            if (this.y > H || this.y < 0) this.vy = -this.vy;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 1.5;
                    this.y -= (dy / dist) * force * 1.5;
                }
            }

            this.x += this.vx * 0.4;
            this.y += this.vy * 0.4;
            this.draw();
        }
    }

    function init() {
        particles = [];
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        const isMobile = W <= 768;
        let pCount = Math.min(Math.floor((W * H) / 10000), isMobile ? 30 : 60);
        for (let i = 0; i < pCount; i++) particles.push(new Particle());
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distSq = dx * dx + dy * dy;
                const maxDistSq = 18000;
                if (distSq < maxDistSq) {
                    const opacity = (1 - (distSq / maxDistSq)) * 0.5;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawMouseGlow() {
        if (mouse.x !== null) {
            const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 300, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function draw() {
        if (!paused && !window._heroCanvasPaused) {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#050507';
            ctx.fillRect(0, 0, W, H);
            ctx.globalCompositeOperation = 'lighter';
            particles.forEach(p => p.update());
            connect();
            drawMouseGlow();
        }
        raf = requestAnimationFrame(draw);
    }

    document.addEventListener('visibilitychange', () => { paused = document.hidden; });
    window.addEventListener('resize', init, { passive: true });

    init();
    raf = requestAnimationFrame(draw);
})();

// ==========================================================================
// SLIDE 2: Canvas de fondo difuminado (usa colores de marca como blobs)
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

    function draw(t) {
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
