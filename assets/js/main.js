(() => {
  const body = document.body;

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

  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!revealElements.length) {
    return;
  }

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
})();
