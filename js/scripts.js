/* ==========================================================================
   1. CONFIGURACIÓN EDITABLE DE LA TIENDA
   Modifica aquí el número de WhatsApp y los productos sin tocar el HTML.
   ========================================================================== */
const CONFIG_TIENDA = {
    // IMPORTANTE: Escribe el número con código de país, sin el símbolo '+' ni espacios.
    // Ejemplo Nicaragua: 50588888888 | Ejemplo México: 5215512345678
    whatsappNumero: "50500000000",
    mensajeGeneral: "Hola Casa de las Pinturas, me gustaría recibir asesoría y cotizar unos productos."
};

// Lista de productos disponibles (puedes agregar, quitar o editar objetos aquí)
const PRODUCTOS = [
    {
        id: 1,
        nombre: "Pintura Anticorrosiva",
        categoria: "Protección Metal",
        descripcion: "Fondo protector de alta resistencia contra la oxidación para estructuras metálicas, portones y verjas.",
        precio: "$24.50 / galón",
        imagen: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        nombre: "Pintura de Aceite",
        categoria: "Uso General",
        descripcion: "Acabado duradero y lavable ideal para superficies expuestas al desgaste continuo y humedad.",
        precio: "$28.00 / galón",
        imagen: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        nombre: "Pintura Látex",
        categoria: "Interiores y Exteriores",
        descripcion: "Pintura arquitectónica de excelente cubrimiento, secado rápido y bajo olor para paredes y cielos rasos.",
        precio: "$22.00 / galón",
        imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        nombre: "Esmalte Sintético",
        categoria: "Acabado Brillante",
        descripcion: "Brillo espejo y máxima retención de color para madera y metal en ambientes interiores o exteriores.",
        precio: "$29.50 / galón",
        imagen: "https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        nombre: "Selladores",
        categoria: "Preparación",
        descripcion: "Sella la porosidad en paredes nuevas de concreto o repello, mejorando el rendimiento de la pintura final.",
        precio: "$19.00 / galón",
        imagen: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        nombre: "Diluyentes",
        categoria: "Solventes",
        descripcion: "Thinner y aguarrás mineral de alta pureza para ajustar la viscosidad y limpiar herramientas de aplicación.",
        precio: "$8.50 / galón",
        imagen: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80"
    }
];

/* ==========================================================================
   2. INICIALIZACIÓN CUANDO CARGA EL DOCUMENTO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    renderizarProductos();
    configurarWhatsAppGeneral();
    configurarMenuMovil();
    configurarEfectosScroll();
    configurarAnimacionesScroll();
    actualizarAnioFooter();
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
 * Dibuja dinámicamente las tarjetas de productos en el HTML
 */
function renderizarProductos() {
    const gridProductos = document.getElementById("products-grid");
    if (!gridProductos) return;

    gridProductos.innerHTML = PRODUCTOS.map((producto, index) => {
        const mensajeProducto = `Hola Casa de las Pinturas, me interesa consultar disponibilidad y precio de: *${producto.nombre}* (${producto.precio}).`;
        const urlWhatsApp = crearEnlaceWhatsApp(mensajeProducto);

        return `
            <article class="product-card reveal" style="transition-delay: ${index * 0.08}s;">
                <div class="product-card__image-box">
                    <span class="product-card__tag">${producto.categoria}</span>
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-card__image" loading="lazy">
                </div>
                <div class="product-card__body">
                    <h3 class="product-card__title">${producto.nombre}</h3>
                    <p class="product-card__description">${producto.descripcion}</p>
                    <div class="product-card__footer">
                        <div>
                            <span class="product-card__price-label">Precio ref.</span>
                            <span class="product-card__price">${producto.precio}</span>
                        </div>
                        <a href="${urlWhatsApp}" target="_blank" rel="noopener noreferrer" class="btn btn--whatsapp btn--sm" aria-label="Consultar ${producto.nombre} por WhatsApp">
                            Consultar
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join("");
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
    const enlaces = document.querySelectorAll(".navbar__link");

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