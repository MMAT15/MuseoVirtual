// Activa estilos progresivos solo cuando JavaScript esta disponible.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = document.querySelectorAll(".nav-link");
  const progress = document.querySelector(".scroll-progress");
  const revealElements = document.querySelectorAll(".reveal");
  const sections = document.querySelectorAll("main section[id]");
  const currentRoom = document.querySelector("[data-current-room]");
  const visitedCount = document.querySelector("[data-visited-count]");
  const completionCount = document.querySelector("[data-completion-count]");
  const completionBar = document.querySelector("[data-completion-bar]");
  const tourDots = document.querySelectorAll("[data-tour-dot]");
  const roomNames = {
    inicio: "Inicio",
    "sala-1": "Sala 1: Problemas",
    "sala-2": "Sala 2: Modelo docente",
    "sala-3": "Sala 3: Conflictos",
    "sala-4": "Sala 4: Sujetos",
    "sala-5": "Sala 5: Legado",
    "linea-tiempo": "Línea de tiempo",
    conclusion: "Conclusión",
  };
  const roomIds = ["sala-1", "sala-2", "sala-3", "sala-4", "sala-5"];
  const visitedRooms = new Set();

  // Control del menú responsive.
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = !body.classList.contains("nav-open");
      body.classList.toggle("nav-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
      );
    });
  }

  // Cierra el menú móvil al navegar hacia una sala.
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "Abrir menú de navegación");
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

  // Actualiza la guia fija y el progreso de salas visitadas.
  const updateVisitState = (sectionId) => {
    if (currentRoom && roomNames[sectionId]) {
      currentRoom.textContent = roomNames[sectionId];
    }

    if (roomIds.includes(sectionId)) {
      visitedRooms.add(sectionId);
    }

    const visitedTotal = visitedRooms.size;
    const progressText = `${visitedTotal} de ${roomIds.length} salas visitadas`;
    const progressPercent = (visitedTotal / roomIds.length) * 100;

    visitedCount && (visitedCount.textContent = progressText);
    completionCount && (completionCount.textContent = progressText);
    completionBar && (completionBar.style.width = `${progressPercent}%`);

    tourDots.forEach((dot) => {
      const dotTarget = dot.dataset.tourDot;
      dot.classList.toggle("is-active", dotTarget === sectionId);
      dot.classList.toggle("is-visited", visitedRooms.has(dotTarget));
    });
  };

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

  // Marca en el menú la sección visible del recorrido.
  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateVisitState(entry.target.id);
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

  // Cédulas ampliadas para los objetos destacados.
  const objectDetails = {
    "escuela-normal": {
      title: "Escuela Normal",
      body: "Fue la institución clave para organizar la formación de maestras y maestros. Su función excedía la enseñanza de contenidos: buscaba producir un cuerpo docente estable, regulado y preparado para expandir la escuela pública.",
      note: "En el recorrido, este objeto muestra cómo el Estado convirtió la educación en una política de modernización nacional.",
    },
    diploma: {
      title: "Diploma de maestro normal",
      body: "El diploma certificaba saber pedagógico, pertenencia profesional y legitimidad estatal. También marcaba una identidad docente asociada a disciplina, moralidad pública y servicio a la Nación.",
      note: "Permite observar la profesionalización docente y el modo en que el normalismo construyó autoridad escolar.",
    },
    aula: {
      title: "Aula tradicional",
      body: "El aula ordenaba tiempos, cuerpos, voces y jerarquías. Funcionaba como espacio de enseñanza, pero también como dispositivo de disciplina y formación de hábitos ciudadanos.",
      note: "Este objeto ayuda a leer los conflictos entre obediencia, control y educación democrática.",
    },
    guardapolvo: {
      title: "Guardapolvo blanco",
      body: "El guardapolvo se volvió un símbolo de igualdad escolar, pero también de homogeneización. Cubría diferencias sociales y culturales para presentar una imagen común de infancia escolarizada.",
      note: "Resume una tensión central: incluir a nuevos sujetos sin dejar de normalizar sus identidades.",
    },
    acto: {
      title: "Acto escolar",
      body: "El acto escolar reúne memoria histórica, símbolos patrióticos, participación comunitaria y organización institucional. Es una de las huellas más visibles del normalismo en la escuela actual.",
      note: "Muestra cómo los rituales escolares siguen produciendo sentidos sobre Nación, ciudadanía y pertenencia.",
    },
  };
  const modal = document.querySelector("[data-object-modal]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalBody = document.querySelector("[data-modal-body]");
  const modalNote = document.querySelector("[data-modal-note]");
  const modalClose = document.querySelector("[data-modal-close]");
  let lastFocusedElement = null;

  const closeObjectModal = () => {
    if (!modal) return;
    modal.hidden = true;
    body.classList.remove("modal-open");
    lastFocusedElement?.focus();
  };

  const openObjectModal = (objectId, trigger) => {
    const detail = objectDetails[objectId];
    if (!detail || !modal) return;
    lastFocusedElement = trigger;
    modalTitle.textContent = detail.title;
    modalBody.textContent = detail.body;
    modalNote.textContent = detail.note;
    modal.hidden = false;
    body.classList.add("modal-open");
    modalClose?.focus();
  };

  document.querySelectorAll("[data-object]").forEach((button) => {
    button.addEventListener("click", () => openObjectModal(button.dataset.object, button));
  });

  modalClose?.addEventListener("click", closeObjectModal);
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeObjectModal();
    }
  });

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

  // Escape cierra el menú si está abierto.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && body.classList.contains("nav-open")) {
      body.classList.remove("nav-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      menuToggle?.setAttribute("aria-label", "Abrir menú de navegación");
      menuToggle?.focus();
    } else if (event.key === "Escape" && modal && !modal.hidden) {
      closeObjectModal();
    }
  });

  updateVisitState(location.hash.replace("#", "") || "inicio");
});
