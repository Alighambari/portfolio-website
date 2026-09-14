const themeToggle = document.querySelector(".theme-toggle");

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle("light", isLight);

  themeToggle.classList.toggle("light", isLight);
}

function getTheme() {
  return localStorage.getItem("theme") || "dark";
}

let theme = getTheme();

applyTheme(theme);

themeToggle.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";

  localStorage.setItem("theme", theme);

  applyTheme(theme);
});
