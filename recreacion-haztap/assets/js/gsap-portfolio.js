document.addEventListener("DOMContentLoaded", () => {
    
    // Verificamos si existe el grid
    const portfolioGrid = document.querySelector('.ht-portfolio-grid');
    if(!portfolioGrid) return;

    gsap.registerPlugin(ScrollTrigger);

    const catBtns = document.querySelectorAll('.ht-filter-btn');
    const searchInput = document.getElementById('htSearchInput');
    const msgDiv = document.getElementById('htSearchResultsMsg');
    
    let items = Array.from(document.querySelectorAll('.ht-portfolio-item'));

    /* ----------------------------------------------------
       0. UTILIDAD: DIVIDIR TEXTO PARA ANIMAR LETRAS/PALABRAS
    ------------------------------------------------------*/
    function splitTextForAnimation(element) {
        const text = element.innerText;
        element.innerHTML = '';
        const words = text.split(' ');
        
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.style.display = 'inline-block';
            wordSpan.style.overflow = 'hidden';
            wordSpan.style.verticalAlign = 'top';
            // Para mantener el espacio entre palabras
            wordSpan.style.paddingRight = index < words.length - 1 ? '0.25em' : '0';
            
            const innerSpan = document.createElement('span');
            innerSpan.className = 'ht-word-inner';
            innerSpan.style.display = 'inline-block';
            innerSpan.style.transform = 'translateY(110%)';
            innerSpan.style.willChange = 'transform';
            innerSpan.innerText = word;
            
            wordSpan.appendChild(innerSpan);
            element.appendChild(wordSpan);
        });
    }

    /* ----------------------------------------------------
       1. ANIMACIÓN DEL HERO (ELEMENTOR WIDGETS)
    ------------------------------------------------------*/
    // Seleccionamos la primera sección de Elementor que suele ser el Hero
    const heroSection = document.querySelector('.elementor-section.elementor-top-section');
    let heroDuration = 0.2; // Delay base

    if (heroSection) {
        const heroHeadings = heroSection.querySelectorAll('.elementor-widget-heading .elementor-heading-title');
        const heroTexts = heroSection.querySelectorAll('.elementor-widget-text-editor');

        const heroTl = gsap.timeline({ delay: 0.2 });

        // Aplicamos el split text a los headings
        heroHeadings.forEach((heading, index) => {
            splitTextForAnimation(heading);
            const words = heading.querySelectorAll('.ht-word-inner');
            
            if (words.length > 0) {
                heroTl.to(words, {
                    y: "0%",
                    duration: 1,
                    stagger: 0.05,
                    ease: "power4.out",
                    onComplete: () => {
                        words.forEach(w => {
                            if(w.parentElement) w.parentElement.style.overflow = 'visible';
                        });
                    }
                }, index === 0 ? 0 : "-=0.6");
            }
        });

        // Animamos los textos normales (párrafos descriptivos)
        if (heroTexts.length > 0) {
            heroTl.fromTo(heroTexts, 
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
                "-=0.6"
            );
        }
        
        heroDuration = 1.2; // Aumentamos el delay para los filtros si hay hero
    }

    /* ----------------------------------------------------
       2. ANIMACIÓN DE ENTRADA (NAV Y SEARCH)
    ------------------------------------------------------*/
    const headerTl = gsap.timeline({ delay: heroDuration });
    headerTl.from(catBtns, {
        y: -30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out"
    }).from('.ht-search-container', {
        x: 30,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    }, "-=0.8");
    /* ----------------------------------------------------
       3. ANIMACIÓN DE TARJETAS CON SCROLLTRIGGER
    ------------------------------------------------------*/
    function initPortfolioItem(item) {
        // Preparar título para animación
        const title = item.querySelector('.ht-project-title');
        if (title && !title.querySelector('.ht-word-inner')) {
            splitTextForAnimation(title);
        }
        
        const words = item.querySelectorAll('.ht-word-inner');
        const category = item.querySelector('.ht-project-category');
        const mockups = item.querySelector('.ht-mockups-container');

        // Estado inicial de la tarjeta - Valores exactos para la sensación cinemática original
        gsap.set(item, { opacity: 0, y: 80, scale: 0.96 });

        ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            once: true,
            onEnter: () => {
                const cardTl = gsap.timeline();
                
                // Aparición de la tarjeta con expo.out (cinemático y ágil)
                cardTl.to(item, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "expo.out"
                });
                
                // Efecto secundario en el mockup
                cardTl.fromTo(mockups, 
                    { scale: 0.94 },
                    { scale: 1, duration: 1.4, ease: "expo.out" },
                    "-=1.2"
                );

                // Aparición del Título Palabra por Palabra
                if (words.length > 0) {
                    cardTl.to(words, {
                        y: "0%",
                        duration: 1,
                        stagger: 0.05,
                        ease: "power4.out",
                        onComplete: () => {
                            words.forEach(w => {
                                if(w.parentElement) w.parentElement.style.overflow = 'visible';
                            });
                        }
                    }, "-=1.0");
                }
                
                // Elementos extra: Categoría
                if(category) {
                    cardTl.fromTo(category, 
                        { opacity: 0, x: -15 },
                        { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
                        "-=0.8"
                    );
                }
            }
        });
        // El zoom hover elegante está manejado vía CSS en .ht-item-link:hover .ht-mockup-screen img

        // Efecto Especial: Parallax del iPhone al scrollear
        const iphoneWrapper = item.querySelector('.ht-iphone-wrapper');
        if (iphoneWrapper) {
            gsap.fromTo(iphoneWrapper, 
                { y: 40 },
                {
                    y: -40,
                    ease: "none",
                    scrollTrigger: {
                        trigger: item,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.5, // Reducido de 1.5 → más fluido en GPUs integradas
                        fastScrollEnd: true // Termina la animación rápidamente al frenar
                    }
                }
            );
        }
    }

    // Inicializamos items cargados inicialmente
    items.forEach(initPortfolioItem);

    /* ----------------------------------------------------
       4. ANIMACIÓN AL FILTRAR POR CATEGORÍAS
    ------------------------------------------------------*/
    function filterItems(filterValue) {
        const hideTargets = [];
        const showTargets = [];
        
        items.forEach(item => {
            if (filterValue === '*' || item.classList.contains(filterValue.substring(1))) {
                showTargets.push(item);
            } else {
                if (item.style.display !== 'none') {
                    hideTargets.push(item);
                }
            }
        });

        const filterTl = gsap.timeline();
        
        // Bloqueamos la altura de la grilla temporalmente para evitar que 
        // el scrollbar parpadee y cause temblores en los botones ("tiembla la categoria").
        const currentHeight = portfolioGrid.offsetHeight;
        gsap.set(portfolioGrid, { minHeight: currentHeight });
        
        // Desaparecen los que no coinciden
        if (hideTargets.length > 0) {
            filterTl.to(hideTargets, {
                scale: 0.9,
                opacity: 0,
                y: 50,
                duration: 0.4,
                stagger: 0.02,
                ease: "power2.inOut",
                onComplete: () => {
                    hideTargets.forEach(el => el.style.display = 'none');
                }
            });
        }

        // Aparecen los que coinciden con animación stagger
        filterTl.add(() => {
            showTargets.forEach(el => {
                if (el.style.display === 'none') {
                    el.style.display = 'block';
                    gsap.set(el, { scale: 0.9, opacity: 0, y: 60 });
                }
            });
        }, hideTargets.length > 0 ? "+=0.1" : 0);

        if (showTargets.length > 0) {
            filterTl.to(showTargets, {
                scale: 1, 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                stagger: 0.05, 
                ease: "expo.out",
                onComplete: () => {
                    // Limpiamos la altura bloqueada y refrescamos scroll
                    gsap.set(portfolioGrid, { clearProps: "minHeight" });
                    ScrollTrigger.refresh();
                }
            });
            
            // Re-animar los textos para los que se muestran
            showTargets.forEach((item, index) => {
                const words = item.querySelectorAll('.ht-word-inner');
                if(words.length) {
                    gsap.fromTo(words, 
                        { y: "110%" },
                        { 
                            y: "0%", 
                            duration: 0.8, 
                            stagger: 0.04, 
                            ease: "power4.out", 
                            delay: 0.2 + (index * 0.05),
                            onComplete: () => {
                                words.forEach(w => {
                                    if(w.parentElement) w.parentElement.style.overflow = 'visible';
                                });
                            }
                        }
                    );
                }
            });
        } else {
            // Si no hay targets (raro), igual liberamos el grid
            gsap.set(portfolioGrid, { clearProps: "minHeight" });
            ScrollTrigger.refresh();
        }
    }

    catBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (e.currentTarget.classList.contains('active')) return;

            catBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            const filterValue = e.currentTarget.getAttribute('data-filter');
            filterItems(filterValue);
            
            if(searchInput) {
                searchInput.value = '';
                if(msgDiv) msgDiv.textContent = '';
            }
        });
    });

    /* ----------------------------------------------------
       5. BÚSQUEDA INLINE ANIMADA
    ------------------------------------------------------*/
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            let matchCount = 0;

            items.forEach(item => {
                const title = item.getAttribute('data-title') || '';
                const cat = item.getAttribute('data-category') || '';
                const keywords = item.getAttribute('data-keywords') || '';
                
                if(title.includes(query) || cat.includes(query) || keywords.includes(query)) {
                    if (item.style.display === 'none') {
                        item.style.display = 'block';
                        gsap.fromTo(item, 
                            { scale: 0.9, opacity: 0, y: 30 }, 
                            { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
                        );
                    } else {
                        gsap.to(item, { scale: 1, opacity: 1, y: 0, duration: 0.3 });
                    }
                    matchCount++;
                } else {
                    gsap.to(item, { scale: 0.95, opacity: 0, y: 20, duration: 0.3, onComplete: () => {
                        item.style.display = 'none';
                    }});
                }
            });

            if(msgDiv) {
                if(query === '') {
                    msgDiv.textContent = '';
                } else if (matchCount === 0) {
                    msgDiv.textContent = 'No se encontraron proyectos';
                } else {
                    msgDiv.textContent = `${matchCount} encontrados`;
                }
            }

            if(query !== '') {
                catBtns.forEach(b => b.classList.remove('active'));
                const allBtn = document.querySelector('.ht-filter-btn[data-filter="*"]');
                if(allBtn) allBtn.classList.add('active');
            }
        });
    }

    /* ----------------------------------------------------
       6. AJAX LOAD MORE
    ------------------------------------------------------*/
    const loadMoreBtn = document.getElementById('htLoadMoreBtn');
    if(loadMoreBtn) {
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const btn = e.currentTarget;
            let page = parseInt(btn.getAttribute('data-page'));
            const maxPage = parseInt(btn.getAttribute('data-max'));
            const category = btn.getAttribute('data-category') || '';
            
            if(page >= maxPage) return;
            
            // UI state: Cargando
            const btnText = btn.querySelector('.ht-btn-text');
            const originalText = btnText.innerText;
            btnText.innerText = 'Cargando proyectos...';
            btn.style.opacity = '0.6';
            btn.style.pointerEvents = 'none';

            const formData = new FormData();
            formData.append('action', 'haztap_load_more_portfolio');
            formData.append('page', page + 1);
            if (category !== '') {
                formData.append('category', category);
            }

            fetch(haztapAjax.ajaxurl, {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if(data.success && data.data.html) {
                    // Convertir HTML string a elementos reales
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.data.html;
                    const newItems = Array.from(tempDiv.children);

                    newItems.forEach(item => {
                        portfolioGrid.appendChild(item);
                        initPortfolioItem(item); // Aplica GSAP al nuevo nodo
                        items.push(item); // Añade al arreglo global de items
                    });

                    // Actualiza estado del botón
                    page++;
                    btn.setAttribute('data-page', page);
                    
                    if(page >= data.data.max_pages) {
                        btn.parentElement.style.display = 'none'; // Ocultar si no hay más
                    } else {
                        btnText.innerText = originalText;
                        btn.style.opacity = '1';
                        btn.style.pointerEvents = 'auto';
                    }

                    // Refrescar ScrollTrigger para detectar los nuevos tamaños de página
                    setTimeout(() => {
                        ScrollTrigger.refresh();
                    }, 400);

                    // Re-aplicar filtro o búsqueda activa si aplica
                    const activeFilter = document.querySelector('.ht-filter-btn.active');
                    const activeFilterVal = activeFilter ? activeFilter.getAttribute('data-filter') : '*';
                    
                    if(searchInput && searchInput.value.trim() !== '') {
                        searchInput.dispatchEvent(new Event('input'));
                    } else {
                        filterItems(activeFilterVal);
                    }
                }
            })
            .catch(err => {
                console.error("Error al cargar más proyectos:", err);
                btnText.innerText = 'Error. Intentar de nuevo.';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            });
        });
    }

    /* ----------------------------------------------------
       7. DRAG TO SCROLL (Categorías Carousel en PC) & ARROWS
    ------------------------------------------------------*/
    const filtersNav = document.querySelector('.ht-filters');
    if (filtersNav) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Soporte Touch nativo si drag falla
        filtersNav.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - filtersNav.offsetLeft;
            scrollLeft = filtersNav.scrollLeft;
        }, {passive: true});
        
        filtersNav.addEventListener('touchend', () => {
            isDown = false;
        }, {passive: true});
        
        filtersNav.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - filtersNav.offsetLeft;
            const walk = (x - startX) * 2;
            filtersNav.scrollLeft = scrollLeft - walk;
        }, {passive: true});

        // Mouse Events
        filtersNav.addEventListener('mousedown', (e) => {
            isDown = true;
            filtersNav.classList.add('active');
            startX = e.pageX - filtersNav.offsetLeft;
            scrollLeft = filtersNav.scrollLeft;
        });
        filtersNav.addEventListener('mouseleave', () => {
            isDown = false;
            filtersNav.classList.remove('active');
        });
        filtersNav.addEventListener('mouseup', () => {
            isDown = false;
            filtersNav.classList.remove('active');
        });
        filtersNav.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - filtersNav.offsetLeft;
            const walk = (x - startX) * 2; // velocidad de scroll
            filtersNav.scrollLeft = scrollLeft - walk;
        });
        
        // Navigation Arrows
        const btnPrev = document.querySelector('.ht-filter-prev');
        const btnNext = document.querySelector('.ht-filter-next');
        
        if(btnPrev) {
            btnPrev.addEventListener('click', () => {
                filtersNav.scrollBy({ left: -150, behavior: 'smooth' });
            });
        }
        
        if(btnNext) {
            btnNext.addEventListener('click', () => {
                filtersNav.scrollBy({ left: 150, behavior: 'smooth' });
            });
        }
    }
});
