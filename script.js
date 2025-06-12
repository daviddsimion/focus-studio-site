document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const galleryImages = document.querySelectorAll('.gallery img');
  const backToTopBtn = document.getElementById('back-to-top');

  // Reveal sections on scroll (fade-in + slide-up)
  function revealOnScroll() {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.add('visible');
      }
    });
  }

  // Parallax effect pe imagini portofoliu
  function parallaxEffect() {
    galleryImages.forEach(img => {
      const speed = 0.25;
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = window.innerHeight - rect.top;
        img.style.transform = `translateY(${offset * speed}px) scale(1.05)`;
      } else {
        img.style.transform = 'translateY(0) scale(1)';
      }
    });
  }

  // Afișare / ascundere buton back-to-top
  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  // Scroll sus când dai click pe buton
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Debounce scroll event cu requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        revealOnScroll();
        parallaxEffect();
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Apel inițial la încărcare pagină
  revealOnScroll();
  parallaxEffect();
  toggleBackToTop();
});
