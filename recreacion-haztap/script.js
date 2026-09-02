// ==========================================================================
// HAZTAP — Home: scroll normal, secciones que revelan al entrar en viewport
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // Split hero titles into animatable words (efecto de entrada del texto)
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

    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // --- Hero: entrada inicial (siempre visible al cargar) ---
    gsap.set('.home-hero .word > div', { y: '0%' });
    gsap.set('.home-hero .fade-in-up', { autoAlpha: 1, y: 0 });
    gsap.set('.home-scroll-hint', { autoAlpha: 1, y: 0 });

    const introTl = gsap.timeline();
    introTl.from('.home-hero .word > div', { y: '100%', duration: 1, ease: 'power3.out', stagger: 0.05 }, 0.2)
           .from('.home-hero .fade-in-up', { autoAlpha: 0, y: 30, duration: 1, ease: 'power3.out', stagger: 0.1 }, '-=0.7')
           .from('.home-scroll-hint', { autoAlpha: 0, y: -10, duration: 0.8, ease: 'power2.out' }, '-=0.5');

    // --- Resto de secciones: revelan al hacer scroll ---
    document.querySelectorAll('.home-showreel, .home-clients, .home-closing').forEach((section) => {
        gsap.set(section.querySelectorAll('.fade-in-up'), { autoAlpha: 1, y: 0 });
        gsap.set(section.querySelectorAll('.hero-title .word > div'), { y: '0%' });

        gsap.from(section.querySelectorAll('.fade-in-up'), {
            autoAlpha: 0,
            y: 30,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
                trigger: section,
                start: 'top 75%'
            }
        });

        const words = section.querySelectorAll('.hero-title .word > div');
        if (words.length) {
            gsap.from(words, {
                y: '100%',
                duration: 0.9,
                ease: 'power3.out',
                stagger: 0.04,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%'
                }
            });
        }
    });
});

// ==========================================================================
// HERO: leve parallax del fondo con el scroll (barato, solo transform)
// ==========================================================================
(function () {
    const bg = document.querySelector('.home-hero-bg');
    if (!bg || typeof gsap === 'undefined') return;
    gsap.to(bg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.home-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
})();

// ==========================================================================
// VIDEO INSTITUCIONAL: reproducir al hacer tap en el botón play
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('home-showreel-video');
    const playBtn = document.getElementById('home-showreel-play-btn');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', () => {
        video.play();
        video.setAttribute('preload', 'auto');
    });

    video.addEventListener('play', () => playBtn.classList.add('is-hidden'));
    video.addEventListener('pause', () => playBtn.classList.remove('is-hidden'));
    video.addEventListener('ended', () => playBtn.classList.remove('is-hidden'));
});

// ==========================================================================
// SWIPER: Carrusel de videos de clientes (drag/swipe libre, sin conflictos)
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
    let hasEnteredView = false;

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

    videoSwiper.on('slideChange', handleVideoPlay);

    // Solo reproducir cuando la sección entra en pantalla (ahorra ancho de banda)
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasEnteredView) {
                    hasEnteredView = true;
                    handleVideoPlay();
                } else if (!entry.isIntersecting) {
                    videos.forEach(v => v.pause());
                }
            });
        }, { threshold: 0.4 });
        observer.observe(swiperContainer);
    } else {
        handleVideoPlay();
    }
});
