const root = document.documentElement;
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const revealElements = document.querySelectorAll("[data-reveal]");
const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
    revealObserver.observe(element);
  });

} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const setActiveNav = (sectionId) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.hash === "#" + sectionId);
  });
};

const closeMenu = () => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    closeMenu();

    if (link.hash !== "#home") return;
    event.preventDefault();
    history.replaceState(null, "", "#home");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveNav("home");
  });
});

const updateScroll = () => {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

  root.style.setProperty("--page-progress", progress.toFixed(4));
  const heroCoverProgress = Math.min(1, window.scrollY / Math.max(1, window.innerHeight * 0.9));
  const maxHeroLift = window.innerWidth <= 620 ? 44 : window.innerWidth <= 960 ? 72 : 140;

  root.style.setProperty(
    "--hero-parallax",
    Math.min(1, window.scrollY / Math.max(1, window.innerHeight)).toFixed(4)
  );
  root.style.setProperty("--hero-stage-shift", String(-(heroCoverProgress * maxHeroLift).toFixed(2)) + "px");
  const headerOffset = (header?.offsetHeight || 0) + 84;
  const activeSection = window.scrollY < window.innerHeight * 0.68
    ? "home"
    : sections.reduce((current, section) => (section.offsetTop <= window.scrollY + headerOffset ? section.id : current), "home");

  setActiveNav(activeSection);
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

updateScroll();
window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("resize", () => {
  updateScroll();
  if (window.innerWidth > 960) closeMenu();
});
