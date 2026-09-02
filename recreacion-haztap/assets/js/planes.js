document.addEventListener('DOMContentLoaded', () => {
    
    // Toggle Features functionality
    const toggleButtons = document.querySelectorAll('.htp-toggle-features');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.htp-plan-card');
            const isExpanded = card.classList.contains('is-expanded');
            
            const textMore = this.querySelector('.htp-toggle-text-more');
            const textLess = this.querySelector('.htp-toggle-text-less');
            
            if(isExpanded) {
                card.classList.remove('is-expanded');
                textMore.style.display = 'inline';
                textLess.style.display = 'none';
            } else {
                card.classList.add('is-expanded');
                textMore.style.display = 'none';
                textLess.style.display = 'inline';
            }
        });
    });

    // Setup delays for SVG animations
    const cards = document.querySelectorAll('.htp-plan-card');
    cards.forEach(card => {
        const features = card.querySelectorAll('.htp-feature-item');
        features.forEach((feature, index) => {
            feature.style.setProperty('--delay', index);
        });
    });

    // Canvas Particles System
    const canvas = document.getElementById('htp-particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;
        let particles = [];

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * 0.3 - 0.15;
                this.opacity = Math.random() * 0.4 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // GSAP Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.htp-pricing-wrapper',
                start: 'top 75%'
            }
        });

        // 1. Header Animations
        tl.from('.htp-pricing-subtitle', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
          .from('.htp-pricing-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
          .from('.htp-pricing-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
          
        // 2. Cards Entrance
          .from('.htp-plan-card', {
              y: 80,
              opacity: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: 'power4.out',
              onComplete: () => {
                  // Trigger SVG checkmark animations
                  cards.forEach(card => card.classList.add('is-visible'));
              }
          }, '-=0.4');

        // 3. Inner card content animations
        cards.forEach((card, index) => {
            gsap.from(card.querySelectorAll('.htp-card-inner > *'), {
                y: 15,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            });
        });

    } else {
        // Fallback if GSAP is not loaded
        cards.forEach(card => card.classList.add('is-visible'));
    }
});
