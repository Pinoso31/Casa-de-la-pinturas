/* ==========================================================================
   LISTA DE PRE-COTIZACIÓN
   Guarda la selección del cliente, la muestra en un panel lateral y arma el
   mensaje de WhatsApp. No maneja precios.
   ========================================================================== */
const Carrito = (() => {
    const CLAVE_ALMACEN = "cdp_precotizacion_v1";

    let articulos = new Map();  // cve_art -> artículo del catálogo
    let lineas = [];            // [{ cve_art, cantidad }]
    let elementos = {};
    let focoAnterior = null;
    let temporizadorAviso;

    /* ---------------------------- Persistencia ---------------------------- */

    // Solo se guarda clave y cantidad: los demás datos se leen siempre del
    // catálogo vigente. Las claves que ya no existan se descartan.
    function cargar() {
        try {
            const guardado = JSON.parse(localStorage.getItem(CLAVE_ALMACEN)) || [];
            return guardado
                .filter(linea => linea && articulos.has(linea.cve_art))
                .map(linea => ({ cve_art: linea.cve_art, cantidad: limitarCantidad(linea.cantidad) }));
        } catch (error) {
            return [];
        }
    }

    function guardar() {
        try {
            localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lineas));
        } catch (error) {
            // Almacenamiento bloqueado o lleno: la lista vive solo en esta visita
        }
    }

    /* ------------------------------ Operaciones --------------------------- */

    function total() {
        return lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
    }

    function actualizar() {
        guardar();
        dibujar();
    }

    function agregar(cveArt, cantidad) {
        const articulo = articulos.get(cveArt);
        if (!articulo) return;

        const existente = lineas.find(linea => linea.cve_art === cveArt);
        if (existente) {
            existente.cantidad = limitarCantidad(existente.cantidad + cantidad);
        } else {
            lineas.push({ cve_art: cveArt, cantidad: limitarCantidad(cantidad) });
        }

        actualizar();
        mostrarAviso(`Agregado: ${articulo.descripcion} (${articulo.presentacion})`);
    }

    function fijarCantidad(cveArt, cantidad) {
        const linea = lineas.find(l => l.cve_art === cveArt);
        if (!linea) return;
        linea.cantidad = limitarCantidad(cantidad);
        actualizar();
    }

    function eliminar(cveArt) {
        lineas = lineas.filter(linea => linea.cve_art !== cveArt);
        actualizar();
    }

    /* -------------------------------- Mensaje ------------------------------ */

    function crearMensaje() {
        const partes = ["*Casa de las Pinturas*", "Solicitud de pre-cotización"];
        let numero = 0;

        Catalogo.LINEAS.forEach(({ valor }) => {
            const delGrupo = lineas.filter(l => articulos.get(l.cve_art).linea === valor);
            if (!delGrupo.length) return;

            partes.push("", `*${valor}*`);
            delGrupo.forEach(linea => {
                const articulo = articulos.get(linea.cve_art);
                const nota = articulo.disponible ? "" : " _(sobre pedido)_";
                partes.push(
                    `${++numero}. ${articulo.descripcion}${nota}`,
                    `   Código: ${articulo.cve_art} | ${articulo.presentacion} | Cantidad: ${linea.cantidad}`
                );
            });
        });

        partes.push(
            "",
            `Total de artículos: ${total()}`,
            "",
            "Quisiera conocer precios y disponibilidad. Me interesa el descuento especial por visitar y retirar en tienda."
        );

        return partes.join("\n");
    }

    /* --------------------------------- Vista ------------------------------- */

    function crearFila(linea) {
        const articulo = articulos.get(linea.cve_art);
        const clave = escaparHTML(articulo.cve_art);
        const nombre = escaparHTML(articulo.descripcion);

        return `
            <li class="cart-item" data-clave="${clave}">
                <img src="${escaparHTML(articulo.imagen)}" alt="" class="cart-item__image">
                <div class="cart-item__info">
                    <strong>${nombre}</strong>
                    <span>${escaparHTML(articulo.presentacion)} · ${clave}</span>
                    ${articulo.disponible ? "" : '<span class="stock stock--pedido">Sobre pedido</span>'}
                    <div class="cart-item__controls">
                        <div class="qty qty--sm">
                            <button type="button" class="qty__btn" data-accion="restar" aria-label="Restar una unidad de ${nombre}"${linea.cantidad <= 1 ? " disabled" : ""}>−</button>
                            <input type="number" class="qty__input" value="${linea.cantidad}" min="1" max="999" step="1" inputmode="numeric" aria-label="Cantidad de ${nombre}">
                            <button type="button" class="qty__btn" data-accion="sumar" aria-label="Sumar una unidad de ${nombre}">+</button>
                        </div>
                        <button type="button" class="link-btn link-btn--danger" data-accion="eliminar" aria-label="Eliminar ${nombre}">Eliminar</button>
                    </div>
                </div>
            </li>
        `;
    }

    /** Contador, resumen, botones y enlace de envío */
    function dibujarResumen() {
        const cantidad = total();
        const vacio = lineas.length === 0;

        elementos.vacio.hidden = !vacio;
        elementos.enviar.hidden = vacio;
        elementos.vaciar.hidden = vacio;
        elementos.enviar.href = crearEnlaceWhatsApp(crearMensaje());
        elementos.resumen.textContent = cantidad === 1 ? "1 artículo" : `${cantidad} artículos`;

        elementos.contador.textContent = cantidad > 99 ? "99+" : cantidad;
        elementos.contador.hidden = vacio;
        elementos.boton.setAttribute("aria-label", `Abrir pre-cotización, ${elementos.resumen.textContent}`);
    }

    function dibujar() {
        // Se recuerda el control enfocado porque la lista se vuelve a dibujar
        const activo = document.activeElement;
        const enLista = elementos.lista.contains(activo);
        const claveActiva = enLista ? activo.closest(".cart-item").dataset.clave : null;
        const accionActiva = enLista ? activo.dataset.accion : null;

        elementos.lista.innerHTML = lineas.map(crearFila).join("");
        dibujarResumen();

        if (enLista) {
            const fila = [...elementos.lista.children].find(li => li.dataset.clave === claveActiva);
            const control = fila && (accionActiva
                ? fila.querySelector(`[data-accion="${accionActiva}"]:not(:disabled)`)
                : fila.querySelector(".qty__input"));
            (control || (fila && fila.querySelector(".qty__input")) || elementos.cerrar).focus();
        }
    }

    function mostrarAviso(texto) {
        elementos.aviso.textContent = texto;
        elementos.aviso.classList.add("is-visible");
        clearTimeout(temporizadorAviso);
        temporizadorAviso = setTimeout(() => elementos.aviso.classList.remove("is-visible"), 2600);
    }

    /* --------------------------------- Panel ------------------------------- */

    // `inert` impide enfocar el contenido que queda detrás del panel
    function alternarPanel(abierto) {
        elementos.panel.classList.toggle("is-open", abierto);
        elementos.fondo.classList.toggle("is-open", abierto);
        elementos.panel.inert = !abierto;
        document.querySelectorAll("body > header, body > main, body > footer")
            .forEach(zona => { zona.inert = abierto; });
        document.body.classList.toggle("no-scroll", abierto);
        elementos.boton.setAttribute("aria-expanded", String(abierto));
    }

    function abrir() {
        const activo = document.activeElement;
        // Si no había nada enfocado, o era un enlace del menú móvil (que queda
        // oculto), al cerrar se vuelve al botón de la lista
        const sirve = activo && activo !== document.body && !activo.closest(".navbar__menu");
        focoAnterior = sirve ? activo : elementos.boton;
        elementos.aviso.classList.remove("is-visible");
        alternarPanel(true);
        elementos.cerrar.focus();
    }

    function cerrar() {
        alternarPanel(false);
        if (focoAnterior) focoAnterior.focus({ preventScroll: true });
    }

    function configurarEventos() {
        elementos.boton.addEventListener("click", abrir);
        elementos.cerrar.addEventListener("click", cerrar);
        elementos.fondo.addEventListener("click", cerrar);
        elementos.seguir.addEventListener("click", () => {
            cerrar();
            document.getElementById("productos").scrollIntoView();
        });

        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape" && elementos.panel.classList.contains("is-open")) cerrar();
        });

        // "Cotizar ahora": con productos abre la lista; si no, va al catálogo
        document.querySelectorAll("[data-cotizar]").forEach(enlace => {
            enlace.addEventListener("click", evento => {
                if (!lineas.length) return;
                evento.preventDefault();
                abrir();
            });
        });

        elementos.lista.addEventListener("click", evento => {
            const boton = evento.target.closest("button[data-accion]");
            if (!boton) return;

            const clave = boton.closest(".cart-item").dataset.clave;
            const linea = lineas.find(l => l.cve_art === clave);

            if (boton.dataset.accion === "sumar") fijarCantidad(clave, linea.cantidad + 1);
            if (boton.dataset.accion === "restar") fijarCantidad(clave, linea.cantidad - 1);
            if (boton.dataset.accion === "eliminar") eliminar(clave);
        });

        // Cantidad escrita a mano: se actualiza sin redibujar la lista, para no
        // perder el clic siguiente ni dejar atrasado el enlace de envío
        const escribirCantidad = entrada => {
            const fila = entrada.closest(".cart-item");
            const linea = lineas.find(l => l.cve_art === fila.dataset.clave);
            linea.cantidad = limitarCantidad(entrada.value);
            fila.querySelector('[data-accion="restar"]').disabled = linea.cantidad <= 1;
            guardar();
            dibujarResumen();
        };

        elementos.lista.addEventListener("input", evento => {
            if (evento.target.matches(".qty__input") && evento.target.value !== "") {
                escribirCantidad(evento.target);
            }
        });

        // Al salir del campo se muestra el valor ya corregido
        elementos.lista.addEventListener("change", evento => {
            if (!evento.target.matches(".qty__input")) return;
            evento.target.value = limitarCantidad(evento.target.value);
            escribirCantidad(evento.target);
        });

        elementos.vaciar.addEventListener("click", () => {
            if (!window.confirm("¿Vaciar toda tu lista de pre-cotización?")) return;
            lineas = [];
            actualizar();
            elementos.cerrar.focus();
        });

        // Mantiene la lista igual entre varias pestañas abiertas
        window.addEventListener("storage", evento => {
            if (evento.key !== CLAVE_ALMACEN) return;
            lineas = cargar();
            dibujar();
        });
    }

    function iniciar(productos) {
        const porId = id => document.getElementById(id);
        elementos = {
            boton: porId("cart-button"),
            contador: porId("cart-count"),
            panel: porId("cart-drawer"),
            fondo: porId("cart-overlay"),
            cerrar: porId("cart-close"),
            lista: porId("cart-list"),
            vacio: porId("cart-empty"),
            resumen: porId("cart-summary"),
            enviar: porId("cart-send"),
            seguir: porId("cart-continue"),
            vaciar: porId("cart-clear"),
            aviso: porId("toast")
        };

        articulos = new Map(productos.map(producto => [producto.cve_art, producto]));
        lineas = cargar();
        configurarEventos();
        dibujar();
    }

    return { iniciar, agregar };
})();
