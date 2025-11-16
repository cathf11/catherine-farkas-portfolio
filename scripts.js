// =======================================================
// ----------------- GOOGLE ANALYTICS -------------------
// =======================================================

// 1️⃣ Creamos dataLayer
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// 2️⃣ Función para cargar GA4 normalmente
function loadGA4() {
    if (window.gtagLoaded) return;
    window.gtagLoaded = true;

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-0G3Q7PGYFP";

    gaScript.onload = () => {
        gtag('js', new Date());
        gtag('config', 'G-0G3Q7PGYFP');
        console.log("✅ gtag.js cargado y configurado");
    };

    document.head.appendChild(gaScript);
}

// 3️⃣ Generar client_id persistente
function generateClientID() {
    let id = localStorage.getItem("client_id_ga4");
    if (!id) {
        id = "cid-" + Math.random().toString(36).substring(2) + Date.now();
        localStorage.setItem("client_id_ga4", id);
    }
    return id;
}

// 4️⃣ Enviar evento seguro al backend (Netlify Functions)
function sendEventToBackend(eventName, params = {}) {
    const clientId = generateClientID();
    fetch("/.netlify/functions/track-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            event_name: eventName,
            params: params,
            client_id: clientId
        })
    }).catch(err => console.error("Error enviando evento al backend:", err));
}

// 4️⃣a Enviar también a GA4 directamente para pruebas (Tiempo Real)
function sendEventToGA4(eventName, params = {}) {
    if (typeof gtag === "function") {
        gtag('event', eventName, params);
    }
}

// =======================================================
// ----------------- SEGUIMIENTO PROYECTOS --------------
// =======================================================
function trackProyecto(url) {
    if (typeof dataLayer === 'undefined') {
        console.error('Google Tag Manager (dataLayer) no está inicializado.');
        return;
    }

    try {
        const urlObj = new URL(url);
        const proyectoId = urlObj.searchParams.get('p') || 'sin-id';

        dataLayer.push({
            'event': 'proyecto_visto',
            'id_proyecto': proyectoId
        });
        console.log('✅ Evento manual "proyecto_visto" disparado con ID:', proyectoId);

        if (typeof gtag === "function") {
            gtag('event', 'proyecto_visto', { 'id_proyecto': proyectoId }); // PARA PRUEBAS
        }
    } catch (e) {
        console.error('Error al rastrear el proyecto:', e);
    }
}

// =======================================================
// ----------------- MENÚ MÓVIL ------------------------
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    function toggleMenu() {
        if (!mobileMenu || !menuToggle) return;

        const isHidden = mobileMenu.classList.toggle('invisible');
        mobileMenu.classList.toggle('opacity-0');
        mobileMenu.classList.toggle('scale-95');
        mobileMenu.classList.toggle('opacity-100', !isHidden);
        mobileMenu.classList.toggle('scale-100', !isHidden);

        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('opacity-100')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);

    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('opacity-100')) toggleMenu();
            });
        });
    }

    document.addEventListener('click', (e) => {
        if (!mobileMenu || !menuToggle) return;
        if (mobileMenu.classList.contains('opacity-100')) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);
            if (!isClickInsideMenu && !isClickOnToggle) toggleMenu();
        }
    });
});

// =======================================================
// ----------------- MODALES ----------------------------
// =======================================================
function openModal(modalId, iframeSrc) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (typeof gtag === "function") {
        gtag('event', 'proyecto_visto', { modal_id: modalId, iframe_src: iframeSrc }); // PARA PRUEBAS
    }

    let iframeId;
    if (modalId === 'dashboard-marketing-modal') iframeId = 'dashboard-marketing-iframe';
    else if (modalId === 'operational-insights-modal') iframeId = 'operational-dashboard-iframe';
    else if (modalId === 'project-covid-modal') iframeId = 'project-covid-iframe';

    const iframe = document.getElementById(iframeId);
    if (iframe) {
        const dataSrc = iframe.getAttribute('data-src');
        iframe.src = dataSrc || iframeSrc || '';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('open');
    setTimeout(() => {
        if (!document.querySelector('.modal-overlay.open')) {
            document.body.style.overflow = '';
        }
    }, 300);

    let iframeId;
    if (modalId === 'dashboard-marketing-modal') iframeId = 'dashboard-marketing-iframe';
    else if (modalId === 'operational-insights-modal') iframeId = 'operational-dashboard-iframe';
    else if (modalId === 'project-covid-modal') iframeId = 'project-covid-iframe';

    if (iframeId) {
        const iframe = document.getElementById(iframeId);
        if (iframe) iframe.src = '';
    }
}

// =======================================================
// ----------------- TOOLTIP ----------------------------
// =======================================================
function hideFloatingTooltip() {
    const button = document.getElementById('floating-contact-button');
    if (!button) return;
    button.blur();
    const originalTooltip = button.getAttribute('data-tooltip');
    button.setAttribute('data-tooltip', '');
    setTimeout(() => button.setAttribute('data-tooltip', originalTooltip), 100);
}

// =======================================================
// ----------------- CARRUSEL ---------------------------
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('carousel-next');
    const prevBtn = document.getElementById('carousel-prev');
    const viewport = document.getElementById('carousel-viewport');

    function scrollCarousel(direction) {
        if (!viewport) return;
        const firstCard = viewport.querySelector('.carousel-item');
        if (!firstCard) return;
        const gap = 24;
        const scrollAmount = firstCard.offsetWidth + gap;
        viewport.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }

    if (nextBtn) nextBtn.addEventListener('click', () => scrollCarousel(1));
    if (prevBtn) prevBtn.addEventListener('click', () => scrollCarousel(-1));
});

// =======================================================
// ----------------- BANNER DE COOKIES ------------------
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-consent-wrapper');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    const consent = localStorage.getItem('cookieConsent');

    if (consent === 'granted') {
        loadGA4();
        sendEventToBackend('cookie_accept');
        sendEventToGA4('cookie_accept'); // PARA PRUEBAS
        if (banner) banner.classList.add('hidden');
    } else if (consent === 'denied') {
        sendEventToBackend('cookie_reject');
        sendEventToGA4('cookie_reject'); // PARA PRUEBAS
        if (banner) banner.classList.add('hidden');
    } else {
        if (banner) {
            banner.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'granted');
            loadGA4();
            sendEventToBackend('cookie_accept');
            sendEventToGA4('cookie_accept'); // PARA PRUEBAS
            if (banner) banner.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'denied');
            sendEventToBackend('cookie_reject');
            sendEventToGA4('cookie_reject'); // PARA PRUEBAS
            if (banner) banner.classList.add('hidden');
            document.body.style.overflow = '';
            console.log("❌ Usuario rechazó cookies (evento enviado al backend y a GA4 para pruebas)");
        });
    }
});

// =======================================================
// ----------------- BOTÓN FLOTANTE --------------------
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".floating-button");
    const intro = document.querySelector("#intro");
    const header = document.querySelector("#main-header");
    if (!button || !intro) return;

    function checkButtonVisibility() {
        const introRect = intro.getBoundingClientRect();
        const headerHeight = header ? header.offsetHeight : 0;
        const shouldShow = (introRect.bottom - headerHeight) <= 0;
        if (shouldShow) button.classList.add("visible");
        else button.classList.remove("visible");
    }

    checkButtonVisibility();
    window.addEventListener("scroll", () => requestAnimationFrame(checkButtonVisibility), { passive: true });
    window.addEventListener("resize", checkButtonVisibility);
});
