/* =======================================================
   1. VARIABLES Y CONFIGURACIÓN BASE (DEL ORIGINAL)
   ======================================================= */
:root {
    --color-cian: #06B6D4; /* Tailwind cyan-500 */
    --color-shadow-light: rgba(6, 182, 212, 0.15); /* Sombra suave cian */
}

body {
    font-family: 'Inter', sans-serif;
    background-color: #F3F4F6; /* Fondo original suave */
    color: #1f2937;
    
    /* NECESARIO PARA LAS BOLAS FLOTANTES */
    position: relative;
    overflow-x: hidden;
    z-index: 1;
}

/* =======================================================
   2. BOLAS FLOTANTES (EL EFECTO QUE TE GUSTA)
   ======================================================= */
body::before,
body::after {
    content: "";
    position: fixed;
    z-index: -1; 
    pointer-events: none;
    
    /* Estilo de las bolas */
    border: 2px solid rgba(6, 182, 212, 0.15);
    background: radial-gradient(circle, rgba(6, 182, 212, 0.01) 0%, transparent 60%);
    box-shadow: 0 0 40px rgba(6, 182, 212, 0.05);
    backdrop-filter: blur(3px);

    /* Animación suave */
    will-change: transform;
    transition: transform 0.1s linear; 
}

/* BOLA IZQUIERDA */
body::before {
    width: 25vw;   
    height: 60vh;
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    top: 20vh;
    left: -12vw;   
    transform: rotate(calc(var(--scroll, 0) * 0.02deg)); 
}

/* BOLA DERECHA */
body::after {
    width: 30vw;
    height: 30vw;
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    bottom: 5vh;
    right: -10vw;
    transform: translateY(calc(var(--scroll, 0) * -0.1px)) rotate(calc(var(--scroll, 0) * -0.01deg)); 
}

/* =======================================================
   3. COMPONENTES DE TU WEB (ORIGINALES)
   ======================================================= */

/* EFECTO DE VIDRIO ESMERILADO (Header) */
.glass-header {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* TARJETAS (Card Pro) */
.card-pro {
    background-color: #F8FAFC;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

/* INTERACCIÓN PROYECTOS (HOVER + GLOW) */
.clickable-card:hover {
    cursor: pointer;
    transform: translateY(-8px); /* Salto visible */
    border-color: var(--color-cian);
    box-shadow: 0 15px 30px rgba(6, 182, 212, 0.15), 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* TÍTULOS CON LÍNEA */
.section-title {
    position: relative;
    display: inline-block;
    padding-bottom: 0.5rem;
}
.section-title::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 70px;
    height: 3px;
    background-color: var(--color-cian);
    border-radius: 9999px;
}

/* BOTONES CIAN */
.btn-cian {
    background-image: linear-gradient(to right, #06b6d4, #38bdf8);
    color: white;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px var(--color-shadow-light);
}
.btn-cian:hover {
    transform: translateY(-3px) scale(1.02); 
    box-shadow: 0 7px 20px rgba(6, 182, 212, 0.4); 
}

/* BOTÓN FLOTANTE */
.floating-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 50;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(to right, #06b6d4, #38bdf8);
  box-shadow: none;
  color: white;
  cursor: pointer;
}
.floating-button.visible {
  opacity: 1;
  transform: translateY(0);
}
.floating-button:hover {
  transform: translateY(-4px) scale(1.08);
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.6);
}

/* OTROS ESTILOS MENORES (Títulos proyectos, Skills) */
.project-name-title {
    font-weight: 800;
    color: #1f2937;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}
.skill-list-group {
    background-color: #ffffff;
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
    min-height: 220px;
}
.skill-icon {
    color: #06B6D4;
    margin-right: 0.75rem;
    flex-shrink: 0;
    font-size: 20px;
    line-height: 1.2;
}

/* =======================================================
   4. ANIMACIÓN SCROLL REVEAL (NUEVO)
   ======================================================= */
.reveal {
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s ease-out;
}
.reveal.active {
    opacity: 1;
    transform: translateY(0);
}

/* =======================================================
   5. AJUSTES DE SEGURIDAD (MODO OSCURO Y MÓVIL)
   ======================================================= */

/* Tooltip oculto en móvil */
@media (hover: none) {
    .floating-button::after {
        display: none !important;
    }
}

/* FORZADO DE COLORES PARA MODO OSCURO (CRÍTICO PARA QUE SE VEA BIEN) */
@media (prefers-color-scheme: dark) {
  /* Fondo general */
  body {
    background-color: #F3F4F6 !important; 
    color: #1f2937 !important; 
  }
  /* Header */
  .glass-header {
    background-color: rgba(255, 255, 255, 0.95) !important;
  }
  .glass-header span.text-gray-800 {
    color: #1f2937 !important; 
  }
  /* Enlaces menú */
  .nav-links a {
    color: #4b5563 !important; 
  }
  /* Tarjetas blancas */
  .card-pro,
  .bg-white {
    background-color: #ffffff !important;
    border-color: #e5e7eb !important;
  }
  /* Textos oscuros forzados */
  h1, h2, h3, h4,
  .text-gray-900,
  .text-gray-800 {
    color: #1f2937 !important; 
  }
  p, 
  .text-gray-600,
  .text-gray-500 {
    color: #4b5563 !important; 
  }
  /* Botones carrusel */
  #carousel-prev,
  #carousel-next {
    background-color: #ffffff !important; 
    color: #374151 !important; 
    border: 1px solid #e5e7eb !important;
  }
}