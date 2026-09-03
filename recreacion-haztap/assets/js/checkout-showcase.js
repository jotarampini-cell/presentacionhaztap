document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('playback-toggle-btn');
    const toggleBtnLabel = document.getElementById('playback-btn-label');
    const statusPill = document.getElementById('playback-status');
    const statusText = document.getElementById('playback-status-text');
    const iframe = document.getElementById('checkout-iframe');

    let isAutoPlaying = true;
    let autoPlayTimer = null;

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
        
        // Reload iframe to reset state cleanly for the demo
        if (iframe) {
            iframe.src = iframe.src;
            // The onload event will restart runAutoTour
        }
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

    function runAutoTour() {
        if (!isAutoPlaying) return;

        // T+1.5s: Select Delivery Local
        autoPlayTimer = setTimeout(() => {
            if (!isAutoPlaying) return;
            sendCmd('click', '.card-interactive', '', 0);
            
            // T+2.5s: Select City (Caracas)
            autoPlayTimer = setTimeout(() => {
                if (!isAutoPlaying) return;
                sendCmd('type', '.select-premium', 'caracas', 0);
                
                // T+3.5s: Select Zone (Las Mercedes)
                autoPlayTimer = setTimeout(() => {
                    sendCmd('type', '.select-premium', 'las-mercedes', 1);
                    
                    // T+4.5s: Wait for map to load, then click map wrapper (simulation)
                    autoPlayTimer = setTimeout(() => {
                        // The user normally taps the map, we just skip to continue
                        sendCmd('scroll', 'button.btn-primary');
                        sendCmd('click', 'button.btn-primary.w-full');
                        
                        // T+6.0s: Form Data (Customer Info)
                        autoPlayTimer = setTimeout(() => {
                            sendCmd('type', '.input-premium', 'María Valentina Gómez', 0); // Name
                            sendCmd('type', '.input-premium', '24891042', 1); // ID
                            sendCmd('type', '.input-premium', '4149201842', 2); // Phone
                            sendCmd('type', '.input-premium', 'mvalentina@gmail.com', 3); // Email
                            
                            // T+7.5s: Continue to Payment
                            autoPlayTimer = setTimeout(() => {
                                sendCmd('click', 'button.btn-primary.w-full'); // Continuar a Pago
                                
                                // T+9.0s: Type Reference in Payment
                                autoPlayTimer = setTimeout(() => {
                                    // In the payment tab, reference input is typically the first or second input-premium
                                    // Usually the first is bank select, second is reference text input.
                                    sendCmd('type', '.input-premium', '849201', 0);
                                    
                                    // T+10.5s: Confirm Payment
                                    autoPlayTimer = setTimeout(() => {
                                        sendCmd('click', 'button.btn-primary.w-full');
                                        
                                        // T+16.0s: Restart Tour
                                        autoPlayTimer = setTimeout(() => {
                                            if (isAutoPlaying) {
                                                activateAutoMode();
                                            }
                                        }, 6000);
                                    }, 1500);
                                }, 1500);
                            }, 1500);
                        }, 1500);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1500);
    }

    if (iframe) {
        iframe.onload = () => {
            runAutoTour();
        };
    }
});
