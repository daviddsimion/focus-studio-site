document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');

  function revealOnScroll() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // rulează și la încărcare
});
