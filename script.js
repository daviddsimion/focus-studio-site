document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const backToTopBtn = document.getElementById('back-to-top');

  function revealOnScroll() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add('visible');
      }
    });
  }

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    revealOnScroll();
    toggleBackToTop();
  });

  // Call on load
  revealOnScroll();
  toggleBackToTop();
});
