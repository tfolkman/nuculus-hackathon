/**
 * Invincible Shardplate — Interactive Effects
 * Aiden Folkman · B8
 */

// ===== STORMLIGHT PARTICLE SYSTEM =====
const canvas = document.getElementById('stormlight-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 3 + 0.5;
    this.speedY = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.life = Math.random() * 100 + 100;
    this.maxLife = this.life;
    this.hue = Math.random() > 0.7 ? 50 : 190; // gold or cyan
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
    this.life--;

    // Mouse interaction
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      const force = (150 - dist) / 150;
      this.x += dx * force * 0.02;
      this.y += dy * force * 0.02;
    }

    if (this.life <= 0 || this.y < -10) {
      this.reset();
    }
  }

  draw() {
    const lifeRatio = this.life / this.maxLife;
    const alpha = this.opacity * lifeRatio;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
    ctx.fill();

    // Glow
    if (this.size > 2) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha * 0.15})`;
      ctx.fill();
    }
  }
}

// Initialize particles
const particleCount = window.innerWidth < 768 ? 60 : 120;
for (let i = 0; i < particleCount; i++) {
  const p = new Particle();
  p.y = Math.random() * canvas.height;
  particles.push(p);
}

// Mouse tracking
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw connections between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Add stagger delay for children if it's a grid
      const children = entry.target.querySelectorAll('.feature-card, .ring');
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
      });
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Observe feature cards individually for stagger
const featureCards = document.querySelectorAll('.feature-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('active');
      }, i * 100);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

featureCards.forEach(card => {
  card.classList.add('reveal');
  cardObserver.observe(card);
});

// ===== 3D TILT EFFECT =====
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== NAVBAR BACKGROUND ON SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.style.background = 'rgba(6, 6, 10, 0.95)';
    navbar.style.backdropFilter = 'blur(12px)';
  } else {
    navbar.style.background = 'linear-gradient(to bottom, rgba(6,6,10,0.9) 0%, transparent 100%)';
    navbar.style.backdropFilter = 'blur(8px)';
  }

  lastScroll = currentScroll;
});

// ===== ARMOR IMAGE HOVER EFFECT =====
const armorImage = document.querySelector('.armor-image');
if (armorImage) {
  armorImage.addEventListener('mouseenter', () => {
    armorImage.style.filter = 'drop-shadow(0 0 50px rgba(0, 229, 255, 0.4))';
  });
  armorImage.addEventListener('mouseleave', () => {
    armorImage.style.filter = 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.2))';
  });
}
