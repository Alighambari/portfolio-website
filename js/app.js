// Mobile hamburger menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileOverlay = document.getElementById("mobile-menu-overlay");
  const menuLinks = document.querySelectorAll(".menu-link");

  // باز و بسته کردن منو
  if (menuToggle && mobileOverlay) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      mobileOverlay.classList.toggle("open");

      // جلوگیری از اسکرول شدن صفحه وقتی منو باز است
      if (mobileOverlay.classList.contains("open")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }

  // بستن منو وقتی روی یکی از لینک‌ها کلیک می‌شود
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      mobileOverlay.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
});

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
if (scrolldown) {
  scrolldown.addEventListener("click", scrollHandler);

}

