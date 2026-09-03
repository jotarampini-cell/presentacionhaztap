document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN DEL EMBUDO (CAPTURA DE PROSPECTOS) ---
    const stepFormWrap = document.getElementById('booking-step-form');
    const stepSuccessWrap = document.getElementById('booking-step-success');
    const leadForm = document.getElementById('lead-qualification-form');
    const scrollToBookingBtn = document.getElementById('scroll-to-booking-btn');

    // CTA "Reservar mi llamada ahora": hace scroll al formulario y lo muestra si estaba oculto
    if (scrollToBookingBtn) {
        scrollToBookingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (stepSuccessWrap) stepSuccessWrap.style.display = 'none';
            if (stepFormWrap) stepFormWrap.style.display = 'block';
            
            stepFormWrap.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Enviar formulario (Simular confirmación)
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Ocultar formulario, mostrar éxito
            if (stepFormWrap) stepFormWrap.style.display = 'none';
            if (stepSuccessWrap) {
                stepSuccessWrap.style.display = 'flex';
                stepSuccessWrap.classList.add('is-visible');
            }
        });
    }

    // --- 2. SWIPER COVERFLOW DE VIDEOS DE CLIENTES ---
    if (typeof Swiper !== 'undefined' && document.querySelector('.funnel-video-swiper')) {
        const funnelSwiper = new Swiper('.funnel-video-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 20,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            loop: false,
        });

        // Control de audio
        const unmuteBtn = document.getElementById('funnel-unmute-btn');
        let isMuted = true;

        if (unmuteBtn) {
            unmuteBtn.addEventListener('click', () => {
                isMuted = !isMuted;
                
                // Mute all videos first
                document.querySelectorAll('.funnel-video-swiper video').forEach(v => {
                    v.muted = true;
                });

                // Unmute only the active slide if isMuted is false
                if (!isMuted) {
                    const activeSlide = funnelSwiper.slides[funnelSwiper.activeIndex];
                    if (activeSlide) {
                        const activeVideo = activeSlide.querySelector('video');
                        if (activeVideo) {
                            activeVideo.muted = false;
                            activeVideo.play().catch(() => {});
                        }
                    }
                }

                unmuteBtn.innerHTML = isMuted ? 
                    '<i class="ph-bold ph-speaker-high"></i> <span>Activar Sonido</span>' : 
                    '<i class="ph-bold ph-speaker-slash"></i> <span>Silenciar Sonido</span>';
            });
        }

        funnelSwiper.on('slideChange', () => {
            // Cuando cambia el slide, silenciar todos
            document.querySelectorAll('.funnel-video-swiper video').forEach(v => {
                v.muted = true;
            });

            // Si el estado global es no silenciado, desilenciar el nuevo activo
            if (!isMuted) {
                const activeSlide = funnelSwiper.slides[funnelSwiper.activeIndex];
                if (activeSlide) {
                    const activeVideo = activeSlide.querySelector('video');
                    if (activeVideo) {
                        activeVideo.muted = false;
                        activeVideo.play().catch(() => {});
                    }
                }
            }
        });
    }

});
