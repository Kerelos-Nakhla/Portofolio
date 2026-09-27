/* ==========================================================================
   Kerelos Nakhla — Portfolio JavaScript
   Video-Inspired Preloader, Cursor, Motion Reveals, and Interactive Features
   ========================================================================== */

// 1. Rock-Solid Video Preloader & Curtain Reveal
(function initVideoPreloader() {
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter');
  const fillEl = document.getElementById('preloader-bar-fill');
  const statusEl = document.getElementById('preloader-status');

  if (!preloader) return;

  let isDismissed = false;

  function dismiss() {
    if (isDismissed) return;
    isDismissed = true;
    
    if (counterEl) counterEl.textContent = '100%';
    if (fillEl) fillEl.style.width = '100%';
    if (statusEl) statusEl.textContent = 'EXPERIENCE READY';

    preloader.classList.add('fade-out');
    preloader.style.opacity = '0';
    preloader.style.pointerEvents = 'none';
    preloader.style.visibility = 'hidden';
    document.body.style.overflow = '';

    // Remove from DOM render tree after animation completes
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 750);

    // Trigger initial hero and visible scroll reveals
    setTimeout(() => {
      const heroReveals = document.querySelectorAll('#home .reveal, .hero-content .reveal, .reveal');
      heroReveals.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          setTimeout(() => el.classList.add('active'), idx * 50);
        }
      });
    }, 150);
  }

  // Tap/click to immediately skip preloader
  preloader.addEventListener('click', dismiss);

  // Safety Hard Timeout — GUARANTEES preloader never gets stuck
  const safetyTimeout = setTimeout(dismiss, 1800);

  // Smooth interval-driven counter (doesn't pause on background/webview)
  let percent = 0;
  const targetDuration = 1200; // ms
  const stepInterval = 25; // ms
  const totalSteps = targetDuration / stepInterval;
  let currentStep = 0;

  const statusMessages = [
    { threshold: 0, text: 'INITIALIZING EXPERIENCE...' },
    { threshold: 30, text: 'LOADING INTERACTIVE DASHBOARDS...' },
    { threshold: 65, text: 'PREPARING MOTION & ANALYTICS...' },
    { threshold: 90, text: 'EXPERIENCE READY' }
  ];

  const intervalId = setInterval(() => {
    currentStep++;
    const progress = Math.min(currentStep / totalSteps, 1);
    // Cubic ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    percent = Math.floor(eased * 100);

    if (counterEl) {
      counterEl.textContent = (percent < 10 ? '0' + percent : percent) + '%';
    }
    if (fillEl) {
      fillEl.style.width = percent + '%';
    }
    if (statusEl) {
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (percent >= statusMessages[i].threshold) {
          statusEl.textContent = statusMessages[i].text;
          break;
        }
      }
    }

    if (percent >= 100) {
      clearInterval(intervalId);
      clearTimeout(safetyTimeout);
      setTimeout(dismiss, 200);
    }
  }, stepInterval);

  // Also dismiss when window finishes loading if already over 1s
  window.addEventListener('load', () => {
    setTimeout(dismiss, 1200);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  // Theme Management
  const saved = localStorage.getItem("portfolio-theme-v3");
  const initialTheme = saved || "dark";
  root.dataset.theme = initialTheme;

  const syncThemeUI = () => {
    const isDark = root.dataset.theme === "dark";
    if (toggle) {
      const icon = toggle.querySelector(".theme-icon");
      const text = toggle.querySelector(".theme-text");
      if (icon) icon.textContent = isDark ? "☀" : "☾";
      if (text) text.textContent = isDark ? "Light" : "Dark";
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? "#1a1a2e" : "#f7fff7";
  };
  syncThemeUI();

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("portfolio-theme-v3", next);
      syncThemeUI();
    });
  }

  // Scroll Progress Bar
  const progressBar = document.querySelector(".scroll-progress");
  window.addEventListener("scroll", () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total > 0 && progressBar) {
      const progress = (window.scrollY / total) * 100;
      progressBar.style.width = progress + "%";
    }
  }, { passive: true });

  // 2. Custom Interactive Cursor with smooth interpolation
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    }, { passive: true });

    function renderRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .certificate-card, .gallery-nav-btn, .project-filter, .filter-btn');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  } else {
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // Project filters + search
  const filterButtons = document.querySelectorAll(".project-filter");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  const projectSearch = document.getElementById("projectSearch");
  const projectSearchClear = document.getElementById("projectSearchClear");
  const projectFilterStatus = document.getElementById("projectFilterStatus");
  let activeProjectFilter = "all";

  const applyProjectFilters = () => {
    const query = (projectSearch?.value || "").trim().toLowerCase();
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const searchableText = card.textContent.toLowerCase();
      const matchesFilter = activeProjectFilter === "all" || categories.includes(activeProjectFilter);
      const matchesSearch = !query || searchableText.includes(query);
      const show = matchesFilter && matchesSearch;
      card.classList.toggle("is-filtered-out", !show);
      if (show) visibleCount += 1;
    });

    if (projectFilterStatus) {
      const label = activeProjectFilter === "all" ? "All projects" :
        activeProjectFilter === "featured" ? "Featured" :
        activeProjectFilter === "powerbi" ? "Power BI" : "Excel";
      projectFilterStatus.textContent = query
        ? `${visibleCount} project${visibleCount === 1 ? "" : "s"} match "${query}"`
        : `${visibleCount} project${visibleCount === 1 ? "" : "s"} shown`;
    }
    if (projectSearchClear) {
      projectSearchClear.classList.toggle("visible", Boolean(query));
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeProjectFilter = button.dataset.filter;
      filterButtons.forEach((b) => b.classList.toggle("active", b === button));
      applyProjectFilters();
    });
  });

  projectSearch?.addEventListener("input", applyProjectFilters);
  projectSearchClear?.addEventListener("click", () => {
    if (projectSearch) {
      projectSearch.value = "";
      projectSearch.focus();
    }
    applyProjectFilters();
  });

  applyProjectFilters();

  // Interactive Project Galleries
  const galleries = document.querySelectorAll(".project-gallery");

  galleries.forEach((gallery) => {
    const slides = gallery.querySelectorAll(".gallery-slide");
    gallery.setAttribute("tabindex", "0");
    gallery.setAttribute("role", "region");
    gallery.setAttribute("aria-label", "Project screenshot gallery");
    const total = slides.length;
    if (total <= 1) return;

    const prevBtn = gallery.querySelector(".gallery-nav-btn.prev");
    const nextBtn = gallery.querySelector(".gallery-nav-btn.next");
    const badgeIdx = gallery.querySelector(".current-idx");
    const badgeCaption = gallery.querySelector(".current-caption");

    let current = 0;
    let timer = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const showSlide = (idx) => {
      current = (idx + total) % total;
      slides.forEach((slide, i) => {
        if (i === current) {
          slide.classList.add("active");
        } else {
          slide.classList.remove("active");
        }
      });
      if (badgeIdx) badgeIdx.textContent = current + 1;
      if (badgeCaption) {
        const caption = slides[current].getAttribute("data-caption") || "";
        badgeCaption.textContent = caption;
      }
    };

    const nextSlide = () => showSlide(current + 1);
    const prevSlide = () => showSlide(current - 1);

    const startAuto = () => {
      stopAuto();
      timer = setInterval(nextSlide, 4500);
    };

    const stopAuto = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAuto();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAuto();
      });
    }

    gallery.addEventListener("mouseenter", stopAuto);
    gallery.addEventListener("mouseleave", () => {
      if (!reducedMotion && !document.hidden) startAuto();
    });
    gallery.addEventListener("focusin", stopAuto);
    gallery.addEventListener("focusout", () => {
      if (!reducedMotion && !document.hidden) startAuto();
    });
    gallery.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    });

    if (!reducedMotion) startAuto();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAuto();
      } else if (!reducedMotion) {
        startAuto();
      }
    });
  });
});

// Certificate Lightbox Modal
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
    document.body.style.overflow = '';
  }
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeCertificate();
  }
});
