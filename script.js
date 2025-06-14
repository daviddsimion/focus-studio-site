/* script.js */
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const backToTopBtn = document.getElementById('back-to-top');

  function revealSections() {
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

  window.addEventListener('scroll', () => {
    revealSections();
    toggleBackToTop();
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  revealSections();
  toggleBackToTop();
});
