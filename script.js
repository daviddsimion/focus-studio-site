document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const galleryImages = document.querySelectorAll('.gallery img');
  const backToTopBtn = document.getElementById('back-to-top');

  // Reveal sections on scroll with fade-up effect
  function revealOnScroll() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 150) {
        section.classList.add('visible');
      }
    });
  }

  // Parallax effect on gallery images
  function parallaxEffect() {
    galleryImages.forEach(img => {
      const speed = 0.25;
      const rect = img.getBoundingClientRect();
      const offset = window.innerHeight - rect.top;
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        img.style.transform = `translateY(${offset * speed}px) scale(1.05)`;
      } else {
        img.style.transform = 'translateY(0) scale(1)';
      }
    });
  }

  // Show/hide back-to-top button
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
  parallaxEffect();
  toggleBackToTop();
});
