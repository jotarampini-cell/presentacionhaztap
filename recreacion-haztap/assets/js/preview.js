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

    // --- 7. SIMULADOR DE PEDIDOS EN PANTALLA DE BLOQUEO (Brief Escenas) ---
    const lockscreenSection = document.getElementById('pedidos-en-vivo');
    const notif1 = document.getElementById('notif-1');
    const notif2 = document.getElementById('notif-2');
    const notif3 = document.getElementById('notif-3');
    const notif4 = document.getElementById('notif-4');
    const counterOverlay = document.getElementById('counter-overlay');
    const counterNumEl = document.getElementById('pedidos-counter-num');
    const sceneTabs = document.querySelectorAll('.scene-tab-btn');
    const sceneStepIndicator = document.getElementById('scene-step-indicator');
    const sceneTitle = document.getElementById('scene-title');
    const sceneDesc = document.getElementById('scene-desc');
    const playPauseBtn = document.getElementById('btn-play-pause-sim');

    const scenesData = [
        {
            num: 1,
            name: "Calma",
            title: "1. Calma en tu teléfono personal",
            desc: "Pantalla de bloqueo con un fondo relajado de tu vida diaria. Todo en silencio mientras la tienda digital Haztap opera en la nube.",
            duration: 2500
        },
        {
            num: 2,
            name: "Primer pedido",
            title: "2. Llega el primer pedido del día",
            desc: "Un cliente navega tu catálogo, selecciona su talla y completa la compra. Tu teléfono recibe la primera notificación con foto de la prenda y confirmación de pago.",
            duration: 3200
        },
        {
            num: 3,
            name: "Llegan más",
            title: "3. Cascada automática de pedidos",
            desc: "Mientras trabajas, atiendes en el mostrador o tomas un café, caen más órdenes simultáneas con fotos y datos listos sin colapsar tu WhatsApp.",
            duration: 3800
        },
        {
            num: 4,
            name: "Contador en vivo",
            title: "4. Tu facturación en tiempo real",
            desc: "El panel consolida los pedidos del día en automático. Observa cómo el contador asciende hasta superar las 200 órdenes sin esfuerzo manual.",
            duration: 4000
        },
        {
            num: 5,
            name: "Cierre",
            title: "5. Tu negocio en piloto automático",
            desc: "Sin estrés, sin capturas dudosas y sin perder horas en el chat. Todo organizado y respaldado para despachar a tiempo.",
            duration: 4500
        }
    ];

    let currentSceneIdx = 0;
    let sceneTimer = null;
    let counterInterval = null;
    let isAutoPlaying = true;

    function activateScene(sceneNum) {
        currentSceneIdx = sceneNum - 1;
        const data = scenesData[currentSceneIdx];

        // Update tabs
        sceneTabs.forEach(t => {
            const tNum = parseInt(t.getAttribute('data-scene'), 10);
            t.classList.toggle('is-active', tNum === sceneNum);
        });

        // Update text labels
        if (sceneStepIndicator) sceneStepIndicator.textContent = `Escena ${sceneNum} de 5`;
        if (sceneTitle) sceneTitle.textContent = data.title;
        if (sceneDesc) sceneDesc.textContent = data.desc;

        // Reset elements
        clearInterval(counterInterval);
        
        if (sceneNum === 1) {
            if (notif1) notif1.classList.remove('is-visible');
            if (notif2) notif2.classList.remove('is-visible');
            if (notif3) notif3.classList.remove('is-visible');
            if (notif4) notif4.classList.remove('is-visible');
            if (counterOverlay) counterOverlay.classList.remove('is-active');
        } else if (sceneNum === 2) {
            if (counterOverlay) counterOverlay.classList.remove('is-active');
            if (notif2) notif2.classList.remove('is-visible');
            if (notif3) notif3.classList.remove('is-visible');
            if (notif4) notif4.classList.remove('is-visible');
            setTimeout(() => { if (notif1) notif1.classList.add('is-visible'); }, 150);
        } else if (sceneNum === 3) {
            if (counterOverlay) counterOverlay.classList.remove('is-active');
            if (notif1) notif1.classList.add('is-visible');
            setTimeout(() => { if (notif2) notif2.classList.add('is-visible'); }, 200);
            setTimeout(() => { if (notif3) notif3.classList.add('is-visible'); }, 700);
            setTimeout(() => { if (notif4) notif4.classList.add('is-visible'); }, 1200);
        } else if (sceneNum === 4) {
            if (notif1) notif1.classList.add('is-visible');
            if (notif2) notif2.classList.add('is-visible');
            if (notif3) notif3.classList.add('is-visible');
            if (notif4) notif4.classList.add('is-visible');
            if (counterOverlay) counterOverlay.classList.add('is-active');

            // Animate counter from 0 to 209
            let current = 0;
            const target = 209;
            const step = Math.ceil(target / 25);
            counterInterval = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counterInterval);
                }
                if (counterNumEl) counterNumEl.textContent = current;
            }, 50);
        } else if (sceneNum === 5) {
            if (notif1) notif1.classList.add('is-visible');
            if (notif2) notif2.classList.add('is-visible');
            if (notif3) notif3.classList.add('is-visible');
            if (notif4) notif4.classList.add('is-visible');
            if (counterOverlay) counterOverlay.classList.add('is-active');
            if (counterNumEl) counterNumEl.textContent = '209';
        }
    }

    function runNextScene() {
        if (!isAutoPlaying) return;
        let nextScene = currentSceneIdx + 2;
        if (nextScene > 5) nextScene = 1;
        activateScene(nextScene);
        sceneTimer = setTimeout(runNextScene, scenesData[currentSceneIdx].duration);
    }

    function startSimulation() {
        clearTimeout(sceneTimer);
        isAutoPlaying = true;
        activateScene(1);
        sceneTimer = setTimeout(runNextScene, scenesData[0].duration);
    }

    // Manual scene tabs click
    sceneTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            clearTimeout(sceneTimer);
            isAutoPlaying = false; // pause auto sequence so user can inspect
            const sNum = parseInt(tab.getAttribute('data-scene'), 10);
            activateScene(sNum);
        });
    });

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            startSimulation();
        });
    }

    // IntersectionObserver to auto-start when user reaches section
    if (lockscreenSection && 'IntersectionObserver' in window) {
        let hasTriggered = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasTriggered) {
                    hasTriggered = true;
                    startSimulation();
                }
            });
        }, { threshold: 0.35 });

        observer.observe(lockscreenSection);
    } else {
        startSimulation();
    }

});
