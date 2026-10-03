document.documentElement.classList.add("js-enabled");

// 1. Dark / light mode
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const themeLabel = themeToggle?.querySelector(".theme-label");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  if (themeIcon) themeIcon.textContent = isDark ? "☀" : "☾";
  if (themeLabel) themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
}

const savedTheme = localStorage.getItem("bumi-theme");
if (savedTheme === "dark" || savedTheme === "light") applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("bumi-theme", next);
  });
}

// 2. Tombol demonstrasi JavaScript
const helloButton = document.querySelector("#hello-button");
const interactionMessage = document.querySelector("#interaction-message");
let helloCount = 0;

helloButton?.addEventListener("click", () => {
  helloCount += 1;
  const messages = [
    "JavaScript menerima klik kamu dan mengubah teks ini.",
    "Klik kedua: satu tombol bisa menghasilkan respons yang berbeda.",
    "Sekarang coba Dark mode, filter project, atau buka detail project."
  ];
  if (interactionMessage) {
    interactionMessage.textContent = messages[Math.min(helloCount - 1, messages.length - 1)];
  }
});

// 3. Mobile menu
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "Tutup" : "Menu";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "Menu";
    });
  });
}

// 4. Expand / collapse About
const aboutToggle = document.querySelector("#about-toggle");
const aboutExtra = document.querySelector("#about-extra");

aboutToggle?.addEventListener("click", () => {
  const isOpen = aboutExtra?.classList.toggle("is-open") ?? false;
  aboutToggle.setAttribute("aria-expanded", String(isOpen));
  aboutToggle.textContent = isOpen ? "Tutup cerita ↑" : "Lihat cerita lengkap ↓";
});

// 5. Filter project
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const filterFeedback = document.querySelector("#filter-feedback");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    let visibleCount = 0;
    projectCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    if (filterFeedback) {
      const label = filter === "all" ? "semua kategori" : filter;
      filterFeedback.textContent = `Menampilkan ${visibleCount} project untuk ${label}.`;
    }
  });
});

// 6. Modal detail project
const modal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalType = document.querySelector("#modal-type");
const modalDescription = document.querySelector("#modal-description");
const modalMeta = document.querySelector("#modal-meta");
const modalCloseTargets = document.querySelectorAll("[data-close-modal]");
let lastFocusedElement = null;

const projectData = {
  portfolio: {
    type: "Website",
    title: "Bumi Aksara Portfolio",
    description: "Website portfolio personal yang menyatukan profil, pengalaman, layanan, dan project dalam satu halaman yang responsif.",
    meta: "Peran: struktur konten, desain, dan implementasi frontend."
  },
  campaign: {
    type: "Marketing",
    title: "Campaign Planning",
    description: "Contoh perencanaan campaign yang dimulai dari objective, audience, pesan, channel, hingga indikator evaluasi.",
    meta: "Fokus: struktur berpikir dan eksekusi campaign."
  },
  landing: {
    type: "Website",
    title: "Small Business Landing Page",
    description: "Landing page sederhana yang membantu bisnis memperkenalkan layanan, manfaat utama, dan kanal kontak dengan lebih jelas.",
    meta: "Fokus: clarity, responsive layout, dan CTA."
  },
  report: {
    type: "Marketing",
    title: "Performance Report",
    description: "Contoh dashboard ringkas untuk menyederhanakan data performa menjadi insight yang lebih mudah dibaca.",
    meta: "Fokus: monitoring, insight, dan next action."
  }
};

function openModal(key, trigger) {
  const data = projectData[key];
  if (!modal || !data) return;

  lastFocusedElement = trigger;
  if (modalType) modalType.textContent = data.type;
  if (modalTitle) modalTitle.textContent = data.title;
  if (modalDescription) modalDescription.textContent = data.description;
  if (modalMeta) modalMeta.textContent = data.meta;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modal.querySelector(".modal-close")?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

document.querySelectorAll(".project-detail").forEach((button) => {
  button.addEventListener("click", () => openModal(button.dataset.project, button));
});
modalCloseTargets.forEach((target) => target.addEventListener("click", closeModal));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
});

// 7. Scroll progress + back to top
const scrollProgressBar = document.querySelector("#scroll-progress-bar");
const backToTop = document.querySelector("#back-to-top");

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
  backToTop?.classList.toggle("is-visible", scrollTop > 500);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// 8. Active navigation berdasarkan section yang sedang dibaca
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const currentId = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
}

// 9. Reveal cards saat masuk viewport
const revealCards = document.querySelectorAll(".reveal-card");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  revealCards.forEach((card) => revealObserver.observe(card));
} else {
  revealCards.forEach((card) => card.classList.add("is-visible"));
}

// 10. Animasi angka statistik
const statNumbers = document.querySelectorAll(".stat-number");
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) return;
  statsAnimated = true;

  statNumbers.forEach((number) => {
    const target = Number(number.dataset.target || 0);
    const duration = 700;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      number.textContent = String(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    }

    number.textContent = "0";
    requestAnimationFrame(tick);
  });
}

const statsSection = document.querySelector(".stats-section");
if (statsSection && "IntersectionObserver" in window) {
  const statsObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      animateStats();
      observer.disconnect();
    }
  }, { threshold: 0.35 });
  statsObserver.observe(statsSection);
}
