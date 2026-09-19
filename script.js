document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("portfolio-theme");
  
  // Start with light theme by default
  const initialTheme = saved || "light";
  root.dataset.theme = initialTheme;

  const sync = () => {
    const isDark = root.dataset.theme === "dark";
    const icon = toggle ? toggle.querySelector(".theme-icon") : null;
    const text = toggle ? toggle.querySelector(".theme-text") : null;
    if (icon) icon.textContent = isDark ? "☀" : "☾";
    if (text) text.textContent = isDark ? "Light" : "Dark";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = isDark ? "#101010" : "#f5f3ee";
  };
  sync();

  if (toggle) {
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("portfolio-theme", root.dataset.theme);
      sync();
    });
  }

  // Reveal observer
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        reveal.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));

  // Count-up stats
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = +el.dataset.count;
    let start = 0;
    const step = () => {
      start += Math.max(1, Math.ceil(target / 24));
      el.textContent = Math.min(start, target);
      if (start < target) requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          step();
          obs.disconnect();
        }
      });
    }, { threshold: 0.8 });
    obs.observe(el);
  });

  // Scroll progress
  const bar = document.querySelector(".scroll-progress");
  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (h ? (scrollY / h) * 100 : 0) + "%";
  }, { passive: true });

  // Custom cursor
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring) {
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }, { passive: true });
    const cursorLoop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(cursorLoop);
    };
    cursorLoop();
    document.querySelectorAll("a, button, .project-card, .magnetic").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("active"));
    });
  }

  // --- PROJECT GALLERIES (AUTO-PLAY & MANUAL NAVIGATION) ---
  document.querySelectorAll(".project-gallery").forEach((gallery) => {
    const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
    const prevBtn = gallery.querySelector(".gallery-nav-btn.prev");
    const nextBtn = gallery.querySelector(".gallery-nav-btn.next");
    const idxSpan = gallery.querySelector(".current-idx");
    const captionSpan = gallery.querySelector(".current-caption");
    let currentIndex = 0;
    let timer = null;
    let isHovered = false;

    const showSlide = (newIndex) => {
      slides[currentIndex].classList.remove("active");
      currentIndex = (newIndex + slides.length) % slides.length;
      slides[currentIndex].classList.add("active");
      if (idxSpan) idxSpan.textContent = currentIndex + 1;
      if (captionSpan) captionSpan.textContent = slides[currentIndex].dataset.caption || "";
    };

    const startTimer = () => {
      stopTimer();
      timer = setInterval(() => {
        if (!isHovered && slides.length > 1) {
          showSlide(currentIndex + 1);
        }
      }, 4000);
    };

    const stopTimer = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showSlide(currentIndex - 1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showSlide(currentIndex + 1);
        startTimer();
      });
    }

    gallery.addEventListener("mouseenter", () => {
      isHovered = true;
    });

    gallery.addEventListener("mouseleave", () => {
      isHovered = false;
    });

    startTimer();
  });
});
