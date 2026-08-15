const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;
const header = document.querySelector("[data-header]");
const progressBar = document.querySelector(".scroll-progress span");
const heroMedia = document.querySelector(".hero__media");
const buildWorld = document.querySelector(".build-world");
const processSteps = [...document.querySelectorAll("[data-step]")];
const processRail = [...document.querySelectorAll(".process-rail span")];
const blueprints = [...document.querySelectorAll("[data-blueprint]")];
const sequenceLabel = document.querySelector("[data-sequence]");
const buildFilm = document.querySelector("#build-film");
const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const marqueeTrack = document.querySelector("[data-marquee-track]");
const projectCards = [...document.querySelectorAll(".project-card")];
const projectImages = [...document.querySelectorAll(".project-card img")];
const pageWipe = document.querySelector(".page-wipe");
const currentLanguage = document.documentElement.lang.startsWith("en") ? "en" : "sq";
const formCopy = {
  sq: {
    invalid: "Kontrolloni fushat e shënuara dhe provoni përsëri.",
    ready: "Kërkesa është gati — po hapim aplikacionin tuaj të emailit.",
    subject: "Kërkesë e re",
    name: "Emri / Kompania",
    contact: "Kontakti",
    service: "Fusha",
    description: "Përshkrimi",
    empty: "Nuk është dhënë përshkrim."
  },
  en: {
    invalid: "Please check the highlighted fields and try again.",
    ready: "Your enquiry is ready — opening your email application.",
    subject: "New project enquiry",
    name: "Name / Company",
    contact: "Contact",
    service: "Project type",
    description: "Description",
    empty: "No description was provided."
  }
};

let ticking = false;
let lastScrollY = 0;
let currentStage = 0;

body.classList.add("is-loading");

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function buildSeamlessMarquee() {
  if (!marqueeTrack) return;
  const primaryGroup = marqueeTrack.querySelector("[data-marquee-group]");
  const duplicateGroup = marqueeTrack.querySelector(".ticker__group[aria-hidden]");
  if (!primaryGroup || !duplicateGroup) return;

  if (!primaryGroup.dataset.template) primaryGroup.dataset.template = primaryGroup.innerHTML.trim();
  primaryGroup.innerHTML = primaryGroup.dataset.template;
  const seed = [...primaryGroup.children].map((node) => node.cloneNode(true));
  primaryGroup.replaceChildren(...seed.map((node) => node.cloneNode(true)));
  const targetWidth = window.innerWidth + 320;
  let safety = 0;

  while (primaryGroup.scrollWidth < targetWidth && safety < 20) {
    seed.forEach((node) => primaryGroup.append(node.cloneNode(true)));
    safety += 1;
  }

  duplicateGroup.replaceChildren(...[...primaryGroup.children].map((node) => node.cloneNode(true)));
  const distance = primaryGroup.scrollWidth;
  marqueeTrack.style.setProperty("--marquee-distance", `${distance}px`);
  marqueeTrack.style.setProperty("--marquee-duration", `${Math.max(18, distance / 82).toFixed(2)}s`);
}

requestAnimationFrame(buildSeamlessMarquee);

let marqueeResizeTimer;
window.addEventListener("resize", () => {
  window.clearTimeout(marqueeResizeTimer);
  marqueeResizeTimer = window.setTimeout(buildSeamlessMarquee, 180);
});

if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;
      card.style.setProperty("--spot-x", `${x.toFixed(1)}%`);
      card.style.setProperty("--spot-y", `${y.toFixed(1)}%`);
    });
  });

  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = clamp((event.clientX - bounds.left) / bounds.width);
      const y = clamp((event.clientY - bounds.top) / bounds.height);
      card.style.setProperty("--card-x", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--card-y", `${(y * 100).toFixed(1)}%`);
      card.style.setProperty("--card-rx", `${((.5 - y) * 3).toFixed(2)}deg`);
      card.style.setProperty("--card-ry", `${((x - .5) * 3).toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--card-rx", "0deg");
      card.style.setProperty("--card-ry", "0deg");
    });
  });
}

function finishLoader() {
  const loader = document.querySelector(".loader");
  if (!loader || loader.classList.contains("is-done")) return;
  loader.classList.add("is-done");
  body.classList.remove("is-loading");
  document.querySelectorAll(".hero .reveal-up").forEach((element, index) => {
    window.setTimeout(() => element.classList.add("is-visible"), 120 + index * 100);
  });
}

window.addEventListener("load", () => window.setTimeout(finishLoader, reduceMotion ? 0 : 900), { once: true });
window.setTimeout(finishLoader, 2400);

function setStage(stage) {
  if (stage === currentStage && processSteps[stage]?.classList.contains("is-active")) return;
  currentStage = stage;

  processSteps.forEach((step, index) => step.classList.toggle("is-active", index === stage));
  blueprints.forEach((blueprint, index) => blueprint.classList.toggle("is-visible", index === stage));
  processRail.forEach((item, index) => {
    item.classList.toggle("is-active", index === stage);
    item.classList.toggle("is-past", index < stage);
  });

  if (sequenceLabel) sequenceLabel.textContent = String(stage + 1).padStart(2, "0");
}

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = documentHeight > 0 ? scrollY / documentHeight : 0;

  if (progressBar) progressBar.style.transform = `scaleX(${clamp(pageProgress)})`;

  if (header) {
    header.classList.toggle("is-scrolled", scrollY > 40);
    const movingDown = scrollY > lastScrollY && scrollY > 400;
    header.classList.toggle("is-hidden", movingDown && !body.classList.contains("menu-open"));
  }

  if (heroMedia && !reduceMotion && scrollY < window.innerHeight * 1.2) {
    heroMedia.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0) scale(1.04)`;
  }

  if (!reduceMotion) {
    projectImages.forEach((image) => {
      const frame = image.parentElement.getBoundingClientRect();
      if (frame.bottom < -80 || frame.top > window.innerHeight + 80) return;
      const centerOffset = window.innerHeight / 2 - (frame.top + frame.height / 2);
      image.style.setProperty("--project-shift", `${clamp(centerOffset * .045, -20, 20).toFixed(2)}px`);
    });
  }

  if (buildWorld) {
    const bounds = buildWorld.getBoundingClientRect();
    const distance = buildWorld.offsetHeight - window.innerHeight;
    const processProgress = clamp(-bounds.top / Math.max(distance, 1));
    const stage = Math.min(3, Math.floor(processProgress * 4));
    setStage(stage);

    if (buildFilm?.duration && Number.isFinite(buildFilm.duration) && buildFilm.readyState >= 2) {
      const targetTime = processProgress * Math.max(buildFilm.duration - 0.05, 0);
      if (Math.abs(buildFilm.currentTime - targetTime) > 0.04) buildFilm.currentTime = targetTime;
    }
  }

  lastScrollY = scrollY;
  ticking = false;
}

function requestScrollUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollEffects);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollEffects();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8%" });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll("main section[id]")];
const desktopLinks = [...document.querySelectorAll(".desktop-nav a")];
const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  desktopLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
  });
}, { rootMargin: "-30% 0px -55%", threshold: [0, .1, .25, .5] });

sections.forEach((section) => sectionObserver.observe(section));

function setMenu(open) {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Mbyll menunë" : "Hap menunë");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  mobileMenu.classList.toggle("is-open", open);
  body.classList.toggle("menu-open", open);
  header?.classList.remove("is-hidden");

  if (open) {
    window.setTimeout(() => mobileMenu.querySelector("a")?.focus(), 500);
  } else {
    menuButton.focus({ preventScroll: true });
  }
}

menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

document.querySelectorAll(".lang-switch a, .mobile-languages a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = new URL(link.href, window.location.href);
    if (target.pathname === window.location.pathname) {
      event.preventDefault();
      return;
    }
    if (reduceMotion || !pageWipe) return;
    event.preventDefault();
    pageWipe.classList.add("is-active");
    window.setTimeout(() => window.location.assign(target.href), 650);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && body.classList.contains("menu-open")) setMenu(false);

  if (event.key === "Tab" && body.classList.contains("menu-open")) {
    const focusable = [menuButton, ...mobileMenu.querySelectorAll("a")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

document.querySelectorAll("[data-accordion] .accordion__item").forEach((item) => {
  const button = item.querySelector("button");
  const symbol = button.querySelector("i");
  button.addEventListener("click", () => {
    const accordion = item.parentElement;
    const willOpen = !item.classList.contains("is-open");

    accordion.querySelectorAll(".accordion__item").forEach((other) => {
      other.classList.remove("is-open");
      other.querySelector("button").setAttribute("aria-expanded", "false");
      other.querySelector("button i").textContent = "+";
    });

    if (willOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      symbol.textContent = "−";
    }
  });
});

const form = document.querySelector("[data-contact-form]");

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const copy = formCopy[currentLanguage];
  const requiredFields = [...form.querySelectorAll("[required]")];
  let valid = true;

  requiredFields.forEach((field) => {
    const fieldValid = Boolean(field.value.trim());
    field.closest("label").classList.toggle("is-invalid", !fieldValid);
    if (!fieldValid) valid = false;
  });

  const status = form.querySelector(".form-status");
  if (!valid) {
    status.textContent = copy.invalid;
    form.querySelector(".is-invalid input, .is-invalid select")?.focus();
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(`${copy.subject} — ${data.get("service")}`);
  const message = encodeURIComponent(
    `${copy.name}: ${data.get("name")}\n` +
    `${copy.contact}: ${data.get("contact")}\n` +
    `${copy.service}: ${data.get("service")}\n\n` +
    `${copy.description}:\n${data.get("message") || copy.empty}`
  );

  status.textContent = copy.ready;
  window.setTimeout(() => {
    window.location.href = `mailto:info@auremont.al?subject=${subject}&body=${message}`;
  }, 250);
});

form?.querySelectorAll("input, select").forEach((field) => {
  const clearFieldError = () => {
    if (field.value.trim()) field.closest("label").classList.remove("is-invalid");
  };
  field.addEventListener("input", clearFieldError);
  field.addEventListener("change", clearFieldError);
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();

window.addEventListener("pageshow", (event) => {
  pageWipe?.classList.remove("is-active");
  if (event.persisted) finishLoader();
});
