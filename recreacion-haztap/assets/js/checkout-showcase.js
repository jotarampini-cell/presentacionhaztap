document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DOM ---
    const stepItems = document.querySelectorAll('.co-step-item');
    const screenPanes = document.querySelectorAll('.co-screen-pane');
    const statusPill = document.getElementById('playback-status');
    const statusText = document.getElementById('playback-status-text');
    const toggleBtn = document.getElementById('playback-toggle-btn');
    const toggleBtnLabel = document.getElementById('playback-btn-label');
    const checkoutWindow = document.getElementById('checkout-app-window');

    // Elementos interactivos del checkout
    const deliveryCards = document.querySelectorAll('.co-interactive-card[data-mode]');
    const subLocal = document.getElementById('subview-local');
    const subNacional = document.getElementById('subview-nacional');
    const subPickup = document.getElementById('subview-pickup');
    const inputName = document.getElementById('co-name-input');
    const inputPhone = document.getElementById('co-phone-input');
    const inputRef = document.getElementById('co-ref-input');
    const btnConfirmPay = document.getElementById('co-btn-confirm-pay');
    const curBtns = document.querySelectorAll('.co-cur-btn');
    const subtotalDisplay = document.getElementById('co-subtotal-val');
    const totalDisplay = document.getElementById('co-total-val');
    const rateNote = document.getElementById('co-rate-note');

    let currentStep = 0;
    let isAutoPlaying = true;
    let autoPlayTimer = null;
    let autoTourStep = 0;

    // --- FUNCIÓN PARA CAMBIAR DE PASO ---
    function goToStep(index) {
        currentStep = Math.max(0, Math.min(index, 3));

        // Actualizar barra de progreso superior
        stepItems.forEach((item, idx) => {
            if (idx === currentStep) {
                item.classList.add('is-active');
                item.classList.remove('is-passed');
            } else if (idx < currentStep) {
                item.classList.add('is-passed');
                item.classList.remove('is-active');
            } else {
                item.classList.remove('is-passed', 'is-active');
            }
        });

        // Actualizar pantalla visible
        screenPanes.forEach((pane, idx) => {
            if (idx === currentStep) {
                pane.classList.add('is-active');
            } else {
                pane.classList.remove('is-active');
            }
        });
    }

    // --- MODO MANUAL (ROMPER LA AUTOMATIZACIÓN AL INTERACTUAR) ---
    function activateManualMode() {
        if (!isAutoPlaying) return;
        isAutoPlaying = false;
        clearTimeout(autoPlayTimer);

        if (statusText) statusText.textContent = 'Modo Interactivo Activo (Prueba tú mismo)';
        if (statusPill) statusPill.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        if (toggleBtnLabel) toggleBtnLabel.textContent = 'Reproducir auto-demo';
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="ph-bold ph-play"></i> <span>Ver auto-demo</span>';
        }
    }

    function activateAutoMode() {
        isAutoPlaying = true;
        if (statusText) statusText.textContent = 'Reproduciendo demostración automática';
        if (statusPill) statusPill.style.borderColor = 'rgba(255, 255, 255, 0.12)';
        if (toggleBtn) {
            toggleBtn.innerHTML = '<i class="ph-bold ph-hand-tap"></i> <span>Interactuar manualmente</span>';
        }
        autoTourStep = 0;
        runAutoTour();
    }

    // Botón de alternar modo
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isAutoPlaying) {
                activateManualMode();
            } else {
                activateAutoMode();
            }
        });
    }

    // Cualquier clic dentro de la ventana del checkout rompe la automatización
    if (checkoutWindow) {
        checkoutWindow.addEventListener('click', (e) => {
            // Si hace clic en un botón o input, pasa a manual de inmediato
            if (isAutoPlaying) {
                activateManualMode();
            }
        }, { capture: true });
    }

    // Permitir clic manual en los pasos del stepper superior
    stepItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            activateManualMode();
            goToStep(idx);
        });
    });

    // Botones de avance/retroceso manuales
    document.querySelectorAll('[data-goto]').forEach(btn => {
        btn.addEventListener('click', () => {
            activateManualMode();
            const target = parseInt(btn.getAttribute('data-goto'), 10);
            goToStep(target);
        });
    });

    // Selección manual de métodos de entrega
    deliveryCards.forEach(card => {
        card.addEventListener('click', () => {
            activateManualMode();
            deliveryCards.forEach(c => c.classList.remove('is-selected'));
            card.classList.add('is-selected');

            const mode = card.getAttribute('data-mode');
            if (subLocal) subLocal.style.display = mode === 'local' ? 'block' : 'none';
            if (subNacional) subNacional.style.display = mode === 'national' ? 'block' : 'none';
            if (subPickup) subPickup.style.display = mode === 'pickup' ? 'block' : 'none';

            // Actualizar costo de envío en resumen
            const shipDisplay = document.getElementById('co-shipping-val');
            if (shipDisplay) {
                if (mode === 'local') shipDisplay.textContent = '$3.00';
                else if (mode === 'national') shipDisplay.textContent = 'Cobro a destino';
                else if (mode === 'pickup') shipDisplay.textContent = 'Gratis';
            }
        });
    });

    // Toggle de moneda manual
    curBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activateManualMode();
            curBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            const cur = btn.getAttribute('data-cur');
            if (cur === 'VES') {
                if (subtotalDisplay) subtotalDisplay.textContent = 'Bs. 27,248.64';
                if (totalDisplay) totalDisplay.textContent = 'Bs. 28,951.68';
                if (rateNote) rateNote.style.display = 'block';
            } else {
                if (subtotalDisplay) subtotalDisplay.textContent = '$48.00';
                if (totalDisplay) totalDisplay.textContent = '$51.00';
                if (rateNote) rateNote.style.display = 'none';
            }
        });
    });

    // Simular Conciliación de Pago en manual
    if (btnConfirmPay) {
        btnConfirmPay.addEventListener('click', () => {
            activateManualMode();
            btnConfirmPay.textContent = 'Conciliando con el banco...';
            setTimeout(() => {
                btnConfirmPay.textContent = 'Confirmar Pago';
                goToStep(3); // Listo
            }, 800);
        });
    }

    // Botón reiniciar en pantalla final
    const btnResetOrder = document.getElementById('btn-reset-order');
    if (btnResetOrder) {
        btnResetOrder.addEventListener('click', () => {
            goToStep(0);
        });
    }

    // --- 3. MOTOR DE AUTO-DEMOSTRACIÓN (VIDEO LOOP) ---
    function runAutoTour() {
        if (!isAutoPlaying) return;

        // Fase 0: Entrega (Paso 0)
        goToStep(0);
        if (subLocal) subLocal.style.display = 'block';
        if (subNacional) subNacional.style.display = 'none';
        if (subPickup) subPickup.style.display = 'none';

        // T+2.2s: Simula confirmación de entrega y avanza a Datos
        autoPlayTimer = setTimeout(() => {
            if (!isAutoPlaying) return;
            goToStep(1);

            // Simula tecleo de datos
            if (inputName) inputName.value = 'María Valentina Gómez';
            if (inputPhone) inputPhone.value = '0414-9201842';

            // T+4.5s: Avanza a Pago
            autoPlayTimer = setTimeout(() => {
                if (!isAutoPlaying) return;
                goToStep(2);

                if (inputRef) inputRef.value = '849201';

                // T+7.2s: Simula validación y avanza a Confirmación
                autoPlayTimer = setTimeout(() => {
                    if (!isAutoPlaying) return;
                    goToStep(3);

                    // T+11.0s: Reinicia el ciclo suavemente
                    autoPlayTimer = setTimeout(() => {
                        if (!isAutoPlaying) return;
                        runAutoTour();
                    }, 4200);

                }, 2800);

            }, 2400);

        }, 2500);
    }

    // Iniciar auto-tour inicial
    runAutoTour();

});
