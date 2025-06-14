// Afișează secțiunile la scroll
const sections = document.querySelectorAll("section");

const appearOptions = {
  threshold: 0.1,
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
}, appearOptions);

sections.forEach(section => {
  appearOnScroll.observe(section);
});

// Scroll sus
const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
                          // Buton scroll to top
const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }

  // Animație la scroll pentru secțiuni
  document.querySelectorAll("section").forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      section.classList.add("visible");
    }
  });
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

                          );
