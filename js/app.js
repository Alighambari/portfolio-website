// Mobile hamburger menu toggle
(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");

  if (!menuToggle || !mobileNav) return;

  function closeMenu() {
    menuToggle.classList.remove("active");
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = mobileNav.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  }

  menuToggle.addEventListener("click", toggleMenu);

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", function (e) {
    if (!mobileNav.classList.contains("open")) return;
    if (mobileNav.contains(e.target) || menuToggle.contains(e.target)) return;
    closeMenu();
  });
})();

const scrolldown = document.querySelector("#gotoQualification");

function scrollHandler(event) {
  event.preventDefault();

  const target = document.querySelector("#qualification");

  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

scrolldown.addEventListener("click", scrollHandler);
