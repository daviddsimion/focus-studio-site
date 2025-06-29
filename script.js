document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const galleryImages = document.querySelectorAll('.gallery img');
    const backToTopBtn = document.getElementById('back-to-top');

    // Lightbox elements
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close');
    const lightboxPrevBtn = document.getElementById('lightbox-prev');
    const lightboxNextBtn = document.getElementById('lightbox-next');

    let currentImageIndex = 0;

    // Utility function for throttling scroll events
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Reveal sections on scroll with fade-up effect
    function revealOnScroll() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Adjust threshold for better reveal timing
            if (rect.top < window.innerHeight - 180) { 
                section.classList.add('visible');
            }
        });
    }

    // Parallax effect on gallery images
    function parallaxEffect() {
        galleryImages.forEach(img => {
            const speed = 0.15; // Speed slightly reduced for subtlety
            const rect = img.getBoundingClientRect();
            const viewportMiddle = window.innerHeight / 2;
            const imageMiddle = rect.top + rect.height / 2;
            const offset = (viewportMiddle - imageMiddle) * speed;

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                img.style.transform = `translateY(${offset}px) scale(1)`; // Parallax vertical
            } else {
                // Reset transform when out of view to avoid odd jumps
                img.style.transform = 'translateY(0) scale(1)';
            }
        });
    }

    // Show/hide back-to-top button
    function toggleBackToTop() {
        if (window.scrollY > 400) { // Show after scrolling down more
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Open Lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        const image = galleryImages[currentImageIndex];
        lightboxImage.src = image.dataset.fullSrc || image.src; // Folosește data-full-src dacă există
        lightboxCaption.textContent = image.alt;
        lightboxOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Blochează scroll-ul paginii
    }

    // Close Lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Permite scroll-ul paginii din nou
    }

    // Navigate Lightbox
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = galleryImages.length - 1;
        } else if (currentImageIndex >= galleryImages.length) {
            currentImageIndex = 0;
        }
        openLightbox(currentImageIndex); // Reutilizează funcția openLightbox
    }

    // Event Listeners

    // Smooth scroll for nav links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add click listener for gallery images to open lightbox
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
    lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('show')) {
            closeLightbox();
        }
    });

    // Initial calls for elements visible on load
    revealOnScroll();
    parallaxEffect();
    toggleBackToTop();

    // Throttled scroll event listener
    window.addEventListener('scroll', throttle(() => {
        revealOnScroll();
        parallaxEffect();
        toggleBackToTop();
    }, 100)); // Limit events to every 100ms
});
