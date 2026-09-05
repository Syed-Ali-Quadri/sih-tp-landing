/* ===================================================
   SMART EDUCATION — Landing Page JavaScript
   Lenis smooth scroll + GSAP animations + interactions
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ========================
  // 1. PRELOADER
  // ========================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });
  // Safety timeout
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);

  // ========================
  // 2. LENIS SMOOTH SCROLL
  // ========================
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -80 });
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });

  // ========================
  // 3. GSAP REGISTER
  // ========================
  gsap.registerPlugin(ScrollTrigger);

  // ========================
  // 4. NAVBAR SCROLL EFFECT
  // ========================
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.scroll() > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    },
  });

  // ========================
  // 5. HAMBURGER MENU
  // ========================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }

  // ========================
  // 6. CUSTOM CURSOR (Desktop)
  // ========================
  const cursorFollower = document.getElementById('cursor-follower');
  const cursorDot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'power2.out' });
    });

    function updateCursorFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(updateCursorFollower);
    }
    updateCursorFollower();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .feature-card, .gam-card, .league-badge, .reward-item');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorFollower.style.width = '52px';
        cursorFollower.style.height = '52px';
        cursorFollower.style.borderColor = 'rgba(108, 92, 231, 0.6)';
        cursorDot.style.opacity = '0';
      });
      el.addEventListener('mouseleave', () => {
        cursorFollower.style.width = '36px';
        cursorFollower.style.height = '36px';
        cursorFollower.style.borderColor = 'rgba(108, 92, 231, 0.4)';
        cursorDot.style.opacity = '1';
      });
    });
  }

  // ========================
  // 7. HERO ANIMATIONS
  // ========================
  const heroTl = gsap.timeline({ delay: 1 });

  heroTl
    .from('.hero-badge', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out',
    })
    .from('.hero-line', {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    }, '-=0.3')
    .from('.hero-subtitle', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.4')
    .from('.hero-cta-group .btn', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.3')
    .from('.hero-stats', {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from('.floating-card', {
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.7)',
    }, '-=0.4')
    .from('.scroll-indicator', {
      opacity: 0,
      y: 10,
      duration: 0.4,
      ease: 'power2.out',
    }, '-=0.2');

  // ========================
  // 8. COUNTER ANIMATION
  // ========================
  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(num => {
    const target = parseInt(num.getAttribute('data-count'));
    ScrollTrigger.create({
      trigger: num,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(num, {
          textContent: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function() {
            num.textContent = Math.round(parseFloat(num.textContent));
          },
        });
      },
    });
  });

  // ========================
  // 9. FEATURES SECTION ANIMATIONS
  // ========================
  gsap.from('#features .section-tag', {
    scrollTrigger: {
      trigger: '#features .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power3.out',
  });

  gsap.from('#features .section-title', {
    scrollTrigger: {
      trigger: '#features .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay: 0.1,
    ease: 'power3.out',
  });

  gsap.from('#features .section-desc', {
    scrollTrigger: {
      trigger: '#features .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay: 0.2,
    ease: 'power3.out',
  });

  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    duration: 0.7,
    stagger: {
      each: 0.12,
      from: 'start',
    },
    ease: 'power3.out',
  });

  // Feature card tilt on hover (desktop only)
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000,
        });

        // Move glow
        const glow = card.querySelector('.feature-card-glow');
        if (glow) {
          const glowX = (x / rect.width) * 100;
          const glowY = (y / rect.height) * 100;
          glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(108,92,231,0.08) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power3.out',
        });
      });
    });
  }

  // ========================
  // 10. HOW IT WORKS ANIMATIONS
  // ========================
  gsap.from('#how-it-works .section-tag', {
    scrollTrigger: {
      trigger: '#how-it-works .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power3.out',
  });

  gsap.from('#how-it-works .section-title', {
    scrollTrigger: {
      trigger: '#how-it-works .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay: 0.1,
    ease: 'power3.out',
  });

  gsap.from('#how-it-works .section-desc', {
    scrollTrigger: {
      trigger: '#how-it-works .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay: 0.2,
    ease: 'power3.out',
  });

  // Timeline line grow
  gsap.from('.loop-line', {
    scrollTrigger: {
      trigger: '.loop-timeline',
      start: 'top 75%',
      end: 'bottom 60%',
      scrub: 1,
    },
    scaleY: 0,
    transformOrigin: 'top center',
  });

  // Steps stagger
  gsap.from('.loop-step', {
    scrollTrigger: {
      trigger: '.loop-timeline',
      start: 'top 75%',
    },
    opacity: 0,
    x: -30,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power3.out',
  });

  // Loop flow visual
  gsap.from('.loop-flow-visual', {
    scrollTrigger: {
      trigger: '.loop-flow-visual',
      start: 'top 85%',
    },
    opacity: 0,
    y: 30,
    duration: 0.7,
    ease: 'power3.out',
  });

  gsap.from('.loop-flow-item, .loop-flow-arrow', {
    scrollTrigger: {
      trigger: '.loop-flow-visual',
      start: 'top 85%',
    },
    opacity: 0,
    scale: 0.8,
    duration: 0.4,
    stagger: 0.06,
    ease: 'back.out(1.7)',
  });

  // ========================
  // 11. FOCUS SECTION ANIMATIONS
  // ========================
  gsap.from('.focus-content .section-tag', {
    scrollTrigger: {
      trigger: '#focus',
      start: 'top 70%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power3.out',
  });

  gsap.from('.focus-content .section-title', {
    scrollTrigger: {
      trigger: '#focus',
      start: 'top 70%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay: 0.1,
    ease: 'power3.out',
  });

  gsap.from('.focus-content .section-desc', {
    scrollTrigger: {
      trigger: '#focus',
      start: 'top 70%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay: 0.2,
    ease: 'power3.out',
  });

  gsap.from('.focus-features-list li', {
    scrollTrigger: {
      trigger: '.focus-features-list',
      start: 'top 85%',
    },
    opacity: 0,
    x: -30,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
  });

  gsap.from('.focus-mock', {
    scrollTrigger: {
      trigger: '.focus-visual',
      start: 'top 75%',
    },
    opacity: 0,
    x: 60,
    rotateY: 5,
    duration: 0.9,
    ease: 'power3.out',
    transformPerspective: 1000,
  });

  // Focus mock subtle parallax
  ScrollTrigger.create({
    trigger: '#focus',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const mock = document.querySelector('.focus-mock');
      if (mock) {
        gsap.to(mock, {
          y: self.progress * -20,
          duration: 0.3,
          ease: 'none',
        });
      }
    },
  });

  // ========================
  // 12. GAMIFICATION SECTION ANIMATIONS
  // ========================
  gsap.from('#gamification .section-tag', {
    scrollTrigger: {
      trigger: '#gamification .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power3.out',
  });

  gsap.from('#gamification .section-title', {
    scrollTrigger: {
      trigger: '#gamification .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay: 0.1,
    ease: 'power3.out',
  });

  gsap.from('#gamification .section-desc', {
    scrollTrigger: {
      trigger: '#gamification .section-header',
      start: 'top 80%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay: 0.2,
    ease: 'power3.out',
  });

  gsap.from('.gam-card', {
    scrollTrigger: {
      trigger: '.gamification-grid',
      start: 'top 80%',
    },
    opacity: 0,
    y: 50,
    duration: 0.7,
    stagger: {
      each: 0.12,
      from: 'start',
    },
    ease: 'power3.out',
  });

  // Animate progress bar fill
  ScrollTrigger.create({
    trigger: '.gam-progress-bar',
    start: 'top 90%',
    once: true,
    onEnter: () => {
      const fill = document.querySelector('.gam-progress-fill');
      if (fill) {
        fill.style.width = '0%';
        gsap.to(fill, {
          width: '75%',
          duration: 1.5,
          delay: 0.3,
          ease: 'power3.out',
        });
      }
    },
  });

  // ========================
  // 13. CTA SECTION ANIMATIONS
  // ========================
  gsap.from('.cta-title', {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 75%',
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    ease: 'power3.out',
  });

  gsap.from('.cta-desc', {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 75%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay: 0.15,
    ease: 'power3.out',
  });

  gsap.from('.cta-form', {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 70%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    delay: 0.3,
    ease: 'power3.out',
  });

  gsap.from('.cta-trust', {
    scrollTrigger: {
      trigger: '#cta',
      start: 'top 70%',
    },
    opacity: 0,
    y: 20,
    duration: 0.5,
    delay: 0.4,
    ease: 'power3.out',
  });

  // ========================
  // 14. FOOTER ANIMATIONS
  // ========================
  gsap.from('.footer-top', {
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 90%',
    },
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: 'power3.out',
  });

  // ========================
  // 15. CTA FORM INTERACTION
  // ========================
  const ctaSubmit = document.getElementById('ctaSubmit');
  const ctaEmail = document.getElementById('ctaEmail');

  ctaSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const email = ctaEmail.value.trim();
    if (email && email.includes('@')) {
      ctaSubmit.innerHTML = '<span>🎉 You\'re in!</span>';
      ctaSubmit.style.background = 'linear-gradient(135deg, #00B894, #00D2FF)';
      ctaEmail.value = '';
      gsap.from(ctaSubmit, {
        scale: 0.9,
        duration: 0.4,
        ease: 'back.out(2)',
      });
      setTimeout(() => {
        ctaSubmit.innerHTML = '<span>Get Early Access</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        ctaSubmit.style.background = '';
      }, 3000);
    } else {
      // Shake animation for invalid input
      gsap.to('.cta-input-wrap', {
        x: [-8, 8, -6, 6, -3, 3, 0],
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  });

  // ========================
  // 16. PARALLAX ORB MOVEMENT
  // ========================
  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      gsap.to('.hero-orb-1', { x: x * 20, y: y * 15, duration: 1.5, ease: 'power2.out' });
      gsap.to('.hero-orb-2', { x: x * -15, y: y * -20, duration: 1.5, ease: 'power2.out' });
      gsap.to('.hero-orb-3', { x: x * 10, y: y * 12, duration: 1.5, ease: 'power2.out' });
    });
  }

  // ========================
  // 17. MAGNETIC BUTTONS (Desktop)
  // ========================
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * 0.2,
          y: y * 0.2,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // ========================
  // 18. MOBILE TOUCH ANIMATIONS
  // ========================
  if (window.matchMedia('(hover: none)').matches) {
    // Intersection Observer for mobile reveal animations
    const mobileObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    // Add touch ripple effect on mobile cards
    document.querySelectorAll('.feature-card, .gam-card').forEach(card => {
      card.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      }, { passive: true });
      card.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      }, { passive: true });
    });
  }

  // ========================
  // 19. RESIZE HANDLER
  // ========================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  });

});
