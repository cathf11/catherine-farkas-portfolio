// --- MODIFICACIÓN: Carga CONDICIONAL ---
// Verificamos si el usuario ya rechazó antes de cargar nada
const savedConsent = localStorage.getItem('cookieConsent');

if (savedConsent !== 'denied') {
    // Solo cargamos si NO está denegado
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-0G3Q7PGYFP";
    document.head.appendChild(gaScript);

    gtag('js', new Date());
    gtag('config', 'G-0G3Q7PGYFP');
}
// ---------------------------------------

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

/**
 * Abre el modal especificado por ID y carga un iframe si se proporciona una URL.
 * @param {string} modalId - El ID del elemento modal (overlay).
 * @param {string} iframeSrc - La URL que se debe cargar en el iframe del dashboard (o placeholder).
 */

  function openModal(modalId, iframeSrc) {
  const modal = document.getElementById(modalId);

   if (modal) {

// ************************************************
// *** 🎯 CÓDIGO GA4 PARA EL EVENTO DE PROYECTO ***
// ************************************************
// Verificamos si gtag está cargado (es decir, si aceptaron las cookies)
if (typeof gtag === 'function') { 
    gtag('event', 'proyecto_visto', {
        'modal_id': modalId, 
        'iframe_src': iframeSrc 
    });
    console.log('✅ GA4 Evento: proyecto_visto', modalId);
}
// ************************************************

// 1. Cargamos el iframe si existe un ID de iframe coincidente dentro del modal
// Usamos el modalId para encontrar el iframe correcto
let iframeId;

// Proyecto 1 (Marketing)
if (modalId === 'dashboard-marketing-modal') iframeId = 'dashboard-marketing-iframe';

// Proyecto 2 (Operational)
else if (modalId === 'operational-insights-modal') iframeId = 'operational-dashboard-iframe';

// Proyecto 3 (Covid)
else if (modalId === 'project-covid-modal') iframeId = 'project-covid-iframe';


const iframe = document.getElementById(iframeId);

if (iframe) {
   // --- ¡LÓGICA DEL LAZY LOAD! ---
   // Comprueba si el iframe tiene un 'data-src' (los proyectos)
   const dataSrc = iframe.getAttribute('data-src');
   if (dataSrc) {
       iframe.src = dataSrc; // Carga el iframe AHORA, al hacer clic
   } else if (iframeSrc) {
       // Esto es para los modales que SÍ pasan un src (los del blog no lo usan)
       iframe.src = iframeSrc;
   }
   // Si es un modal del blog (sin iframeSrc y sin data-src), no hace nada
}

// 2. Abre el modal con animación
modal.classList.add('open');

// 3. Ocultar el scroll del body principal
document.body.style.overflow = 'hidden';
   }
}

/**
 * Cierra el modal especificado por ID.
 * @param {string} modalId - El ID del elemento modal (overlay).
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
        // Cierra el modal con animación
        modal.classList.remove('open');

        // Muestra el scroll del body principal después de una pequeña espera
        setTimeout(() => {
            // Solo mostramos el scroll del body si NO hay otro modal abierto
            if (!document.querySelector('.modal-overlay.open')) {
                document.body.style.overflow = '';
            }
        }, 300); // 300ms, que es la duración de la transición

        // --- ¡FIX PARA APAGAR IFRAMES! ---
        // Pausa el iframe (detiene videos/Power BI)
        let iframeId;
        if (modalId === 'dashboard-marketing-modal') iframeId = 'dashboard-marketing-iframe';
        else if (modalId === 'operational-insights-modal') iframeId = 'operational-dashboard-iframe';
        else if (modalId === 'project-covid-modal') iframeId = 'project-covid-iframe';
        
        // Los modales del blog no tienen iframes que necesiten apagarse
        else if (modalId === 'cfviztech-modal-1') iframeId = null;
        else if (modalId === 'cfviztech-modal-2') iframeId = null;
        else if (modalId === 'cfviztech-modal-3') iframeId = null;
        else if (modalId === 'cfviztech-modal-4') iframeId = null;
        else if (modalId === 'cfviztech-modal-5') iframeId = null;

        if (iframeId) {
            const iframe = document.getElementById(iframeId);
            if (iframe) {
                iframe.src = ''; // Limpia el src para detener la carga
            }
        }
        // --- FIN DEL FIX ---
    }
}


// --- FUNCIÓN MEJORADA PARA OCULTAR EL TOOLTIP (¡MÁS AGRESIVA!) ---
function hideFloatingTooltip() {
    const button = document.getElementById('floating-contact-button');
    if (button) {
        
        // 1. ¡NUEVO! Quita el foco del botón inmediatamente.
        // Esto evita que el tooltip se quede "pillado" en estado :focus
        button.blur(); 

        // 2. Guarda el contenido del tooltip original
        const originalTooltip = button.getAttribute('data-tooltip');
        
        // 3. Borra el atributo del tooltip temporalmente para esconderlo
        button.setAttribute('data-tooltip', '');
        
        // 4. Restaura el contenido del tooltip después de un breve momento (100ms)
        // Esto permite que vuelva a funcionar para el hover en desktop
        setTimeout(() => {
            button.setAttribute('data-tooltip', originalTooltip);
        }, 100); // Le damos un pelín más de tiempo
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
          'ad_storage': 'granted',        // <--- Faltaba
          'ad_user_data': 'granted',      // <--- Faltaba (V2)
          'ad_personalization': 'granted' // <--- Faltaba (V2)
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
        loadGoogleAnalytics();
    } else if (consent === 'denied') {
        console.log("Analytics RECHAZADAS (consentimiento previo).");
    } else {
        if (banner) {
            banner.classList.remove('hidden'); 
            document.body.style.overflow = 'hidden'; 
        }
    }

    // 3. Qué pasa al ACEPTAR
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            
            // --- ¡NUEVO! Envía evento GA4 de ACEPTAR ---
            if (typeof gtag === 'function') {
                gtag('event', 'consent_choice', {
                    'consent_decision': 'accepted'
                });
            }
            
            localStorage.setItem('cookieConsent', 'granted');
            if (banner) {
                banner.classList.add('hidden');
            }
            document.body.style.overflow = ''; 
            loadGoogleAnalytics(); 
        });
    }

    // 4. Qué pasa al RECHAZAR
    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            
            // A) Avisamos a Google explícitamente (Actualización v2)
            if (typeof gtag === 'function') {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied'
                });
                // Enviamos evento de que ha rechazado
                gtag('event', 'consent_choice', {
                    'consent_decision': 'rejected'
                });
            }

            // B) Guardamos la decisión
            localStorage.setItem('cookieConsent', 'denied');

            // C) Cerramos banner
            if (banner) {
                banner.classList.add('hidden');
            }
            document.body.style.overflow = ''; 
            
            console.log("Analytics: Rechazado estrictamente.");
        });
    }
});

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