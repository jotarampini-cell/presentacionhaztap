document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('playback-toggle-btn');
    const toggleBtnLabel = document.getElementById('playback-btn-label');
    const statusPill = document.getElementById('playback-status');
    const statusText = document.getElementById('playback-status-text');
    const iframe = document.getElementById('checkout-iframe');

    let isAutoPlaying = true;
    let autoPlayTimer = null;
    let sequenceTimeouts = [];

    function clearAllTimeouts() {
        if (autoPlayTimer) clearTimeout(autoPlayTimer);
        sequenceTimeouts.forEach(t => clearTimeout(t));
        sequenceTimeouts = [];
    }

    function activateManualMode() {
        if (!isAutoPlaying) return;
        isAutoPlaying = false;
        clearAllTimeouts();

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
        
        if (iframe) iframe.src = iframe.src;
    }

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

    window.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'USER_INTERACTION') {
            activateManualMode();
        }
    });

    function sendCmd(action, selector, value = '', index = undefined) {
        if (!isAutoPlaying || !iframe || !iframe.contentWindow) return;
        iframe.contentWindow.postMessage({ action, selector, value, index }, '*');
    }

    function schedule(time, fn) {
        const t = setTimeout(() => {
            if (isAutoPlaying) fn();
        }, time);
        sequenceTimeouts.push(t);
    }

    function runAutoTour() {
        if (!isAutoPlaying) return;
        clearAllTimeouts();

        // STEP 1: ENTREGA
        schedule(1500, () => sendCmd('click', '.card-interactive', '', 0)); 
        schedule(2500, () => sendCmd('type', '.select-premium', 'caracas', 0));
        schedule(3500, () => sendCmd('type', '.select-premium', 'las-mercedes', 1));
        
        schedule(4500, () => sendCmd('type', '.input-premium', 'Torre Orinoco, Piso 4', 0)); 
        schedule(5500, () => sendCmd('click', 'button.btn-secondary')); 
        
        schedule(6500, () => {
            sendCmd('click', 'button.btn-primary:not(:disabled)', '', 0); 
            sendCmd('click', '.lg\\:hidden button.btn-primary', '', 0); 
        });

        // STEP 2: DATOS
        schedule(8000, () => sendCmd('type', '.input-premium', 'María Valentina Gómez', 0));
        schedule(8500, () => sendCmd('type', '.input-premium', '24891042', 1));
        schedule(9000, () => sendCmd('type', '.input-premium', '4149201842', 2));
        schedule(9500, () => sendCmd('type', '.input-premium', 'mvalentina@gmail.com', 3));
        
        schedule(10500, () => {
            sendCmd('click', 'button.btn-primary:not(:disabled)', '', 0);
            sendCmd('click', '.lg\\:hidden button.btn-primary', '', 0);
        });

        // STEP 3: PAGO
        // Select Zelle (index 0 since USD is default)
        schedule(12000, () => sendCmd('click', '.card-interactive', '', 0));
        
        // Upload Zelle Screenshot (fake upload trigger)
        schedule(13000, () => sendCmd('upload', 'input[type="file"]', 'captura_zelle_012.png', 0));
        
        // Type Zelle Reference
        schedule(14000, () => sendCmd('type', '.input-premium', '98402941', 0));
        
        // Finish purchase
        schedule(15500, () => sendCmd('click', 'button.btn-primary:not(:disabled)', '', 0));

        // Restart loop after success screen
        schedule(21000, () => {
            if (isAutoPlaying) activateAutoMode();
        });
    }

    if (iframe) {
        iframe.onload = () => {
            runAutoTour();
        };
    }
});
