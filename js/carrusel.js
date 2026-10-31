/* ==========================================================================
   BARRIO SEGURO - LÓGICA DEL CARRUSEL Y NAVEGACIÓN MÓVIL
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------
    // 1. NAVEGACIÓN RESPONSIVE (MENÚ HAMBURGUESA)
    // --------------------------------------------------
    const btnMenuMobile = document.getElementById('btnMenuMobile');
    const navMenu = document.querySelector('.nav-menu');

    if (btnMenuMobile && navMenu) {
        btnMenuMobile.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Cambiar icono entre hamburguesa y X
            const icono = btnMenuMobile.querySelector('i');
            if (icono) {
                if (navMenu.classList.contains('active')) {
                    icono.classList.remove('fa-bars');
                    icono.classList.add('fa-xmark');
                } else {
                    icono.classList.remove('fa-xmark');
                    icono.classList.add('fa-bars');
                }
            }
        });
    }

    // --------------------------------------------------
    // 2. LÓGICA DEL CARRUSEL DE IMÁGENES
    // --------------------------------------------------
    const slides = document.querySelectorAll('.carrusel-slide');
    const puntos = document.querySelectorAll('.punto');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const carruselContenedor = document.querySelector('.carrusel-contenedor');

    // Si no existen diapositivas en la página actual (ej. reportes.html), salir silenciosamente
    if (!slides || slides.length === 0) return;

    let slideActual = 0;
    const totalSlides = slides.length;
    let temporizadorCarrusel = null;
    const TIEMPO_CAMBIO = 4000; // Cambio automático cada 4 segundos

    /**
     * Muestra la diapositiva en el índice especificado
     * @param {number} indice - Índice de la diapositiva
     */
    function mostrarSlide(indice) {
        // Asegurar rango circular de índices
        if (indice >= totalSlides) {
            slideActual = 0;
        } else if (indice < 0) {
            slideActual = totalSlides - 1;
        } else {
            slideActual = indice;
        }

        // Quitar clase active de todas las diapositivas y puntos
        slides.forEach(slide => slide.classList.remove('active'));
        puntos.forEach(punto => punto.classList.remove('active'));

        // Activar la diapositiva y el punto correspondiente
        slides[slideActual].classList.add('active');
        if (puntos[slideActual]) {
            puntos[slideActual].classList.add('active');
        }
    }

    /**
     * Avanza a la siguiente diapositiva
     */
    function siguienteSlide() {
        mostrarSlide(slideActual + 1);
    }

    /**
     * Retrocede a la diapositiva anterior
     */
    function anteriorSlide() {
        mostrarSlide(slideActual - 1);
    }

    /**
     * Inicia la reproducción automática del carrusel
     */
    function iniciarAutoPlay() {
        pararAutoPlay();
        temporizadorCarrusel = setInterval(siguienteSlide, TIEMPO_CAMBIO);
    }

    /**
     * Detiene la reproducción automática
     */
    function pararAutoPlay() {
        if (temporizadorCarrusel) {
            clearInterval(temporizadorCarrusel);
        }
    }

    // Eventos para botones Anterior / Siguiente
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            siguienteSlide();
            iniciarAutoPlay(); // Reiniciar contador al interactuar
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            anteriorSlide();
            iniciarAutoPlay(); // Reiniciar contador al interactuar
        });
    }

    // Eventos para indicadores de puntos
    puntos.forEach(punto => {
        punto.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            if (!isNaN(index)) {
                mostrarSlide(index);
                iniciarAutoPlay();
            }
        });
    });

    // Pausar carrusel al pasar el mouse por encima y reanudar al quitarlo
    if (carruselContenedor) {
        carruselContenedor.addEventListener('mouseenter', pararAutoPlay);
        carruselContenedor.addEventListener('mouseleave', iniciarAutoPlay);
    }

    // Inicializar carrusel
    mostrarSlide(slideActual);
    iniciarAutoPlay();
});