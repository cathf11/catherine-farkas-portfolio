/* =======================================================
   1. GOOGLE ANALYTICS & EVENTOS
   ======================================================= */
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

function loadGA4() {
    if (window.gtagLoaded) return;
    window.gtagLoaded = true;
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-0G3Q7PGYFP";
    gaScript.onload = () => {
        gtag('js', new Date());
        gtag('config', 'G-0G3Q7PGYFP');
        console.log("✅ GA4 cargado");
    };
    document.head.appendChild(gaScript);
}

function trackProyecto(url) {
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({ 'event': 'proyecto_visto', 'url_proyecto': url });
    }
}

/* =======================================================
   2. MODALES (VENTANAS EMERGENTES)
   ======================================================= */
function openModal(modalId, iframeSrc) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Si hay iframe, cargarlo
    if (iframeSrc) {
        let iframeId = '';
        if (modalId === 'dashboard-marketing-modal') iframeId = 'dashboard-marketing-iframe';
        else if (modalId === 'operational-insights-modal') iframeId = 'operational-dashboard-iframe';
        else if (modalId === 'project-covid-modal') iframeId = 'project-covid-iframe';
        
        const iframe = document.getElementById(iframeId);
        if (iframe) iframe.src = iframeSrc;
    }
    
    modal.style.display = 'flex'; 
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden'; 
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('open');
    
    setTimeout(() => {
        modal.style.display = 'none';
        const iframes = modal.getElementsByTagName('iframe');
        if (iframes.length > 0) {
            iframes[0].src = '';
        }
        document.body.style.overflow = ''; 
    }, 300);
}

/* =======================================================
   3. LÓGICA DE PÁGINA (DOM LISTENER)
   ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

    // --- A. CARRUSEL BLOG (¡ARREGLADO!) ---
    const carouselViewport = document.getElementById('carousel-viewport');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (carouselViewport && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Desplaza 300px a la derecha suavemente
            carouselViewport.scrollBy({ left: 300, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            // Desplaza 300px a la izquierda suavemente
            carouselViewport.scrollBy({ left: -300, behavior: 'smooth' });
        });
    }

    // --- B. GESTIÓN DE COOKIES ---
    const banner = document.getElementById('cookie-consent-banner');
    const wrapper = document.getElementById('cookie-consent-wrapper');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    if (!localStorage.getItem('cookieConsent')) {
        if (wrapper) {
            wrapper.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    } else if (localStorage.getItem('cookieConsent') === 'granted') {
        loadGA4();
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'granted');
            loadGA4();
            if (wrapper) wrapper.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'denied');
            if (wrapper) wrapper.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    // --- C. BOTÓN FLOTANTE ---
    const floatBtn = document.querySelector(".floating-button");
    const intro = document.querySelector("#intro");
    
    function checkButtonVisibility() {
        if (!floatBtn || !intro) return;
        const introBottom = intro.getBoundingClientRect().bottom;
        if (introBottom <= 100) { 
            floatBtn.classList.add("visible");
        } else {
            floatBtn.classList.remove("visible");
        }
    }

    // --- D. SCROLL REVEAL ---
    const reveals = document.querySelectorAll('.reveal');
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    // --- E. PARALLAX ---
    function parallaxEffect() {
        document.body.style.setProperty('--scroll', window.pageYOffset);
    }

    // EVENTOS SCROLL
    window.addEventListener('scroll', () => {
        checkButtonVisibility();
        revealOnScroll();
        parallaxEffect();
    });

    // Ejecutar una vez al inicio
    checkButtonVisibility();
    revealOnScroll();
});

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal(event.target.id);
    }
};