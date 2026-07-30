/**
 * MADHURA B PORTFOLIO INTERACTIVE SCRIPT
 * Features: Preloader, Canvas Particle System, Dynamic Typewriter,
 *           Scroll Reveal Animations, 3D Card Tilt, Modal Dialogs,
 *           Custom Cursor Glow, Skills Filter, and Contact Form Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initParticleCanvas();
  initTypewriter();
  initNavbarAndScroll();
  initCursorGlow();
  initTiltEffects();
  initRippleEffect();
  initSkillsFilter();
  initModals();
  initContactAndCopy();
  initScrollReveals();
});

/* ==========================================================================
   1. PRELOADER ANIMATION
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const counter = document.getElementById('loader-counter');
  const fill = document.getElementById('loader-fill');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
      }, 400);
    }
    counter.textContent = `${progress}%`;
    fill.style.width = `${progress}%`;
  }, 40);
}

/* ==========================================================================
   2. INTERACTIVE PARTICLE CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: null, y: null, radius: 150 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse Proximity Interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. DYNAMIC TYPEWRITER ROTATOR
   ========================================================================== */
function initTypewriter() {
  const typewriter = document.getElementById('typewriter');
  if (!typewriter) return;

  const words = [
    'Full-Stack Developer',
    'AI Agriculture Tech Creator',
    'Real-Time Systems Architect',
    'Computer Science Engineer'
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIdx];
    
    if (isDeleting) {
      typewriter.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typewriter.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentWord.length) {
      delay = 2200; // Pause at full word
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      wordIdx = (wordIdx + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ==========================================================================
   4. NAVBAR & SCROLL CONTROLS
   ========================================================================== */
function initNavbarAndScroll() {
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Navbar glass effect
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Progress Bar
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = `${scrollPercent}%`;

    // Back to top button visibility
    if (scrollTop > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // Section Active Link Tracking
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollTop >= top && scrollTop < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Hamburger Toggle
  hamburgerBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburgerBtn.classList.toggle('active');
  });

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburgerBtn.classList.remove('active');
    });
  });

  // Back to Top Click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. MOUSE FOLLOW GLOW EFFECT
   ========================================================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderGlow() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    requestAnimationFrame(renderGlow);
  }

  renderGlow();
}

/* ==========================================================================
   6. 3D CARD TILT INTERACTION
   ========================================================================== */
function initTiltEffects() {
  const tiltCards = document.querySelectorAll('.tilt-card, #hero-tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   7. BUTTON RIPPLE EFFECT
   ========================================================================== */
function initRippleEffect() {
  const rippleBtns = document.querySelectorAll('.ripple');

  rippleBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');
      
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;

      const existing = this.querySelector('.ripple-circle');
      if (existing) existing.remove();

      this.appendChild(circle);
    });
  });
}

/* ==========================================================================
   8. SKILLS FILTER TABS
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-tabs .filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            if (!card.classList.contains('active')) card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   9. MODAL DIALOG CONTROLS
   ========================================================================== */
function initModals() {
  const modalTriggers = document.querySelectorAll('.modal-trigger, #view-resume-modal-btn');
  const closeBtns = document.querySelectorAll('[data-close]');
  const overlays = document.querySelectorAll('.modal-overlay');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal') || 'modal-resume';
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Resume Download Button Simulation
  const downloadBtn = document.getElementById('download-resume-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const modalResume = document.getElementById('modal-resume');
      modalResume.classList.add('active');
      showToast('Opening Resume Preview for Print / Download...');
    });
  }
}

/* ==========================================================================
   10. CONTACT FORM & CLICK-TO-COPY HANDLERS
   ========================================================================== */
function initContactAndCopy() {
  // Click to Copy Cards
  const copyTriggers = document.querySelectorAll('.copy-trigger');
  copyTriggers.forEach(card => {
    card.addEventListener('click', () => {
      const textToCopy = card.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(err => {
          showToast('Failed to copy text', 'error');
        });
      }
    });
  });

  // Contact Form Submit
  const form = document.getElementById('portfolio-contact-form');
  const responseMsg = document.getElementById('form-response');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
        
        responseMsg.className = 'form-response success';
        responseMsg.textContent = `Thank you, ${name}! Your message has been sent successfully. I will get back to you soon.`;
        form.reset();
        showToast('Message sent successfully!');

        setTimeout(() => {
          responseMsg.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }
}

/* ==========================================================================
   11. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   UTILITY: TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
