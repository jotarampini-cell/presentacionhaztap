document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CONFIGURACIÓN DEL SIMULADOR CALENDLY ---
    const daysContainer = document.getElementById('calendar-days-grid');
    const timeSlotsList = document.getElementById('time-slots-list');
    const selectedDateDisplay = document.getElementById('selected-date-display');
    const step1Wrap = document.getElementById('booking-step-1');
    const step2Wrap = document.getElementById('booking-step-2');
    const stepSuccessWrap = document.getElementById('booking-step-success');
    const proceedToFormBtn = document.getElementById('proceed-to-form-btn');
    const backToCalendarBtn = document.getElementById('back-to-calendar-btn');
    const bookingForm = document.getElementById('calendly-booking-form');
    
    // Elementos del resumen final
    const summaryDateTime = document.getElementById('summary-datetime');
    const summaryClient = document.getElementById('summary-client');

    let selectedDay = 15;
    let selectedTime = "10:00 AM";

    // Generar días interactivos
    if (daysContainer) {
        daysContainer.querySelectorAll('.cal-day-cell:not(.is-disabled)').forEach(cell => {
            cell.addEventListener('click', () => {
                daysContainer.querySelectorAll('.cal-day-cell').forEach(c => c.classList.remove('is-active'));
                cell.classList.add('is-active');
                selectedDay = cell.getAttribute('data-day') || cell.textContent.trim();
                updateDateTimeLabel();
            });
        });
    }

    // Horarios interactivos
    if (timeSlotsList) {
        timeSlotsList.querySelectorAll('.time-slot-btn').forEach(slot => {
            slot.addEventListener('click', () => {
                timeSlotsList.querySelectorAll('.time-slot-btn').forEach(s => s.classList.remove('is-selected'));
                slot.classList.add('is-selected');
                selectedTime = slot.getAttribute('data-time') || slot.textContent.trim();
                updateDateTimeLabel();
                if (proceedToFormBtn) proceedToFormBtn.style.display = 'inline-flex';
            });
        });
    }

    function updateDateTimeLabel() {
        if (selectedDateDisplay) {
            selectedDateDisplay.textContent = `Día ${selectedDay} de este mes · ${selectedTime}`;
        }
    }

    // Pasar a Paso 2 (Formulario)
    if (proceedToFormBtn) {
        proceedToFormBtn.addEventListener('click', () => {
            if (step1Wrap) step1Wrap.style.display = 'none';
            if (step2Wrap) step2Wrap.classList.add('is-visible');
        });
    }

    // Volver a Paso 1 (Calendario)
    if (backToCalendarBtn) {
        backToCalendarBtn.addEventListener('click', () => {
            if (step2Wrap) step2Wrap.classList.remove('is-visible');
            if (step1Wrap) step1Wrap.style.display = 'flex';
        });
    }

    // Enviar formulario (Simular confirmación)
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const clientName = document.getElementById('field-client-name')?.value || 'Emprendedor';
            const businessName = document.getElementById('field-business-name')?.value || 'Mi Marca';

            if (step2Wrap) step2Wrap.classList.remove('is-visible');
            if (stepSuccessWrap) stepSuccessWrap.classList.add('is-visible');

            if (summaryDateTime) {
                summaryDateTime.textContent = `Día ${selectedDay} · ${selectedTime} (Hora de Caracas)`;
            }
            if (summaryClient) {
                summaryClient.textContent = `${clientName} · ${businessName}`;
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
        if (unmuteBtn) {
            let isMuted = true;
            unmuteBtn.addEventListener('click', () => {
                isMuted = !isMuted;
                document.querySelectorAll('.funnel-video-swiper video').forEach(v => {
                    v.muted = isMuted;
                    if (!isMuted) v.play().catch(() => {});
                });
                unmuteBtn.innerHTML = isMuted ? 
                    '<i class="ph-bold ph-speaker-high"></i> Activar Sonido' : 
                    '<i class="ph-bold ph-speaker-slash"></i> Silenciar Sonido';
            });
        }
    }

});
