document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  // Default to light theme; respect user toggle if set in this session/version
  const saved = localStorage.getItem("portfolio-theme-v2");
  const initialTheme = saved || "light";
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
    if (meta) meta.content = isDark ? "#0f1013" : "#f7f6f2";
  };
  syncThemeUI();

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      localStorage.setItem("portfolio-theme-v2", next);
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

  // Custom Cursor
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    }, { passive: true });
  } else {
    if (dot) dot.style.display = "none";
    if (ring) ring.style.display = "none";
  }

  // Interactive Project Galleries
  const galleries = document.querySelectorAll(".project-gallery");

  galleries.forEach((gallery) => {
    const slides = gallery.querySelectorAll(".gallery-slide");
    const total = slides.length;
    if (total <= 1) return;

    const prevBtn = gallery.querySelector(".gallery-nav-btn.prev");
    const nextBtn = gallery.querySelector(".gallery-nav-btn.next");
    const badgeIdx = gallery.querySelector(".current-idx");
    const badgeCaption = gallery.querySelector(".current-caption");

    let current = 0;
    let timer = null;

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
    gallery.addEventListener("mouseleave", startAuto);

    startAuto();
  });
});
