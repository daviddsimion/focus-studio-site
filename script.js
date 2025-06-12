document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const galleryImages = document.querySelectorAll('.gallery img');
  const backToTopBtn = document.getElementById('back-to-top');

  function revealOnScroll() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add('visible');
      }
    });
  }

  function parallaxEffect() {
    galleryImages.forEach(img => {
      const speed = 0.3;
      const rect = img.getBoundingClientRect();
      const offset = window.innerHeight - rect.top;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        img.style.transform = `translateY(${offset * speed}px) scale(1.05)`;
      } else {
        img.style.transform = 'translateY(0) scale(1)';
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
    parallaxEffect();
    toggleBackToTop();
  });

  // Initial calls
  revealOnScroll();
  toggleBackToTop();
});
