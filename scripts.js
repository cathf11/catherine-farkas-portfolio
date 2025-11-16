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
        sendEventToGA4('cookie_accept'); // PARA PRUEBAS TIEMPO REAL
        if (banner) banner.classList.add('hidden');
    } else if (consent === 'denied') {
        sendEventToBackend('cookie_reject');
        sendEventToGA4('cookie_reject'); // PARA PRUEBAS TIEMPO REAL
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
            sendEventToGA4('cookie_accept'); // PARA PRUEBAS TIEMPO REAL
            if (banner) banner.classList.add('hidden');
            document.body.style.overflow = '';
        });
    }

    if (rejectBtn) {
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'denied');
            sendEventToBackend('cookie_reject');
            sendEventToGA4('cookie_reject'); // PARA PRUEBAS TIEMPO REAL
            if (banner) banner.classList.add('hidden');
            document.body.style.overflow = '';
            console.log("❌ Usuario rechazó cookies (evento enviado al backend y a GA4 para pruebas)");
        });
    }
});
