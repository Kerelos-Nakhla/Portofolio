/* ==========================================================================
   Kerelos Nakhla — Portfolio JavaScript
   Handles Preloader, Cursor, Scroll Animations, and Modals
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Percentage Counter (Inspired by reference video)
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const fillEl = document.getElementById('preloader-bar-fill');

  let currentPercent = 0;
  const targetPercent = 100;
  const duration = 1600; // ms
  const startTime = performance.now();

  function updateLoader(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic curve
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    currentPercent = Math.floor(easedProgress * targetPercent);

    if (counterEl) counterEl.textContent = `${currentPercent}%`;
    if (fillEl) fillEl.style.width = `${currentPercent}%`;

    if (progress < 1) {
      requestAnimationFrame(updateLoader);
    } else {
      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('fade-out');
          document.body.style.overflow = 'auto';
        }
      }, 300);
    }
  }

  // Prevent scroll during preload
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(updateLoader);

  // 2. Custom Cursor (Smoothed)
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (window.matchMedia('(pointer: fine)').matches && dot && ring) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .certificate-card, .expertise-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = 'rgba(255, 255, 255, 0.7)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(255, 255, 255, 0.35)';
      });
    });
  }

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
});

// 4. Certificate Lightbox Modal
window.openCertificate = function(imgSrc, title) {
  const modal = document.getElementById('cert-modal');
  const modalImg = document.getElementById('cert-modal-img');
  const modalTitle = document.getElementById('cert-modal-title');

  if (modal && modalImg && modalTitle) {
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeCertificate = function() {
  const modal = document.getElementById('cert-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeCertificate();
  }
});
