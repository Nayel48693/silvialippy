const WEB3FORMS_ACCESS_KEY = "COLOCAR_ACCESS_KEY_AQUI";
const SITE_CONFIG = { mostrarTestemunhos: false, mostrarAgenda: false };
const GALERIA = [
  { ficheiro: "silvia1", tipo: "imagem", legenda: "Momento musical 1", alt: "Silvia Lippy, momento musical 1" },
  { ficheiro: "silvia2", tipo: "video", legenda: "Vídeo de Silvia Lippy", alt: "Vídeo de Silvia Lippy" },
  { ficheiro: "silvia3", tipo: "imagem", legenda: "Momento musical 3", alt: "Silvia Lippy, momento musical 3" },
  { ficheiro: "silvia4", tipo: "imagem", legenda: "Momento musical 4", alt: "Silvia Lippy, momento musical 4" },
  { ficheiro: "silvia5", tipo: "imagem", legenda: "Momento musical 5", alt: "Silvia Lippy, momento musical 5" },
  { ficheiro: "silvia6", tipo: "imagem", legenda: "Momento musical 6", alt: "Silvia Lippy, momento musical 6" }
];
const AGENDA_EVENTOS = [
  {
    data: "2026-11-21T20:00:00+00:00",
    dataLegivel: "21 de novembro de 2026 · 20h00",
    local: "Auditório — Barreiro",
    descricao: "Uma noite de canções e partilha musical. Evento fictício, a confirmar."
  },
  {
    data: "2026-12-12T16:00:00+00:00",
    dataLegivel: "12 de dezembro de 2026 · 16h00",
    local: "Espaço Cultural — Barreiro",
    descricao: "Encontro intimista com música ao vivo e convidados. Evento fictício, a confirmar."
  }
];

document.documentElement.classList.add("js");

document.querySelectorAll('[data-feature="testemunhos"]').forEach((element) => {
  (element.closest("li") || element).hidden = !SITE_CONFIG.mostrarTestemunhos;
});
document.querySelectorAll('[data-feature="agenda"]').forEach((element) => {
  (element.closest("li") || element).hidden = !SITE_CONFIG.mostrarAgenda;
});

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 24);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    navLinks.classList.toggle("is-open", !isOpen);
    header.classList.toggle("menu-open", !isOpen);
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menu");
      navLinks.classList.remove("is-open");
      header.classList.remove("menu-open");
    }
  });
}

const revealElements = document.querySelectorAll(".reveal");
let revealObserver = null;
if ("IntersectionObserver" in window) {
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const agendaSection = document.querySelector("#agenda");
const agendaEvents = document.querySelector("#agenda-events");
if (agendaSection && agendaEvents) {
  const agendaEmpty = document.querySelector("#agenda-empty");
  if (!SITE_CONFIG.mostrarAgenda || AGENDA_EVENTOS.length === 0) {
    if (agendaEmpty) agendaEmpty.hidden = false;
    agendaEvents.hidden = true;
  } else {
    if (agendaEmpty) agendaEmpty.hidden = true;
    agendaEvents.hidden = false;
    AGENDA_EVENTOS.forEach((event) => {
      const card = document.createElement("article");
      card.className = "event-card reveal";

      const date = document.createElement("time");
      date.className = "event-date";
      date.dateTime = event.data;
      date.textContent = event.dataLegivel;

      const location = document.createElement("p");
      location.className = "event-location";
      location.textContent = event.local;

      const description = document.createElement("p");
      description.className = "event-description";
      description.textContent = event.descricao;

      card.append(date, location, description);
      agendaEvents.append(card);
      if ("IntersectionObserver" in window && typeof revealObserver !== "undefined" && revealObserver) {
        revealObserver.observe(card);
      } else {
        card.classList.add("is-visible");
      }
    });
    agendaSection.hidden = false;
  }
}

const galleryLightbox = document.querySelector("#gallery-lightbox");
const galleryGrid = document.querySelector(".gallery-grid");
const galleryEmpty = document.querySelector("#gallery-empty");
if (galleryGrid && galleryEmpty) {
  let loadedGalleryItems = 0;
  const updateGalleryEmptyState = () => {
    galleryEmpty.hidden = loadedGalleryItems > 0;
  };

  GALERIA.forEach((entry) => {
    const item = document.createElement("button");
    item.className = `gallery-item${entry.tipo === "video" ? " gallery-video" : ""} reveal`;
    item.type = "button";
    item.dataset.type = entry.tipo;
    item.dataset.caption = entry.legenda;
    item.setAttribute("aria-label", `${entry.tipo === "video" ? "Reproduzir vídeo" : "Ampliar imagem da galeria"}: ${entry.legenda}`);

    if (entry.tipo === "video") {
      item.dataset.video = `assets/galeria/${entry.ficheiro}.mp4`;
      const thumbnail = document.createElement("video");
      thumbnail.muted = true;
      thumbnail.playsInline = true;
      thumbnail.preload = "metadata";
      thumbnail.src = `${item.dataset.video}#t=0.5`;
      thumbnail.addEventListener("loadedmetadata", () => {
        loadedGalleryItems += 1;
        updateGalleryEmptyState();
      }, { once: true });
      thumbnail.addEventListener("error", () => {
        item.remove();
        updateGalleryEmptyState();
      }, { once: true });

      const playIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      playIcon.setAttribute("viewBox", "0 0 64 64");
      playIcon.setAttribute("aria-hidden", "true");
      playIcon.classList.add("gallery-play-icon");
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "32");
      circle.setAttribute("cy", "32");
      circle.setAttribute("r", "30");
      const triangle = document.createElementNS("http://www.w3.org/2000/svg", "path");
      triangle.setAttribute("d", "M26 19v26l21-13z");
      playIcon.append(circle, triangle);
      item.append(thumbnail, playIcon);
    } else {
      const img = document.createElement("img");
      img.alt = entry.alt;
      img.loading = "lazy";
      let extensionIndex = 0;
      const extensions = ["jpg", "jpeg", "png", "webp"];
      const loadGalleryImage = () => {
        item.dataset.image = `assets/galeria/${entry.ficheiro}.${extensions[extensionIndex]}`;
        img.src = item.dataset.image;
      };
      img.addEventListener("load", () => {
        loadedGalleryItems += 1;
        updateGalleryEmptyState();
      }, { once: true });
      img.addEventListener("error", () => {
        extensionIndex += 1;
        if (extensionIndex < extensions.length) {
          loadGalleryImage();
          return;
        }
        item.remove();
        updateGalleryEmptyState();
      });
      item.append(img);
      loadGalleryImage();
    }

    galleryGrid.append(item);
    if ("IntersectionObserver" in window && revealObserver) {
      revealObserver.observe(item);
    } else {
      item.classList.add("is-visible");
    }
  });
  galleryEmpty.hidden = true;
}

if (galleryLightbox instanceof HTMLDialogElement) {
  const lightboxImage = galleryLightbox.querySelector("img");
  const lightboxVideo = galleryLightbox.querySelector("video");
  const lightboxCaption = galleryLightbox.querySelector(".lightbox-caption");
  const closeButton = galleryLightbox.querySelector(".lightbox-close");
  let lastGalleryTrigger = null;

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      lastGalleryTrigger = item;
      lightboxCaption.textContent = item.dataset.caption || "";
      if (item.dataset.type === "video") {
        lightboxImage.hidden = true;
        lightboxVideo.hidden = false;
        lightboxVideo.src = item.dataset.video;
        lightboxVideo.load();
      } else {
        lightboxVideo.pause();
        lightboxVideo.removeAttribute("src");
        lightboxVideo.load();
        lightboxVideo.hidden = true;
        lightboxImage.hidden = false;
        lightboxImage.src = item.dataset.image;
        lightboxImage.alt = item.querySelector("img").alt;
      }
      galleryLightbox.showModal();
      if (item.dataset.type === "video") lightboxVideo.play();
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", () => galleryLightbox.close());
  galleryLightbox.addEventListener("cancel", (event) => {
    event.preventDefault();
    galleryLightbox.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && galleryLightbox.open) {
      galleryLightbox.close();
    }
  });
  galleryLightbox.addEventListener("click", (event) => {
    if (event.target === galleryLightbox) galleryLightbox.close();
  });
  galleryLightbox.addEventListener("close", () => {
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    lightboxVideo.hidden = true;
    lightboxImage.hidden = false;
    if (lastGalleryTrigger) lastGalleryTrigger.focus();
  });
}

const video = document.querySelector("#demo-video");
const videoUnavailable = document.querySelector("#video-unavailable");
const soundButton = document.querySelector("#sound-button");
const replayButton = document.querySelector("#replay-button");

if (video && videoUnavailable && soundButton && replayButton) {
  let hasAutoplayed = false;
  let videoFailed = false;
  const videoObserver = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAutoplayed && !videoFailed) {
          hasAutoplayed = true;
          video.muted = true;
          soundButton.hidden = false;
          video.play().catch(() => {
            soundButton.textContent = "Reproduzir vídeo";
          });
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      });
    }, { threshold: 0.6 })
    : null;

  if (videoObserver) videoObserver.observe(video);
  video.addEventListener("error", () => {
    videoFailed = true;
    video.hidden = true;
    soundButton.hidden = true;
    replayButton.hidden = true;
    videoUnavailable.hidden = false;
  });
  soundButton.addEventListener("click", () => {
    if (video.paused) {
      video.muted = true;
      video.play().catch(() => {
        soundButton.textContent = "Não foi possível reproduzir";
      });
      return;
    }
    video.muted = false;
    soundButton.hidden = true;
  });
  video.addEventListener("volumechange", () => {
    if (!video.muted) soundButton.hidden = true;
  });
  video.addEventListener("ended", () => {
    soundButton.hidden = true;
    replayButton.hidden = false;
  });
  replayButton.addEventListener("click", () => {
    video.currentTime = 0;
    video.muted = false;
    replayButton.hidden = true;
    video.play().catch(() => {
      replayButton.hidden = false;
      replayButton.textContent = "Não foi possível reproduzir";
    });
  });
}

const signupForm = document.querySelector("#signup-form");
if (signupForm) {
  const formStatus = document.querySelector("#form-status");
  const submitButton = signupForm.querySelector('button[type="submit"]');
  const validationMessages = new Map([
    ["name", "Indica o teu nome."],
    ["age", "Indica uma idade entre 1 e 120 anos."],
    ["experience", "Seleciona se já tens experiência em canto."],
    ["interest", "Seleciona o tipo de interesse."],
    ["phone", "Indica um número de telefone válido."],
    ["email", "Indica um endereço de email válido."],
    ["consent", "É necessário autorizar a utilização dos dados para enviar o pedido."]
  ]);

  const interestField = signupForm.elements.namedItem("interest");
  const requestedInterest = new URLSearchParams(window.location.search).get("interesse");
  if (requestedInterest === "aula-experimental") {
    interestField.value = "Aula experimental";
  }

  signupForm.addEventListener("input", (event) => {
    if (event.target.name) event.target.setCustomValidity("");
  });
  signupForm.addEventListener("change", (event) => {
    if (event.target.name) event.target.setCustomValidity("");
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    validationMessages.forEach((message, name) => {
      const field = signupForm.elements.namedItem(name);
      let error = "";
      if (field.type === "checkbox" && !field.checked) {
        error = message;
      } else if (field.type === "number" && (!field.value || Number(field.value) < 1 || Number(field.value) > 120)) {
        error = message;
      } else if (field.type === "email" && (!field.value || !field.validity.valid)) {
        error = message;
      } else if (field.type === "tel" && !/^[+\d\s().-]{9,20}$/.test(field.value.trim())) {
        error = message;
      } else if (field.required && !field.value.trim()) {
        error = message;
      }
      field.setCustomValidity(error);
    });

    if (!signupForm.reportValidity()) {
      formStatus.classList.add("error");
      formStatus.textContent = "Por favor, verifica os campos assinalados.";
      return;
    }

    const formData = new FormData(signupForm);
    if (formData.get("botcheck")) {
      formStatus.classList.add("success");
      formStatus.textContent = "Obrigado pelo teu pedido.";
      signupForm.reset();
      return;
    }

    if (WEB3FORMS_ACCESS_KEY === "COLOCAR_ACCESS_KEY_AQUI") {
      formStatus.classList.add("error");
      formStatus.textContent = "O formulário ainda não está configurado. Escreve para silvialippy@hotmail.com.";
      return;
    }

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Novo interessado em aulas de canto — ${formData.get("name")}`,
      from_name: "Website Silvia Lippy",
      email: formData.get("email"),
      name: formData.get("name"),
      phone: formData.get("phone"),
      age: formData.get("age"),
      experience: formData.get("experience"),
      interest: formData.get("interest"),
      message: formData.get("message") || "Sem mensagem adicional",
      botcheck: formData.get("botcheck") || ""
    };

    submitButton.disabled = true;
    submitButton.textContent = "A enviar…";
    formStatus.textContent = "A enviar o teu pedido…";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Não foi possível enviar o formulário.");
      }
      signupForm.reset();
      formStatus.classList.add("success");
      formStatus.textContent = "Obrigado! O teu pedido foi enviado. Entrarei em contacto em breve.";
    } catch (error) {
      console.error("Erro ao enviar o pedido de aula:", error);
      formStatus.classList.add("error");
      formStatus.textContent = "Não foi possível enviar o pedido. Tenta novamente ou escreve para silvialippy@hotmail.com.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar pedido";
    }
  });
}
