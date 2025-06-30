document.addEventListener('DOMContentLoaded', () => {
    // --- Selectoare Generale ---
    const sections = document.querySelectorAll('section.reveal');
    const backToTopBtn = document.getElementById('back-to-top');
    const currentYearElements = document.querySelectorAll('[id^="current-year"]');
    const navLinks = document.querySelectorAll('nav a');

    // --- Funcționalități Generale ---

    /**
     * Activează animația de "reveal" pentru secțiuni la scroll.
     */
    function revealOnScroll() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            // Adaugă clasa 'visible' dacă secțiunea este suficient de vizibilă
            if (rect.top < window.innerHeight - 150) {
                section.classList.add('visible');
            } else {
                // Opțional: scoate clasa 'visible' dacă secțiunea iese din viewport
                // section.classList.remove('visible');
            }
        });
    }

    /**
     * Afișează/ascunde butonul "Back to Top" în funcție de poziția scroll-ului.
     */
    function toggleBackToTop() {
        if (backToTopBtn) {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    /**
     * Setează anul curent în elementele cu ID-uri care încep cu "current-year".
     */
    function setCurrentYear() {
        if (currentYearElements.length > 0) {
            const year = new Date().getFullYear();
            currentYearElements.forEach(el => el.textContent = year);
        }
    }

    /**
     * Setează clasa 'active' pentru link-ul de navigație al paginii curente.
     */
    function setActiveNavLink() {
        const path = window.location.pathname.split('/').pop();
        navLinks.forEach(link => {
            // Logica pentru index.html și celelalte pagini
            if (link.getAttribute('href') === path || (path === '' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- Funcționalități specifice paginii de Portofoliu (Lightbox și Filtrare) ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close');
    const lightboxPrevBtn = document.getElementById('lightbox-prev');
    const lightboxNextBtn = document.getElementById('lightbox-next');

    let currentImageIndex = 0;
    let filteredImages = []; // Array pentru imaginile filtrate

    /**
     * Deschide lightbox-ul cu imaginea selectată.
     * @param {number} initialIndex Indexul imaginii în array-ul 'galleryItems'.
     */
    function openLightbox(initialIndex) {
        // Actualizează imaginile filtrate, excluzând cele ascunse prin filtrare
        filteredImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));

        // Găsește indexul corect al imaginii curente în array-ul 'filteredImages'
        const clickedItem = galleryItems[initialIndex];
        currentImageIndex = filteredImages.indexOf(clickedItem);

        if (filteredImages.length > 0 && currentImageIndex !== -1) {
            lightboxImage.src = filteredImages[currentImageIndex].src;
            lightboxCaption.textContent = filteredImages[currentImageIndex].dataset.caption || '';
            lightboxOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Blochează scroll-ul paginii
        } else {
            console.warn("Nu s-au găsit imagini de afișat în lightbox sau imaginea nu este vizibilă.");
        }
    }

    /**
     * Închide lightbox-ul.
     */
    function closeLightbox() {
        lightboxOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Permite scroll-ul din nou
    }

    /**
     * Navighează la imaginea anterioară/următoare în lightbox.
     * @param {number} direction -1 pentru anterior, 1 pentru următor.
     */
    function navigateLightbox(direction) {
        if (filteredImages.length === 0) return; // Nu naviga dacă nu sunt imagini

        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = filteredImages.length - 1;
        } else if (currentImageIndex >= filteredImages.length) {
            currentImageIndex = 0;
        }
        lightboxImage.src = filteredImages[currentImageIndex].src;
        lightboxCaption.textContent = filteredImages[currentImageIndex].dataset.caption || '';
    }

    /**
     * Filtrează imaginile din galerie în funcție de categorie.
     * @param {string} category Categoria după care se filtrează ('all' sau o categorie specifică).
     */
    function filterGallery(category) {
        galleryItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                // Afișează elementul
                item.classList.remove('hidden');
                item.style.display = 'block';
                item.style.order = 1; // Asigură ordonarea corectă după filtrare
            } else {
                // Ascunde elementul
                item.classList.add('hidden');
                // Adaugă un delay mic înainte de a seta display: none pentru animație
                setTimeout(() => {
                    item.style.display = 'none';
                }, 500); // Trebuie să fie egal sau mai mare decât transition-duration din CSS
            }
        });
    }

    // --- Carusel Testimoniale (Implementare completă) ---
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const carouselNavContainer = document.querySelector('.carousel-nav'); // Containerul butoanelor
    const prevTestimonialBtn = document.getElementById('prev-testimonial');
    const nextTestimonialBtn = document.getElementById('next-testimonial');
    const testimonialDotsContainer = document.querySelector('.testimonial-dots');

    let currentTestimonialIndex = 0;

    /**
     * Afișează testimonialul la indexul specificat.
     * Rulează doar dacă există elemente pentru carusel.
     */
    function showTestimonial(index) {
        if (!testimonialCarousel || testimonialItems.length === 0) return;

        // Reset all items' display to ensure proper calculation before setting transform
        testimonialItems.forEach(item => {
            item.style.display = 'block'; // Make sure they are part of layout for width calculation
            item.style.transform = `translateX(-${index * 100}%)`;
        });

        currentTestimonialIndex = index;
        updateTestimonialDots();
    }

    /**
     * Navighează la testimonialul anterior/următor.
     * @param {number} direction -1 pentru anterior, 1 pentru următor.
     */
    function navigateTestimonial(direction) {
        let newIndex = currentTestimonialIndex + direction;
        if (newIndex < 0) {
            newIndex = testimonialItems.length - 1;
        } else if (newIndex >= testimonialItems.length) {
            newIndex = 0;
        }
        showTestimonial(newIndex);
    }

    /**
     * Creează și actualizează punctele de navigare pentru carusel.
     */
    function createTestimonialDots() {
        if (testimonialDotsContainer && testimonialItems.length > 0) {
            testimonialDotsContainer.innerHTML = ''; // Curăță punctele existente
            testimonialItems.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('testimonial-dot');
                if (index === currentTestimonialIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => showTestimonial(index));
                testimonialDotsContainer.appendChild(dot);
            });
        }
    }

    /**
     * Actualizează starea activă a punctelor de navigare.
     */
    function updateTestimonialDots() {
        if (testimonialDotsContainer) {
            testimonialDotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
                if (index === currentTestimonialIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }


    // --- Funcție utilitară pentru a "throtla" evenimentele (limitează numărul de apeluri) ---
    /**
     * Limitează frecvența de execuție a unei funcții.
     * @param {Function} func Funcția de throtlat.
     * @param {number} limit Timpul minim (ms) între apeluri.
     * @returns {Function} Funcția throtlată.
     */
    function throttle(func, limit) {
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
    }

    // --- Inițializare și Event Listeners Globale ---

    // Rulează funcțiile o dată la încărcarea paginii
    revealOnScroll();
    toggleBackToTop();
    setCurrentYear();
    setActiveNavLink(); // Setează link-ul activ la încărcare

    // Event listener pentru scroll (throtlat pentru performanță)
    window.addEventListener('scroll', throttle(() => {
        revealOnScroll();
        toggleBackToTop();
    }, 100));

    // Event listener pentru butonul "Back to Top"
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Lightbox Event Listeners (numai dacă ești pe pagina de portofoliu) ---
    if (lightboxOverlay && galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
        if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
        if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

        // Închide Lightbox la apăsarea tastei ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('show')) {
                closeLightbox();
            }
        });

        // Închide Lightbox la click în afara imaginii
        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                closeLightbox();
            }
        });
    }

    // --- Filtrare Portofoliu Event Listeners (numai dacă ești pe pagina de portofoliu) ---
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Elimină clasa 'active' de la toate butoanele
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Adaugă clasa 'active' butonului curent
                button.classList.add('active');

                const filterCategory = button.dataset.filter;
                filterGallery(filterCategory);
            });
        });
        // Inițial, afișează toate imaginile
        filterGallery('all');
    }

    // --- Carusel Testimoniale Event Listeners (numai dacă există elemente de carusel) ---
    if (testimonialCarousel && testimonialItems.length > 0) {
        // Asigură-te că butoanele de navigare există
        if (prevTestimonialBtn) prevTestimonialBtn.addEventListener('click', () => navigateTestimonial(-1));
        if (nextTestimonialBtn) nextTestimonialBtn.addEventListener('click', () => navigateTestimonial(1));

        createTestimonialDots(); // Creează punctele de navigare
        showTestimonial(0); // Afișează primul testimonial la încărcare
    }
});
