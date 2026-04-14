(() => {
  const body = document.body;
  const root = document.documentElement;

  document.querySelectorAll(".js-year").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const currentPage = body.dataset.page;
  if (currentPage) {
    document.querySelectorAll("[data-link]").forEach((link) => {
      if (link.dataset.link === currentPage) {
        link.classList.add("is-active");
      }
    });
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  const closeNav = () => {
    if (!nav || !navToggle) {
      return;
    }
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (!nav.contains(target) && !navToggle.contains(target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");
  body.prepend(progressBar);

  const updateScrollProgress = () => {
    const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
    root.style.setProperty("--scroll-progress", `${progress}%`);
    body.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const rotateY = ((x - 50) / 50) * 2;
      const rotateX = ((50 - y) / 50) * 1.5;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
      card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    });
  });

  const printButton = document.querySelector("[data-resume-print]");
  const resumeFrame = document.querySelector(".resume-frame");
  if (printButton) {
    printButton.addEventListener("click", () => {
      if (resumeFrame instanceof HTMLIFrameElement && resumeFrame.contentWindow) {
        try {
          resumeFrame.contentWindow.focus();
          resumeFrame.contentWindow.print();
          return;
        } catch (error) {
          window.print();
          return;
        }
      }
      window.print();
    });
  }

  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
  if (revealElements.length) {
    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }
})();
