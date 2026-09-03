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

        // IntersectionObserver para reproducción automática eficiente
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
            }, { threshold: 0.35 });
            observer.observe(swiperContainer);
        } else {
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

    // --- 7. VIDEO SHOWCASE CONTINUO EN LOOP AUTÓNOMO (Zero clicks needed) ---
    const notif1 = document.getElementById('stream-notif-1');
    const notif2 = document.getElementById('stream-notif-2');
    const notif3 = document.getElementById('stream-notif-3');
    const notif4 = document.getElementById('stream-notif-4');
    const counterPanel = document.getElementById('stream-counter-panel');
    const countNumberEl = document.getElementById('stream-count-number');
    const outroPanel = document.getElementById('stream-outro-panel');
    const timelineSteps = document.querySelectorAll('.timeline-step');

    const sceneDurations = [2500, 3000, 4000, 3500, 2800]; // Duración en ms de las 5 escenas
    let currentStep = 1;
    let stepStartTime = null;
    let animFrameId = null;
    let counterIntervalId = null;

    function renderSceneState(step) {
        // Timeline Bar
        timelineSteps.forEach((s) => {
            const num = parseInt(s.getAttribute('data-step'), 10);
            const fill = s.querySelector('.step-progress-fill');
            if (num < step) {
                s.classList.add('is-passed');
                s.classList.remove('is-active');
                if (fill) fill.style.width = '100%';
            } else if (num === step) {
                s.classList.remove('is-passed');
                s.classList.add('is-active');
            } else {
                s.classList.remove('is-passed');
                s.classList.remove('is-active');
                if (fill) fill.style.width = '0%';
            }
        });

        clearInterval(counterIntervalId);

        if (step === 1) {
            // Escena 1: Calma
            if (notif1) notif1.classList.remove('is-visible');
            if (notif2) notif2.classList.remove('is-visible');
            if (notif3) notif3.classList.remove('is-visible');
            if (notif4) notif4.classList.remove('is-visible');
            if (counterPanel) counterPanel.classList.remove('is-active');
            if (outroPanel) outroPanel.classList.remove('is-active');
        } else if (step === 2) {
            // Escena 2: Primer pedido
            if (counterPanel) counterPanel.classList.remove('is-active');
            if (outroPanel) outroPanel.classList.remove('is-active');
            if (notif2) notif2.classList.remove('is-visible');
            if (notif3) notif3.classList.remove('is-visible');
            if (notif4) notif4.classList.remove('is-visible');
            setTimeout(() => { if (notif1) notif1.classList.add('is-visible'); }, 150);
        } else if (step === 3) {
            // Escena 3: Cascada de ventas
            if (counterPanel) counterPanel.classList.remove('is-active');
            if (outroPanel) outroPanel.classList.remove('is-active');
            if (notif1) notif1.classList.add('is-visible');
            setTimeout(() => { if (notif2) notif2.classList.add('is-visible'); }, 200);
            setTimeout(() => { if (notif3) notif3.classList.add('is-visible'); }, 850);
            setTimeout(() => { if (notif4) notif4.classList.add('is-visible'); }, 1500);
        } else if (step === 4) {
            // Escena 4: Contador +209 en vivo
            if (outroPanel) outroPanel.classList.remove('is-active');
            if (notif1) notif1.classList.add('is-visible');
            if (notif2) notif2.classList.add('is-visible');
            if (notif3) notif3.classList.add('is-visible');
            if (notif4) notif4.classList.add('is-visible');
            if (counterPanel) counterPanel.classList.add('is-active');

            let currentCount = 0;
            const target = 209;
            const stepInc = Math.ceil(target / 24);
            counterIntervalId = setInterval(() => {
                currentCount += stepInc;
                if (currentCount >= target) {
                    currentCount = target;
                    clearInterval(counterIntervalId);
                }
                if (countNumberEl) countNumberEl.textContent = currentCount;
            }, 55);
        } else if (step === 5) {
            // Escena 5: En automático (Cierre de marca)
            if (counterPanel) counterPanel.classList.remove('is-active');
            if (outroPanel) outroPanel.classList.add('is-active');
        }
    }

    function videoLoopDirector(timestamp) {
        if (!stepStartTime) stepStartTime = timestamp;
        const elapsed = timestamp - stepStartTime;
        const currentDuration = sceneDurations[currentStep - 1];
        const progress = Math.min(elapsed / currentDuration, 1);

        // Actualizar barra de progreso del paso activo
        const currentStepEl = document.querySelector(`.timeline-step[data-step="${currentStep}"]`);
        if (currentStepEl) {
            const fillEl = currentStepEl.querySelector('.step-progress-fill');
            if (fillEl) fillEl.style.width = (progress * 100) + '%';
        }

        if (elapsed >= currentDuration) {
            // Pasar al siguiente paso o reiniciar loop
            stepStartTime = timestamp;
            currentStep = currentStep >= 5 ? 1 : currentStep + 1;
            renderSceneState(currentStep);
        }

        animFrameId = requestAnimationFrame(videoLoopDirector);
    }

    // Inicializar y reproducir continuamente
    renderSceneState(1);
    animFrameId = requestAnimationFrame(videoLoopDirector);

    // Permitir clic en la barra para adelantar a un capítulo si se desea
    timelineSteps.forEach((s) => {
        s.addEventListener('click', () => {
            const targetStep = parseInt(s.getAttribute('data-step'), 10);
            currentStep = targetStep;
            stepStartTime = performance.now();
            renderSceneState(currentStep);
        });
    });

});
