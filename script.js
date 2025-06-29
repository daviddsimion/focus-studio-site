document.addEventListener('DOMContentLoaded', () => {
    // Selectează toate secțiunile care au clasa 'reveal'
    const sections = document.querySelectorAll('section.reveal');
    // Selectează butonul "Back to Top"
    const backToTopBtn = document.getElementById('back-to-top');

    // --- Funcționalități Generale ---

    // 1. Animații la scroll (Reveal Sections)
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

    // 2. Buton "Back to Top"
    function toggleBackToTop() {
        if (backToTopBtn) { // Verifică dacă butonul există înainte de a-l manipula
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    }

    // 3. Setarea anului curent în footer
    function setCurrentYear() {
        // Selectează toate elementele cu ID-uri care încep cu "current-year"
        const currentYearElements = document.querySelectorAll('[id^="current-year"]');
        if (currentYearElements.length > 0) {
            const year = new Date().getFullYear();
            currentYearElements.forEach(el => el.textContent = year);
        }
    }

    // 4. Activarea link-ului de navigație pentru pagina curentă
    function setActiveNavLink() {
        const path = window.location.pathname.split('/').pop();
        document.querySelectorAll('nav a').forEach(link => {
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

    // Funcția de deschidere Lightbox
    function openLightbox(index) {
        filteredImages = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)')); // Actualizează imaginile filtrate
        currentImageIndex = filteredImages.indexOf(galleryItems[index]); // Găsește indexul în array-ul filtrat
        if (currentImageIndex === -1 && filteredImages.length > 0) { // Fallback dacă imaginea nu e în array-ul filtrat
            currentImageIndex = 0;
        }
        
        if (filteredImages.length > 0) {
            lightboxImage.src = filteredImages[currentImageIndex].src;
            lightboxCaption.textContent = filteredImages[currentImageIndex].dataset.caption || '';
            lightboxOverlay.classList.add('show');
            document.body.style.overflow = 'hidden'; // Blochează scroll-ul paginii
        }
    }

    // Funcția de închidere Lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Permite scroll-ul din nou
    }

    // Funcția de navigare (următoarea/anterioara)
    function navigateLightbox(direction) {
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = filteredImages.length - 1;
        } else if (currentImageIndex >= filteredImages.length) {
            currentImageIndex = 0;
        }
        lightboxImage.src = filteredImages[currentImageIndex].src;
        lightboxCaption.textContent = filteredImages[currentImageIndex].dataset.caption || '';
    }

    // Funcția de filtrare a imaginilor
    function filterGallery(category) {
        galleryItems.forEach(item => {
            const itemCategory = item.dataset.category;
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                item.style.display = 'block'; // Asigură că elementul este vizibil după filtrare
            } else {
                item.classList.add('hidden');
                item.style.display = 'none'; // Ascunde elementul complet după animație
            }
        });
    }

    // --- Inițializare și Event Listeners ---

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

        lightboxCloseBtn.addEventListener('click', closeLightbox);
        lightboxPrevBtn.addEventListener('click', () => navigateLightbox(-1));
        lightboxNextBtn.addEventListener('click', () => navigateLightbox(1));

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

    // --- Carusel Testimoniale (Implementare simplă, manuală) ---
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    let currentTestimonialIndex = 0;

    if (testimonialCarousel && testimonialItems.length > 0) {
        // Implementare manuală simplă: afișează doar primul testimonial la început
        // Dacă vrei un carusel real, ar fi nevoie de mai mult JS (navigare, autoplay)
        // Deocamdată, îl vom lăsa să afișeze static doar un item dacă vrei.
        // Pentru o funcționalitate de carusel completă (prev/next, autoplay), ar trebui să adăugăm mai mult cod aici.
        // De exemplu, un mic "carusel" fără butoane, dar cu scroll snap:
        // (CSS-ul are deja proprietățile scroll-snap)
    }


    // Funcție utilitară pentru a "throtla" evenimentele (limitează numărul de apeluri)
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
});
