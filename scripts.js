// --- CARGA DIRECTA "SÍ O SÍ" (VERSIÓN CORREGIDA) ---
// El script de Google se carga siempre, pero "dormido" (gracias al 'denied' del HTML)
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
            if