/* ==========================================================================
   CATÁLOGO INTERACTIVO
   Carga los artículos, los agrupa en tarjetas, aplica filtros y búsqueda, y
   muestra el detalle del producto elegido.
   ========================================================================== */
const Catalogo = (() => {
    // `valor` debe coincidir exactamente con el campo `linea` de los datos
    const LINEAS = [
        { id: "latex", valor: "Látex" },
        { id: "aceite", valor: "Aceite" },
        { id: "anticorrosivo", valor: "Anticorrosivo" },
        { id: "madera", valor: "Madera" },
        { id: "especialidades", valor: "Especialidades" },
        { id: "brochas", valor: "Brochas" },
        { id: "felpas", valor: "Felpas" }
    ];

    const estado = { linea: "todos", busqueda: "" };
    let grupos = [];
    let detalle = {};           // elementos de la ventana de detalle
    let grupoAbierto = null;
    let botonOrigen = null;

    /**
     * ÚNICO punto de acceso a los datos. Al conectar la API sobre SAE, basta
     * con reemplazar el cuerpo por un fetch que devuelva los mismos campos:
     *   const respuesta = await fetch(URL_API);
     *   if (!respuesta.ok) throw new Error(respuesta.status);
     *   return respuesta.json();
     */
    async function obtenerProductos() {
        return PRODUCTOS_SAE;
    }

    function agruparProductos(productos) {
        const mapa = new Map();

        productos.forEach(producto => {
            const linea = LINEAS.find(l => l.valor === producto.linea);
            if (!linea) return;

            const llave = `${linea.id}|${producto.marca}|${producto.descripcion}`;
            if (!mapa.has(llave)) {
                mapa.set(llave, { linea, descripcion: producto.descripcion, articulos: [] });
            }
            mapa.get(llave).articulos.push(producto);
        });

        const lista = [...mapa.values()];
        lista.forEach(grupo => grupo.articulos.sort((a, b) => a.orden - b.orden));
        lista.sort((a, b) => LINEAS.indexOf(a.linea) - LINEAS.indexOf(b.linea));
        return lista;
    }

    /** Artículo que se muestra primero: el galón; en herramientas, la primera medida */
    function articuloInicial(grupo) {
        return grupo.articulos.find(a => a.tamano === "galon") || grupo.articulos[0];
    }

    // La tarjeta solo lleva imagen y nombre; todo lo demás va en el detalle
    function crearTarjeta(grupo, indice) {
        const articulo = articuloInicial(grupo);
        return `
            <article class="product-card" data-grupo="${indice}">
                <div class="product-card__image-box" data-tipo="${articulo.tamano ? "envase" : "herramienta"}">
                    <img ${atributosImagen(articulo)} alt="" class="product-card__image" loading="lazy">
                </div>
                <h3 class="product-card__title">
                    <button type="button" class="product-card__open" aria-haspopup="dialog">${escaparHTML(grupo.descripcion)}</button>
                </h3>
            </article>
        `;
    }

    /* -------------------------- Detalle del producto ---------------------- */

    function articuloSeleccionado() {
        const marcado = detalle.opciones.querySelector("input:checked");
        return grupoAbierto.articulos.find(a => a.cve_art === marcado.value);
    }

    /** Cambia la foto con una transición y ajusta su escala según el envase */
    function mostrarImagen(articulo) {
        prepararImagen(detalle.imagen, articulo);
        detalle.media.dataset.tamano = articulo.tamano || "";
        detalle.medida.textContent = articulo.presentacion;
        detalle.nota.hidden = !articulo.referencial;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        detalle.imagen.animate(
            [{ opacity: 0, translate: "28px 0" }, { opacity: 1, translate: "0 0" }],
            { duration: 380, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        );
    }

    function textoDisponibilidad({ disponible }) {
        if (disponible === true) return { texto: "En stock", clase: "" };
        if (disponible === false) return { texto: "Sobre pedido", clase: "stock--pedido" };
        return { texto: "Consultar disponibilidad", clase: "stock--consulta" };
    }

    /** Muestra código, foto y disponibilidad de la presentación elegida */
    function actualizarDetalle() {
        const articulo = articuloSeleccionado();
        const estado = textoDisponibilidad(articulo);

        detalle.codigo.textContent = articulo.cve_art;
        mostrarImagen(articulo);
        detalle.estado.textContent = estado.texto;
        detalle.estado.className = `stock ${estado.clase}`.trim();
        actualizarEnlaceCotizacion();
    }

    /** Características del producto: son iguales en todas sus presentaciones */
    function mostrarCaracteristicas(articulo) {
        detalle.uso.textContent = articulo.uso;
        detalle.beneficios.innerHTML = articulo.beneficios
            .map(texto => `<li>${escaparHTML(texto)}</li>`).join("");

        const datos = [["Rendimiento", articulo.rendimiento], ["Secado", articulo.secado]]
            .filter(([, valor]) => valor);
        detalle.datos.innerHTML = datos
            .map(([nombre, valor]) => `<div><dt>${nombre}</dt><dd>${escaparHTML(valor)}</dd></div>`).join("");
        detalle.datos.hidden = !datos.length;
    }

    /** El botón de WhatsApp siempre refleja la presentación y cantidad visibles */
    function actualizarEnlaceCotizacion() {
        detalle.whatsapp.href = Carrito.enlaceCotizacion(
            articuloSeleccionado().cve_art,
            limitarCantidad(detalle.cantidad.value)
        );
    }

    function abrirDetalle(tarjeta) {
        grupoAbierto = grupos[tarjeta.dataset.grupo];
        botonOrigen = tarjeta.querySelector(".product-card__open");

        // La búsqueda puede haber apuntado a una presentación concreta
        const inicial = grupoAbierto.articulos.find(a => a.cve_art === tarjeta.dataset.codigo)
            || articuloInicial(grupoAbierto);

        detalle.categoria.textContent = `${grupoAbierto.linea.valor} · ${inicial.marca}`;
        detalle.nombre.textContent = grupoAbierto.descripcion;
        detalle.imagen.alt = grupoAbierto.descripcion;
        detalle.etiqueta.textContent = inicial.etiqueta || "Presentación";
        mostrarCaracteristicas(inicial);
        detalle.opciones.innerHTML = grupoAbierto.articulos.map(articulo => `
            <label class="option${articulo.disponible === false ? " option--pedido" : ""}">
                <input type="radio" name="presentacion" value="${escaparHTML(articulo.cve_art)}"${articulo === inicial ? " checked" : ""}>
                <span>${escaparHTML(articulo.presentacion)}</span>
            </label>
        `).join("");
        detalle.cantidad.value = 1;
        // Se descargan antes las fotos de todos los tamaños para que el cambio sea fluido
        grupoAbierto.articulos.forEach(articulo => { new Image().src = articulo.imagen; });
        actualizarDetalle();

        document.body.classList.add("no-scroll");
        detalle.ventana.showModal();
        detalle.contenido.scrollTop = 0;
    }

    function configurarDetalle() {
        const porId = id => document.getElementById(id);
        detalle = {
            ventana: porId("product-detail"),
            contenido: porId("detail-content"),
            cerrar: porId("detail-close"),
            media: porId("detail-media"),
            imagen: porId("detail-image"),
            medida: porId("detail-size"),
            nota: porId("detail-image-note"),
            uso: porId("detail-use"),
            beneficios: porId("detail-benefits"),
            datos: porId("detail-specs"),
            categoria: porId("detail-category"),
            nombre: porId("detail-title"),
            codigo: porId("detail-code"),
            estado: porId("detail-stock"),
            etiqueta: porId("detail-options-label"),
            opciones: porId("detail-options"),
            formulario: porId("detail-form"),
            cantidad: porId("detail-qty"),
            whatsapp: porId("detail-whatsapp")
        };

        detalle.cerrar.addEventListener("click", () => detalle.ventana.close());

        // Clic en el fondo oscuro (debe empezar y terminar fuera de la ventana)
        let presionadoEnFondo = false;
        detalle.ventana.addEventListener("pointerdown", evento => {
            presionadoEnFondo = evento.target === detalle.ventana;
        });
        detalle.ventana.addEventListener("click", evento => {
            if (presionadoEnFondo && evento.target === detalle.ventana) detalle.ventana.close();
        });

        // Se dispara con cualquier forma de cierre, incluida la tecla Escape
        detalle.ventana.addEventListener("close", () => {
            document.body.classList.remove("no-scroll");
            botonOrigen.focus({ preventScroll: true });
        });

        detalle.opciones.addEventListener("change", actualizarDetalle);

        detalle.cantidad.addEventListener("input", actualizarEnlaceCotizacion);
        detalle.cantidad.addEventListener("change", () => {
            detalle.cantidad.value = limitarCantidad(detalle.cantidad.value);
            actualizarEnlaceCotizacion();
        });

        detalle.formulario.addEventListener("click", evento => {
            const boton = evento.target.closest("button[data-accion]");
            if (!boton) return;
            const paso = boton.dataset.accion === "sumar" ? 1 : -1;
            detalle.cantidad.value = limitarCantidad(limitarCantidad(detalle.cantidad.value) + paso);
            actualizarEnlaceCotizacion();
        });

        detalle.formulario.addEventListener("submit", evento => {
            evento.preventDefault();
            const codigo = articuloSeleccionado().cve_art;
            const cantidad = limitarCantidad(detalle.cantidad.value);
            detalle.ventana.close();
            Carrito.agregar(codigo, cantidad);
        });
    }

    /* --------------------------- Filtros y búsqueda ----------------------- */

    function aplicarFiltros() {
        const deLaLinea = grupos.filter(g => estado.linea === "todos" || g.linea.id === estado.linea);
        const resultado = Buscador.buscar(deLaLinea, estado.busqueda);

        document.querySelectorAll("#products-grid .product-card").forEach(tarjeta => {
            const grupo = grupos[tarjeta.dataset.grupo];
            const coinciden = resultado.get(grupo);
            tarjeta.hidden = !coinciden;

            // Si la búsqueda apunta a ciertas presentaciones (un código, "cubeta",
            // una medida), el detalle se abre en una de ellas
            const preferido = coinciden && coinciden.length < grupo.articulos.length
                ? coinciden.find(a => a.tamano === "galon") || coinciden[0]
                : null;
            tarjeta.dataset.codigo = preferido ? preferido.cve_art : "";
        });

        const visibles = resultado.size;
        document.getElementById("catalog-count").textContent =
            visibles === 1 ? "1 producto" : `${visibles} productos`;
        document.getElementById("catalog-empty").hidden = visibles > 0;
    }

    function seleccionarLinea(idLinea) {
        estado.linea = idLinea;
        document.querySelectorAll("#catalog-tabs button").forEach(boton => {
            const activo = boton.dataset.linea === idLinea;
            boton.classList.toggle("is-active", activo);
            boton.setAttribute("aria-pressed", String(activo));
        });
        aplicarFiltros();
    }

    function limpiarBusqueda() {
        estado.busqueda = "";
        document.getElementById("catalog-search").value = "";
    }

    function crearPestanas() {
        const pestanas = [{ id: "todos", valor: "Todos" }, ...LINEAS];
        document.getElementById("catalog-tabs").innerHTML = pestanas.map(linea =>
            `<button type="button" class="tab" data-linea="${linea.id}">${escaparHTML(linea.valor)}</button>`
        ).join("");
    }

    function configurarEventos() {
        const grid = document.getElementById("products-grid");

        document.getElementById("catalog-tabs").addEventListener("click", evento => {
            const boton = evento.target.closest("button[data-linea]");
            if (boton) seleccionarLinea(boton.dataset.linea);
        });

        document.getElementById("catalog-search").addEventListener("input", evento => {
            estado.busqueda = evento.target.value;
            // Al escribir se busca en todo el catálogo; luego una pestaña puede acotar
            if (estado.busqueda.trim() && estado.linea !== "todos") {
                seleccionarLinea("todos");
            } else {
                aplicarFiltros();
            }
        });

        document.getElementById("catalog-reset").addEventListener("click", () => {
            limpiarBusqueda();
            seleccionarLinea("todos");
        });

        // Accesos rápidos por línea (hero)
        document.querySelectorAll("[data-filtrar]").forEach(enlace => {
            enlace.addEventListener("click", () => {
                limpiarBusqueda();
                seleccionarLinea(enlace.dataset.filtrar);
            });
        });

        // El botón del nombre cubre toda la tarjeta
        grid.addEventListener("click", evento => {
            const boton = evento.target.closest(".product-card__open");
            if (boton) abrirDetalle(boton.closest(".product-card"));
        });
    }

    /** Dibuja el catálogo y devuelve los artículos cargados */
    async function iniciar() {
        const grid = document.getElementById("products-grid");
        let productos;

        try {
            productos = await obtenerProductos();
        } catch (error) {
            console.error("No se pudo cargar el catálogo:", error);
            grid.innerHTML = `<p class="catalog__error">No pudimos cargar el catálogo. Escríbenos por WhatsApp y te ayudamos.</p>`;
            return null;
        }

        grupos = agruparProductos(productos);
        grid.innerHTML = grupos.map(crearTarjeta).join("");

        crearPestanas();
        configurarDetalle();
        configurarEventos();
        seleccionarLinea("todos");

        return productos;
    }

    return { iniciar, LINEAS };
})();
