// --- CARGA DIRECTA "SÍ O SÍ" (VERSIÓN CORREGIDA CON 'onload') ---
const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-0G3Q7PGYFP";

// ¡LA CLAVE ESTÁ AQUÍ!
// Esperamos a que el script (el "200 verde") termine de cargar
gaScript.onload = () => {
  console.log("gtag.js cargado (200 OK). Enviando 'config'...");
  gtag('js', new Date());
  gtag('config', 'G-0G3Q7PGYFP');
};

// Ahora lo añadimos al head
document.head.appendChild(gaScript);
// ----------------------------------------------------

// **************************************************

// --- FUNCIÓN DE SEGUIMIENTO (EXISTENTE) ---
window.dataLayer = window.dataLayer || [];

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
    } catch (e) {
        console.error('Error al rastrear el proyecto:', e);
    }
}

// --- LÓGICA DEL MENÚ MÓVIL (FINAL Y UNIFICADA) ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Definición de variables
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // 2. Función principal para abrir/cerrar el menú
    function toggleMenu() {
        if (!mobileMenu || !menuToggle) return; // Comprobación de seguridad

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

    // --- EVENT LISTENERS ---

    // 3. Clic en el botón de hamburguesa/X
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // 4. Clic en un enlace dentro del menú (para navegar)
    if (mobileMenu) {
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('opacity-100')) {
                    toggleMenu();
                }
            });
        });
    }

    // 5. ¡NUEVA LÓGICA! Cierra el menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mobileMenu || !menuToggle) return; // Comprobación de seguridad
        
        // Solo actúa si el menú está visible
        if (mobileMenu.classList.contains('opacity-100')) {
            const isClickInsideMenu = mobileMenu.contains(e.target);
            const isClickOnToggle = menuToggle.contains(e.target);

            // Si el clic NO fue dentro del menú Y NO fue en el botón de alternar
            if (!isClickInsideMenu && !isClickOnToggle) {
                toggleMenu();
            }
        }
    });
});

// --- FIN LÓGICA DEL MENÚ MÓVIL (FINAL Y UNIFICADA) ---

// --- LÓGICA DEL MODAL (¡CORREGIDA!) ---

  function openModal(modalId, iframeSrc) {
  const modal = document.getElementById(modalId);

   if (modal) {

// ************************************************
// *** 🎯 CÓDIGO GA4 PARA EL EVENTO DE PROYECTO ***
// ************************************************
if (typeof gtag === 'function') { 
    gtag('event', 'proyecto_visto', {
        'modal_id': modalId, 
        'iframe_src': iframeSrc 
    });
    console.log('✅ GA4 Evento: proyecto_visto', modalId);
}
// ************************************************

let iframeId;
if (modalId === 'dashboard-marketing-modal') iframeId = 'dashboard-marketing-iframe';
else if (modalId === 'operational-insights-modal') iframeId = 'operational-dashboard-iframe';
else if (modalId === 'project-covid-modal') iframeId = 'project-covid-iframe';

const iframe = document.getElementById(iframeId);

if (iframe) {
   const dataSrc = iframe.getAttribute('data-src');
   if (dataSrc) {
       iframe.src = dataSrc; 
   } else if (iframeSrc) {
       iframe.src = iframeSrc;
   }
}

modal.classList.add('open');
document.body.style.overflow = 'hidden';
   }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
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
        else if (modalId === 'cfviztech-modal-1') iframeId = null;
        else if (modalId === 'cfviztech-modal-2') iframeId = null;
        else if (modalId === 'cfviztech-modal-3') iframeId = null;
        else if (modalId === 'cfviztech-modal-4') iframeId = null;
        else if (modalId === 'cfviztech-modal-5') iframeId = null;

        if (iframeId) {
            const iframe = document.getElementById(iframeId);
            if (iframe) {
                iframe.src = ''; 
            }
        }
    }
}


// --- FUNCIÓN MEJORADA PARA OCULTAR EL TOOLTIP (¡MÁS AGRESIVA!) ---
function hideFloatingTooltip() {
    const button = document.getElementById('floating-contact-button');
    if (button) {
        button.blur(); 
        const originalTooltip = button.getAttribute('data-tooltip');
        button.setAttribute('data-tooltip', '');
        setTimeout(() => {
            button.setAttribute('data-tooltip', originalTooltip);
        }, 100); 
    }
}

// --- LÓGICA DEL CARRUSEL DEL BLOG ---
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

    if (nextBtn) { nextBtn.addEventListener('click', () => scrollCarousel(1)); }
    if (prevBtn) { prevBtn.addEventListener('click', () => scrollCarousel(-1)); }
});

// --- LÓGICA DEL BANNER DE COOKIES (FINAL) ---

// 1. Función para (ahora) SOLO ACTUALIZAR EL CONSENTIMIENTO
function loadGoogleAnalytics() {
    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
        console.log("✅ Analytics ACEPTADAS. Consentimiento total 'granted'.");
    } else {
        console.warn("gtag no está definido al intentar actualizar el consentimiento.");
    }
}


// 2. Lógica principal del banner
document.addEventListener('DOMContentLoaded', () => {
    
    const banner = document.getElementById('cookie-consent-wrapper'); 
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');

    const consent = localStorage.getItem('cookieConsent');

    if (consent === 'granted') {
        // Si ya aceptó, actualizamos el consentimiento (despertamos a Google)
        loadGoogleAnalytics();
    } else if (consent === 'denied') {
        // Si ya rechazó, no hacemos nada. Google sigue dormido.
        console.log("Analytics RECHAZADAS (consentimiento previo).");
    } else {
        // Si no hay nada, mostramos el banner
        if (banner) {
            banner.classList.remove('hidden'); 
            document.body.style.overflow = 'hidden'; 
        }
    }

    // 3. Qué pasa al ACEPTAR
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'consent_choice', {
                    'consent_decision': 'accepted'
                });
            }
            localStorage.setItem('cookieConsent', 'granted');
            if (banner) banner.classList.add('hidden');
            document.body.style.overflow = ''; 
            loadGoogleAnalytics(); 
        });
    }

    // 4. Qué pasa al RECHAZAR
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied'
                });
                gtag('event', 'consent_choice', {
                    'consent_decision': 'rejected'
                });
            }
            localStorage.setItem('cookieConsent', 'denied');
            if (banner) banner.classList.add('hidden');
            document.body.style.overflow = ''; 
            console.log("Analytics: Rechazado estrictamente.");
        });
    }
}); // <-- ¡EL CIERRE IMPORTANTE!

 // === Mejora del botón flotante (scroll + responsive + hover animado) ===
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".floating-button");
  const intro = document.querySelector("#intro");
  const header = document.querySelector("#main-header");
  if (!button || !intro) return;

  function checkButtonVisibility() {
    const introRect = intro.getBoundingClientRect();
    const headerHeight = header ? header.offsetHeight : 0;
    const shouldShow = (introRect.bottom - headerHeight) <= 0;
    if (shouldShow) {
      button.classList.add("visible");
    } else {
      button.classList.remove("visible");
    }
  }

  checkButtonVisibility();
  window.addEventListener("scroll", () => requestAnimationFrame(checkButtonVisibility), { passive: true });
  window.addEventListener("resize", checkButtonVisibility);
});