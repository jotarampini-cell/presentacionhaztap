document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONTROLADOR DE PASOS APPLE (TABS & BOTONES) ---
    const tabs = document.querySelectorAll('.apple-step-tab');
    const panes = document.querySelectorAll('.checkout-step-pane');
    const callouts = document.querySelectorAll('.benefit-callout-card');

    function setActiveStep(stepIndex) {
        // Actualizar Tabs
        tabs.forEach((tab, idx) => {
            if (idx === stepIndex) {
                tab.classList.add('is-active');
            } else {
                tab.classList.remove('is-active');
            }
        });

        // Actualizar Vistas del Checkout
        panes.forEach((pane, idx) => {
            if (idx === stepIndex) {
                pane.classList.add('is-active');
            } else {
                pane.classList.remove('is-active');
            }
        });

        // Actualizar Tarjetas de Valor
        callouts.forEach((card, idx) => {
            if (idx === stepIndex) {
                card.classList.add('is-active');
            } else {
                card.classList.remove('is-active');
            }
        });
    }

    // Eventos en los tabs superiores
    tabs.forEach((tab, idx) => {
        tab.addEventListener('click', () => {
            setActiveStep(idx);
        });
    });

    // Botones de avance dentro del flujo
    document.querySelectorAll('[data-goto-step]').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextIdx = parseInt(btn.getAttribute('data-goto-step'), 10);
            setActiveStep(nextIdx);
        });
    });

    // --- 2. PASO 1: MÉTODOS DE ENTREGA ---
    const deliveryModes = document.querySelectorAll('.delivery-mode-card');
    const subLocal = document.getElementById('subview-local');
    const subNacional = document.getElementById('subview-nacional');
    const subPickup = document.getElementById('subview-pickup');

    deliveryModes.forEach(card => {
        card.addEventListener('click', () => {
            deliveryModes.forEach(c => c.classList.remove('is-selected'));
            card.classList.add('is-selected');

            const mode = card.getAttribute('data-mode');
            if (subLocal) subLocal.style.display = mode === 'local' ? 'block' : 'none';
            if (subNacional) subNacional.style.display = mode === 'national' ? 'block' : 'none';
            if (subPickup) subPickup.style.display = mode === 'pickup' ? 'block' : 'none';
        });
    });

    // Simulación de fijar pin en el mapa
    const mapBox = document.querySelector('.map-selector-box');
    const addressInput = document.getElementById('co-address-text');
    if (mapBox && addressInput) {
        mapBox.addEventListener('click', () => {
            const sampleAddresses = [
                'Av. Principal de Las Mercedes, Edif. Torre ABA, Piso 3',
                'Calle Los Cedros, Qta. Santa María, Altamira, Caracas',
                'Av. Francisco de Miranda, Centro Lido, Torre B, Chacao'
            ];
            const rand = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];
            addressInput.textContent = rand;
            mapBox.style.boxShadow = '0 0 0 2px #059669';
            setTimeout(() => { mapBox.style.boxShadow = 'none'; }, 800);
        });
    }

    // --- 3. PASO 2: INICIO DE SESIÓN / IDENTIFICACIÓN ---
    const authTabs = document.querySelectorAll('.auth-tab-btn');
    const formNew = document.getElementById('auth-form-new');
    const formOtp = document.getElementById('auth-form-otp');
    const sendOtpBtn = document.getElementById('btn-send-otp');
    const otpDigits = document.querySelectorAll('.otp-box-digit');

    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');

            const isOtp = tab.getAttribute('data-auth') === 'otp';
            if (formNew) formNew.style.display = isOtp ? 'none' : 'grid';
            if (formOtp) formOtp.style.display = isOtp ? 'block' : 'none';
        });
    });

    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', () => {
            sendOtpBtn.textContent = 'Enviando código...';
            setTimeout(() => {
                sendOtpBtn.textContent = '¡Código enviado a WhatsApp!';
                const code = ['4', '8', '2', '9'];
                otpDigits.forEach((box, i) => {
                    box.textContent = code[i];
                    box.style.borderColor = '#059669';
                    box.style.color = '#059669';
                });
            }, 600);
        });
    }

    // --- 4. PASO 3: PAGOS (BS & USD / CONCILIACIÓN) ---
    const curBtns = document.querySelectorAll('.cur-btn');
    const totalDisplay = document.getElementById('co-total-display');
    let currentCurrency = 'USD';

    curBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            curBtns.forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            currentCurrency = btn.getAttribute('data-cur');

            if (totalDisplay) {
                totalDisplay.textContent = currentCurrency === 'USD' ? '$48.00 USD' : 'Bs. 1,980.00 VES';
            }
        });
    });

    const paymentItems = document.querySelectorAll('.payment-card-item');
    const autoBox = document.getElementById('pago-auto-box');
    const manualBox = document.getElementById('pago-manual-box');

    paymentItems.forEach(item => {
        item.addEventListener('click', () => {
            paymentItems.forEach(p => p.classList.remove('is-selected'));
            item.classList.add('is-selected');

            const isAuto = item.getAttribute('data-type') === 'auto';
            if (autoBox) autoBox.style.display = isAuto ? 'block' : 'none';
            if (manualBox) manualBox.style.display = isAuto ? 'none' : 'block';
        });
    });

    // Simular Conciliación Automática
    const btnConciliar = document.getElementById('btn-conciliar-pago');
    const reconcileStatus = document.getElementById('reconcile-status-badge');
    if (btnConciliar) {
        btnConciliar.addEventListener('click', () => {
            btnConciliar.textContent = 'Consultando alianza bancaria...';
            setTimeout(() => {
                btnConciliar.textContent = 'Pago Conciliado con Éxito';
                btnConciliar.style.background = '#059669';
                if (reconcileStatus) {
                    reconcileStatus.style.display = 'inline-flex';
                }
                setTimeout(() => {
                    setActiveStep(3); // Pasar a confirmación
                }, 900);
            }, 1000);
        });
    }

    // --- 5. PASO 4: CONFIRMACIÓN Y WHATSAPP ---
    const waBtn = document.getElementById('btn-co-whatsapp');
    if (waBtn) {
        waBtn.addEventListener('click', () => {
            const msg = encodeURIComponent("¡Hola! Acabo de completar mi pedido #HZ-84920 en su tienda Haztap. Ya validé el pago por Pago Móvil.");
            window.open(`https://wa.link/mo02tp?text=${msg}`, '_blank');
        });
    }

    const resetBtn = document.getElementById('btn-reset-showcase');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            setActiveStep(0);
        });
    }

});
