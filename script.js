// Activa estilos progresivos solo cuando JavaScript esta disponible.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelectorAll(".nav-link");
  const progress = document.querySelector(".scroll-progress");
  const revealElements = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("main section[id]");

  // Control del menu responsive.
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = !body.classList.contains("nav-open");
      body.classList.toggle("nav-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menu de navegacion" : "Abrir menu de navegacion"
      );
    });
  }

  // Cierra el menu movil al navegar hacia una sala.
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "Abrir menu de navegacion");
    });
  });

  // Controles opcionales que usen data-target con desplazamiento suave y offset del encabezado.
  document.querySelectorAll("[data-target]").forEach((control) => {
    control.addEventListener("click", (event) => {
      const target = document.querySelector(control.dataset.target);
      if (target) {
        event.preventDefault();
        const header = document.querySelector("[data-header]");
        const offset = (header?.offsetHeight || 0) + 16;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
        window.history.replaceState(null, "", control.dataset.target);
      }
    });
  });

  // Animacion de aparicion al hacer scroll.
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  // Marca en el menu la seccion visible del recorrido.
  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: "-38% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }

  // Barra superior de progreso de lectura.
  const updateProgress = () => {
    if (!progress) return;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const current = total > 0 ? (window.scrollY / total) * 100 : 0;
    progress.style.width = `${Math.min(current, 100)}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  // Reemplazo local para imagenes externas si no se pueden cargar.
  const fallbackSvgs = {
    document: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 520">
        <rect width="700" height="520" fill="#efe3d1"/>
        <rect x="170" y="52" width="360" height="416" rx="8" fill="#fffaf1" stroke="#6c4328" stroke-width="8"/>
        <path d="M230 140h240M230 188h240M230 236h210M230 284h240M230 332h190" stroke="#112f4d" stroke-width="14" stroke-linecap="round"/>
        <circle cx="455" cy="390" r="34" fill="none" stroke="#b58a45" stroke-width="10"/>
        <path d="M430 420l-20 54 45-25 45 25-20-54" fill="#b58a45"/>
        <text x="350" y="105" text-anchor="middle" fill="#422615" font-family="Georgia, serif" font-size="32">Documento historico</text>
      </svg>
    `,
  };

  const encodeSvg = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener(
      "error",
      () => {
        const fallback = fallbackSvgs[image.dataset.fallback];
        if (fallback) {
          image.src = encodeSvg(fallback);
        }
      },
      { once: true }
    );
  });

  // Escape cierra el menu si esta abierto.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      body.classList.remove("nav-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.focus();
    }
  });
});
