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
    
    modal.style.display = 'flex'; // Asegurar display flex
    // Pequeño timeout para permitir la transición de opacidad
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
    document.body.style.overflow = 'hidden'; // Bloquear scroll fondo
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('open');
    
    // Esperar a que termine la animación para ocultarlo
    setTimeout(() => {
        modal.style.display = 'none';
        
        // Limpiar src del iframe para detener videos
        const iframes = modal.getElementsByTagName('iframe');
        if (iframes.length > 0) {
            iframes[0].src = '';
        }
        document.body.style.overflow = ''; // Reactivar scroll
    }, 300);
}

/* =======================================================
   3. ANIMACIONES Y LÓGICA DE PÁGINA (Al cargar)
   ======================================================= */
document.addEventListener('DOMContentLoaded', () => {

    // --- A. GESTIÓN DE COOKIES ---
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

    // --- B. BOTÓN FLOTANTE ---
    const floatBtn = document.querySelector(".floating-button");
    const intro = document.querySelector("#intro");
    
    function checkButtonVisibility() {
        if (!floatBtn || !intro) return;
        const introBottom = intro.getBoundingClientRect().bottom;
        if (introBottom <= 100) { // Aparece al pasar la intro
            floatBtn.classList.add("visible");
        } else {
            floatBtn.classList.remove("visible");
        }
    }

    // --- C. SCROLL REVEAL (SOLUCIÓN "IMÁGENES QUE NO SALEN") ---
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

    // --- D. PARALLAX FIGURAS (SOLUCIÓN "FIGURAS QUE NO SE MUEVEN") ---
    function parallaxEffect() {
        // Actualiza la variable CSS --scroll con la posición actual
        document.body.style.setProperty('--scroll', window.pageYOffset);
    }

    // EVENT LISTENERS UNIFICADOS
    window.addEventListener('scroll', () => {
        checkButtonVisibility();
        revealOnScroll();
        parallaxEffect();
    });

    // Ejecutar una vez al inicio
    checkButtonVisibility();
    revealOnScroll();
});

// Función global para cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        closeModal(event.target.id);
    }
};