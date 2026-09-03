/* ==========================================================================
   HAZTAP — Preview Homepage Interactive Script
   - Acordeón FAQ
   - Video Institucional (Showreel)
   - Swiper 3D Coverflow de Videos Verticales + Control de Audio
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });

                // Toggle current
                if (isOpen) {
                    item.classList.remove('is-open');
                    answer.style.maxHeight = null;
                } else {
                    item.classList.add('is-open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // Open first FAQ by default
    if (faqItems.length > 0) {
        const firstItem = faqItems[0];
        firstItem.classList.add('is-open');
        const firstAnswer = firstItem.querySelector('.faq-answer');
        if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
    }

    // --- 2. VIDEO INSTITUCIONAL (SHOWREEL) ---
    const showreelVideo = document.getElementById('home-showreel-video');
    const showreelPlayBtn = document.getElementById('home-showreel-play-btn');

    if (showreelVideo && showreelPlayBtn) {
        showreelPlayBtn.addEventListener('click', () => {
            showreelVideo.play();
            showreelVideo.setAttribute('preload', 'auto');
        });

        showreelVideo.addEventListener('play', () => showreelPlayBtn.classList.add('is-hidden'));
        showreelVideo.addEventListener('pause', () => showreelPlayBtn.classList.remove('is-hidden'));
        showreelVideo.addEventListener('ended', () => showreelPlayBtn.classList.remove('is-hidden'));
    }

    // --- 3. SWIPER: CARRUSEL DE VIDEOS VERTICALES 3D ---
    const swiperContainer = document.querySelector('.swiper-video-slider');
    if (swiperContainer && typeof Swiper !== 'undefined') {
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

        setTimeout(() => { if (videoSwiper) videoSwiper.update(); }, 600);

        const videos = document.querySelectorAll('.swiper-slide video');
        const muteBtn = document.getElementById('global-unmute-btn');
        let isMuted = true;
        let hasEnteredView = false;

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                isMuted = !isMuted;
                const activeSlide = document.querySelector('.swiper-slide-active');
                const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

                videos.forEach(v => { v.muted = (v === activeVideo) ? isMuted : true; });

                if (isMuted) {
                    muteBtn.innerHTML = '<i class="ph-bold ph-speaker-slash"></i> Activar Sonido';
                } else {
                    muteBtn.innerHTML = '<i class="ph-bold ph-speaker-high"></i> Silenciar';
                }
            });
        }

        let isSwiperVisible = false;

        function handleVideoPlay() {
            if (!videoSwiper || !isSwiperVisible) return;
            const activeSlide = videoSwiper.slides[videoSwiper.activeIndex];
            const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;

            videos.forEach(v => {
                if (v === activeVideo) {
                    if (v.paused) v.play().catch(() => {});
                    v.muted = isMuted;
                } else {
                    v.pause();
                    v.muted = true;
                }
            });
        }

        videoSwiper.on('slideChange', handleVideoPlay);

        if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        isSwiperVisible = true;
                        handleVideoPlay();
                    } else {
                        isSwiperVisible = false;
                        videos.forEach(v => v.pause());
                    }
                });
            }, { threshold: 0.15 });
            observer.observe(swiperContainer);
        } else {
            isSwiperVisible = true;
            handleVideoPlay();
        }
    }

    // --- 4. SMOOTH ANCHOR SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // --- 5. DEMOSTRADOR INTERACTIVO "SIENTE EL TAP" ---
    const demoCards = document.querySelectorAll('.demo-product-card');
    const demoItemName = document.getElementById('demo-item-name');
    const demoItemSpec = document.getElementById('demo-item-spec');
    const demoItemPrice = document.getElementById('demo-item-price');
    const waBubble = document.querySelector('.whatsapp-chat-bubble');

    demoCards.forEach(card => {
        card.addEventListener('click', () => {
            demoCards.forEach(c => c.classList.remove('is-active'));
            card.classList.add('is-active');

            const name = card.getAttribute('data-name');
            const spec = card.getAttribute('data-spec');
            const price = card.getAttribute('data-price');

            if (demoItemName && name) demoItemName.textContent = name;
            if (demoItemSpec && spec) demoItemSpec.textContent = 'Variación: ' + spec;
            if (demoItemPrice && price) demoItemPrice.textContent = '$' + price + ' USD';

            if (waBubble) {
                waBubble.classList.remove('has-updated');
                void waBubble.offsetWidth; // trigger reflow
                waBubble.classList.add('has-updated');
            }
        });
    });

    // --- 6. SIMULACIÓN DE VERIFICACIÓN DE COMPROBANTE EN 1 CLIC ---
    const approveSlipBtn = document.getElementById('btn-approve-slip-demo');
    const liveOrderTag = document.querySelector('.admin-live-tag');

    if (approveSlipBtn) {
        approveSlipBtn.addEventListener('click', () => {
            const originalHTML = approveSlipBtn.innerHTML;
            approveSlipBtn.style.background = '#0ACF83';
            approveSlipBtn.style.color = '#171719';
            approveSlipBtn.innerHTML = '<i class="ph-bold ph-check"></i> <span>¡Pago Conciliado y Despacho Notificado!</span>';
            
            if (liveOrderTag) {
                liveOrderTag.innerHTML = '<i class="ph-bold ph-check-circle" style="color: #0ACF83;"></i> Pagado & Listo';
            }

            setTimeout(() => {
                approveSlipBtn.innerHTML = originalHTML;
                approveSlipBtn.style.background = '';
                approveSlipBtn.style.color = '';
                if (liveOrderTag) {
                    liveOrderTag.innerHTML = '<i class="ph-bold ph-circle"></i> Orden #1084';
                }
            }, 3500);
        });
    }

    // --- 7. VIDEO SHOWCASE CONTINUO: SOLO NOTIFICACIONES DE PEDIDOS (Sin invadir Dynamic Island) ---
    const notif1 = document.getElementById('stream-notif-1');
    const notif2 = document.getElementById('stream-notif-2');
    const notif3 = document.getElementById('stream-notif-3');
    const notif4 = document.getElementById('stream-notif-4');
    const counterPanel = document.getElementById('stream-counter-panel');
    const countNumberEl = document.getElementById('stream-count-number');

    let countInterval = null;
    let showcaseTimeoutIds = [];

    function clearShowcaseTimers() {
        showcaseTimeoutIds.forEach(id => clearTimeout(id));
        showcaseTimeoutIds = [];
        clearInterval(countInterval);
    }

    function runRapidShowcase() {
        clearShowcaseTimers();

        // Estado inicial limpio
        if (notif1) notif1.classList.remove('is-visible');
        if (notif2) notif2.classList.remove('is-visible');
        if (notif3) notif3.classList.remove('is-visible');
        if (notif4) notif4.classList.remove('is-visible');
        if (counterPanel) counterPanel.classList.remove('is-active');

        // T+200ms: Notificación 1 llega de inmediato
        showcaseTimeoutIds.push(setTimeout(() => {
            if (notif1) notif1.classList.add('is-visible');
        }, 200));

        // T+900ms: Notificación 2
        showcaseTimeoutIds.push(setTimeout(() => {
            if (notif2) notif2.classList.add('is-visible');
        }, 900));

        // T+1600ms: Notificación 3
        showcaseTimeoutIds.push(setTimeout(() => {
            if (notif3) notif3.classList.add('is-visible');
        }, 1600));

        // T+2300ms: Notificación 4
        showcaseTimeoutIds.push(setTimeout(() => {
            if (notif4) notif4.classList.add('is-visible');
        }, 2300));

        // T+3000ms: Contador de impacto explosivo (175 -> 209)
        showcaseTimeoutIds.push(setTimeout(() => {
            if (counterPanel) counterPanel.classList.add('is-active');

            let count = 175;
            const target = 209;
            clearInterval(countInterval);
            countInterval = setInterval(() => {
                count += 3;
                if (count >= target) {
                    count = target;
                    clearInterval(countInterval);
                }
                if (countNumberEl) countNumberEl.textContent = count;
            }, 30);
        }, 3000));

        // T+5200ms: Reseteo suave para el siguiente ciclo
        showcaseTimeoutIds.push(setTimeout(() => {
            if (counterPanel) counterPanel.classList.remove('is-active');
            if (notif1) notif1.classList.remove('is-visible');
            if (notif2) notif2.classList.remove('is-visible');
            if (notif3) notif3.classList.remove('is-visible');
            if (notif4) notif4.classList.remove('is-visible');
            if (dynamicIsland) dynamicIsland.classList.remove('is-expanded');
        }, 5200));
    }

    // Iniciar de inmediato y repetir cada 5.7 segundos en loop fluido
    runRapidShowcase();
    setInterval(runRapidShowcase, 5700);

});
