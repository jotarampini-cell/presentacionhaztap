/**
 * HAZTAP — Page Transitions
 * Sistema de transiciones cinematográficas entre páginas.
 * 
 * Estrategia (Awwwards-grade):
 *  1. Usuario hace click en un link interno.
 *  2. Se muestra un overlay negro que cubre toda la pantalla (SALIDA).
 *  3. El navegador navega a la nueva URL.
 *  4. Al cargar la nueva página, el overlay se retira con un fade (ENTRADA).
 * 
 * No interfiere con ScrollTrigger ni otras animaciones GSAP.
 * Usa `sessionStorage` para comunicar que se hizo una transición entre páginas.
 */

(function () {
    // Guard: GSAP debe estar disponible.
    if (typeof gsap === 'undefined') return;

    // ─── CONSTANTES ────────────────────────────────────────────────────────────
    const TRANSITION_FLAG  = 'ht_page_transition';
    const DURATION_OUT     = 0.55;   // Duración en segundos del fade de SALIDA
    const DURATION_IN      = 0.65;   // Duración en segundos del fade de ENTRADA
    const EASE_OUT         = 'power2.inOut';
    const EASE_IN          = 'power2.out';

    // ─── INYECTAR EL OVERLAY EN EL DOM ─────────────────────────────────────────
    // Lo inyectamos por JS para que esté disponible en cualquier template
    // sin tocar los archivos PHP de las páginas.
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id    = 'ht-page-transition';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.innerHTML = `
            <div id="ht-transition-overlay"></div>
            <div id="ht-transition-bar"></div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    const overlay = createOverlay();
    const bg      = document.getElementById('ht-transition-overlay');
    const bar     = document.getElementById('ht-transition-bar');

    // El overlay no debe interceptar clics; solo opacity lo activa.
    gsap.set(overlay, { pointerEvents: 'none' });

    // ─── FUNCIÓN: ANIMACIÓN DE SALIDA (click → navegación) ─────────────────────
    function animateOut(href) {
        // Activar puntero para bloquear interacción durante transición
        gsap.set(overlay, { pointerEvents: 'all' });

        const tl = gsap.timeline({
            onComplete: () => {
                // Flag para que la página siguiente sepa que debe animar ENTRADA
                sessionStorage.setItem(TRANSITION_FLAG, '1');
                window.location.href = href;
            }
        });

        tl.to(bg, {
            opacity: 1,
            duration: DURATION_OUT,
            ease: EASE_OUT,
        }).to(bar, {
            width: '100%',
            duration: DURATION_OUT * 0.8,
            ease: 'power1.in',
        }, '<'); // simultáneo con el fade
    }

    // ─── FUNCIÓN: ANIMACIÓN DE ENTRADA (página nueva cargada) ─────────────────
    function animateIn() {
        // El overlay debe comenzar opaco (cubriendo la pantalla)
        gsap.set(bg,  { opacity: 1 });
        gsap.set(bar, { width: '100%' });
        gsap.set(overlay, { pointerEvents: 'all' });

        const tl = gsap.timeline({
            // Pequeño delay para que el DOM de la nueva página termine de pintar
            delay: 0.1,
            onComplete: () => {
                gsap.set(overlay, { pointerEvents: 'none' });
                // Limpiar el flag
                sessionStorage.removeItem(TRANSITION_FLAG);
            }
        });

        tl.to(bg, {
            opacity: 0,
            duration: DURATION_IN,
            ease: EASE_IN,
        }).to(bar, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
        }, '<+=0.2');
    }

    // ─── INTERCEPTAR CLICKS EN LINKS INTERNOS ─────────────────────────────────
    document.addEventListener('click', function (e) {
        // Buscar el <a> más cercano al elemento clickeado
        const link = e.target.closest('a');

        if (!link) return;

        const href = link.getAttribute('href'); if (href.includes('embudo.html')) return;

        // Ignorar:
        // - links sin href
        // - links que abren en nueva pestaña (_blank, etc.)
        // - links a anclas en la misma página (#...)
        // - links externos (diferente dominio)
        // - links mailto:, tel:, javascript:
        // - links al admin de WordPress (/wp-admin/, /wp-login.php)
        if (
            !href ||
            link.target === '_blank' ||
            link.hasAttribute('download') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:') ||
            href.includes('/wp-admin/') ||
            href.includes('/wp-login.php') ||
            href.includes('?') && href.includes('action=') // forms WP
        ) {
            return;
        }

        // Verificar que es un link interno (mismo origen)
        try {
            const url = new URL(href, window.location.href);
            if (url.origin !== window.location.origin) return;
            // Si ya estamos en la misma página, ignorar
            if (url.pathname === window.location.pathname && !url.search) return;
        } catch (err) {
            return;
        }

        // Interceptar y animar
        e.preventDefault();
        animateOut(href);
    }, true); // capture: true para atrapar antes que otros listeners

    // ─── DETECTAR SI LLEGAMOS DESDE UNA TRANSICIÓN ────────────────────────────
    // Se dispara tan pronto como el DOM está listo, antes de que otras
    // animaciones comiencen (ScrollTrigger, etc.)
    if (sessionStorage.getItem(TRANSITION_FLAG) === '1') {
        animateIn();
    }

    // ─── FIX BFCache (Back/Forward Cache) ─────────────────────────────────────
    // Si el usuario presiona "Atrás", la página se restaura exactamente como estaba
    // antes de irse (con el overlay en negro). Lo limpiamos inmediatamente.
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            // El usuario regresó usando el botón 'Atrás'
            gsap.set(bg, { opacity: 0 });
            gsap.set(bar, { width: '0%', opacity: 0 });
            gsap.set(overlay, { pointerEvents: 'none' });
            sessionStorage.removeItem(TRANSITION_FLAG);
        }
    });

})();
