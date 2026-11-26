/* ==========================================================================
   1. CONFIGURACIÓN EDITABLE DE LA TIENDA
   Modifica aquí el número de WhatsApp. Los productos están en data/productos.js
   ========================================================================== */
const CONFIG_TIENDA = {
    // IMPORTANTE: Escribe el número con código de país, sin el símbolo '+' ni espacios.
    // Ejemplo Nicaragua: 50588888888 | Ejemplo México: 5215512345678
    whatsappNumero: "50586814778",
    mensajeGeneral: "Hola Casa de las Pinturas, me gustaría recibir asesoría y cotizar unos productos."
};

/* ==========================================================================
   2. INICIALIZACIÓN CUANDO CARGA EL DOCUMENTO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", async () => {
    configurarWhatsAppGeneral();
    configurarMenuMovil();
    configurarEfectosScroll();
    configurarAnimacionesScroll();
    actualizarAnioFooter();

    const productos = await Catalogo.iniciar();
    if (productos) Carrito.iniciar(productos);
});

/* ==========================================================================
   3. FUNCIONES PRINCIPALES
   ========================================================================== */

/**
 * Genera el enlace oficial de WhatsApp con texto codificado
 */
function crearEnlaceWhatsApp(mensaje) {
    const textoCodificado = encodeURIComponent(mensaje);
    return `https://wa.me/${CONFIG_TIENDA.whatsappNumero}?text=${textoCodificado}`;
}

/**
 * Convierte un dato en texto seguro para insertarlo como HTML
 */
function escaparHTML(texto) {
    const reemplazos = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(texto).replace(/[&<>"']/g, caracter => reemplazos[caracter]);
}

/**
 * Deja una cantidad como número entero entre 1 y 999
 */
function limitarCantidad(valor) {
    const numero = Math.floor(Number(valor)) || 1;
    return Math.min(999, Math.max(1, numero));
}

/**
 * Configura el botón general de WhatsApp en la sección de contacto
 */
function configurarWhatsAppGeneral() {
    const btnGeneral = document.getElementById("general-whatsapp-btn");
    if (btnGeneral) {
        btnGeneral.href = crearEnlaceWhatsApp(CONFIG_TIENDA.mensajeGeneral);
    }
}

/**
 * Controla la apertura y cierre del menú en pantallas móviles
 */
function configurarMenuMovil() {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const menuNav = document.getElementById("navbar-menu");
    const enlaces = document.querySelectorAll(".navbar__menu a");

    if (!menuBtn || !menuNav) return;

    menuBtn.addEventListener("click", () => {
        const estaAbierto = menuNav.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", estaAbierto);
    });

    enlaces.forEach(enlace => {
        enlace.addEventListener("click", () => {
            menuNav.classList.remove("is-open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

/**
 * Añade sombra al navbar al bajar y resalta la sección activa
 */
function configurarEfectosScroll() {
    const navbar = document.getElementById("navbar");
    const secciones = document.querySelectorAll("section[id]");
    const enlaces = document.querySelectorAll(".navbar__link");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            navbar.classList.add("navbar--scrolled");
        } else {
            navbar.classList.remove("navbar--scrolled");
        }

        let seccionActual = "";
        secciones.forEach(seccion => {
            const topSeccion = seccion.offsetTop - 120;
            if (window.scrollY >= topSeccion) {
                seccionActual = seccion.getAttribute("id");
            }
        });

        enlaces.forEach(enlace => {
            enlace.classList.remove("active");
            if (enlace.getAttribute("href") === `#${seccionActual}`) {
                enlace.classList.add("active");
            }
        });
    });
}

/**
 * Activa las animaciones suaves de aparición al hacer scroll
 */
function configurarAnimacionesScroll() {
    const elementosAnimables = document.querySelectorAll(
        ".reveal, .section__header, .contact__card, .contact__social-card"
    );

    elementosAnimables.forEach(el => el.classList.add("reveal"));

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("is-visible");
                observador.unobserve(entrada.target);
            }
        });
    }, {
        threshold: 0.12
    });

    elementosAnimables.forEach(el => observador.observe(el));
}

/**
 * Coloca el año actual automáticamente en el pie de página
 */
function actualizarAnioFooter() {
    const spanAnio = document.getElementById("current-year");
    if (spanAnio) {
        spanAnio.textContent = new Date().getFullYear();
    }
}