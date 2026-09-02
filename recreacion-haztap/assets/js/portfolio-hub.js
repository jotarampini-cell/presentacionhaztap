// assets/js/portfolio-hub.js
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Animación de Entrada con GSAP (Awwwards Style)
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        
        // Revelar header (Title + Desc)
        tl.fromTo(".ht-hub-header", 
            { y: 50, opacity: 0, visibility: 'hidden' }, 
            { y: 0, opacity: 1, visibility: 'visible', duration: 1.5, delay: 0.1 }
        )
        // Revelar tarjetas en cascada (Stagger)
        .fromTo(".ht-hub-card", 
            { y: 80, opacity: 0, visibility: 'hidden', scale: 0.95 },
            { y: 0, opacity: 1, visibility: 'visible', scale: 1, duration: 1.5, stagger: 0.15 },
            "-=1.2"
        );
    }

    // Efecto de glow interactivo en las tarjetas
    const cards = document.querySelectorAll(".ht-hub-card");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // Partículas de fondo (opcional, muy sutil)
    const canvas = document.getElementById("ht-hub-particles-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let width, height, particles;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > width) this.x = 0;
            else if (this.x < 0) this.x = width;
            
            if (this.y > height) this.y = 0;
            else if (this.y < 0) this.y = height;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = Math.min(width * height / 15000, 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();
});
