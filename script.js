document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section.reveal');
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
    // Store all gallery items, useful for filtering
    const allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));


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
            if (rect.top < window.innerHeight - 150) { 
                section.classList.add('visible');
            }
        });
    }

    // Parallax effect on gallery images (only if elements exist)
    function parallaxEffect() {
        if (galleryImages.length > 0) {
            galleryImages.forEach(img => {
                const speed = 0.1; // Reduced speed for subtlety
                const rect = img.getBoundingClientRect();
                const viewportMiddle = window.innerHeight / 2;
                const imageMiddle = rect.top + rect.height / 2;
                const offset = (viewportMiddle - imageMiddle) * speed;

                // Apply parallax only if image is within a reasonable distance of viewport
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    img.style.transform = `translateY(${offset}px) scale(1)`;
                } else {
                    img.style.transform = 'translateY(0) scale(1)'; // Reset when out of view
                }
            });
        }
    }

    // Show/hide back-to-top button
    function toggleBackToTop() {
        if (window.scrollY > 400) { 
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Lightbox Functions
    function openLightbox(index) {
        // Ensure we only open if the image is currently visible (for filtering)
        const visibleImages = allGalleryItems.filter(item => item.classList.contains('visible-filtered') || !item.classList.contains('hidden'));
        if (visibleImages.length === 0) return; // No visible images to open

        currentImageIndex = visibleImages.indexOf(galleryImages[index]); // Get index within visible images
        if (currentImageIndex === -1) { // If original index is hidden, find first visible
            currentImageIndex = 0;
        }

        const imageToLoad = visibleImages[currentImageIndex];
        lightboxImage.src = imageToLoad.dataset.fullSrc || imageToLoad.src;
        lightboxCaption.textContent = imageToLoad.alt;
        
        lightboxOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Disable page scroll
    }

    function closeLightbox() {
        lightboxOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable page scroll
    }

    function navigateLightbox(direction) {
        const visibleImages = allGalleryItems.filter(item => item.classList.contains('visible-filtered') || !item.classList.contains('hidden'));
        if (visibleImages.length === 0) return;

        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = visibleImages.length - 1;
        } else if (currentImageIndex >= visibleImages.length) {
            currentImageIndex = 0;
        }
        
        const imageToLoad = visibleImages[currentImageIndex];
        lightboxImage.src = imageToLoad.dataset.fullSrc || imageToLoad.src;
        lightboxCaption.textContent = imageToLoad.alt;
    }

    // Portfolio Filtering (only on portfolio.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) { // Check if we are on portfolio page
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.dataset.filter;

                allGalleryItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.classList.remove('hidden');
                        item.classList.add('visible-filtered'); // Add a class for visible items
                    } else {
                        item.classList.add('hidden');
                        item.classList.remove('visible-filtered');
                    }
                });
            });
        });

        // Initialize filtering: show all items by default and mark them as visible
        allGalleryItems.forEach(item => {
            item.classList.add('visible-filtered');
        });
    }

    // Set current year in footer
    const currentYearElements = document.querySelectorAll('[id^="current-year"]');
    if (currentYearElements.length > 0) {
        const year = new Date().getFullYear();
        currentYearElements.forEach(el => el.textContent = year);
    }


    // --- Event Listeners ---

    // Smooth scroll for nav links (active page logic)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default only if it's an anchor to a section on the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            }
            // Logic to set active class for current page
            document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Set active class on nav link based on current page load
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });


    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Add click listener for gallery images to open lightbox
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxOverlay) { // Check if lightbox elements exist
        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
        lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

        // Close lightbox on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('show')) {
                closeLightbox();
            }
        });
    }
    
    // Initial calls for elements visible on load
    revealOnScroll();
    // Parallax might need a slight delay or be called after images load for best effect
    // parallaxEffect(); 
    toggleBackToTop();

    // Throttled scroll event listener
    window.addEventListener('scroll', throttle(() => {
        revealOnScroll();
        parallaxEffect(); // Call parallax on scroll
        toggleBackToTop();
    }, 100)); // Limit events to every 100ms
});
