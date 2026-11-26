/* ==========================================================================
   CATÁLOGO INTERACTIVO
   Carga los artículos, los agrupa en tarjetas y aplica filtros y búsqueda.
   ========================================================================== */
const Catalogo = (() => {
    // `valor` debe coincidir exactamente con el campo `linea` de los datos
    const LINEAS = [
        { id: "vinilicas", valor: "Vinílicas / Agua" },
        { id: "esmaltes", valor: "Aceite / Esmaltes" },
        { id: "anticorrosivos", valor: "Anticorrosivos" },
        { id: "herramientas", valor: "Brochas y Felpas (Herramientas)" }
    ];

    // Orden de las presentaciones; las medidas de herramientas van por tamaño
    const ORDEN_PRESENTACION = { "Cuarto": 1, "Galón": 2, "Cubeta": 3 };

    const estado = { linea: "todos", busqueda: "" };
    let grupos = [];

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

    /** Minúsculas y sin tildes, para comparar textos */
    function normalizar(texto) {
        return String(texto).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
    }

    function agruparProductos(productos) {
        const mapa = new Map();

        productos.forEach(producto => {
            const linea = LINEAS.find(l => l.valor === producto.linea);
            if (!linea) return;

            const llave = `${linea.id}|${producto.descripcion}`;
            if (!mapa.has(llave)) {
                mapa.set(llave, { linea, descripcion: producto.descripcion, articulos: [] });
            }
            mapa.get(llave).articulos.push(producto);
        });

        const peso = p => ORDEN_PRESENTACION[p.presentacion] || parseFloat(p.presentacion) || 99;
        const lista = [...mapa.values()];
        lista.forEach(grupo => grupo.articulos.sort((a, b) => peso(a) - peso(b)));
        lista.sort((a, b) => LINEAS.indexOf(a.linea) - LINEAS.indexOf(b.linea));
        return lista;
    }

    function crearTarjeta(grupo, indice) {
        const inicial = grupo.articulos.find(a => a.disponible) || grupo.articulos[0];
        const etiquetaOpciones = grupo.linea.id === "herramientas" ? "Medida" : "Presentación";
        const nombre = escaparHTML(grupo.descripcion);

        const opciones = grupo.articulos.map(articulo => `
            <label class="option${articulo.disponible ? "" : " option--agotado"}">
                <input type="radio" name="presentacion-${indice}" value="${escaparHTML(articulo.cve_art)}"${articulo === inicial ? " checked" : ""}>
                <span>${escaparHTML(articulo.presentacion)}</span>
            </label>
        `).join("");

        return `
            <article class="product-card" data-grupo="${indice}">
                <div class="product-card__image-box">
                    <span class="product-card__tag">${escaparHTML(grupo.linea.valor)}</span>
                    <img src="${escaparHTML(inicial.imagen)}" alt="${nombre}" class="product-card__image" loading="lazy">
                </div>
                <div class="product-card__body">
                    <h3 class="product-card__title">${nombre}</h3>

                    <fieldset class="options">
                        <legend>${etiquetaOpciones}</legend>
                        <div class="options__list">${opciones}</div>
                    </fieldset>

                    <dl class="specs">
                        <div class="specs__row">
                            <dt>Clave</dt>
                            <dd data-campo="clave"></dd>
                        </div>
                        <div class="specs__row" data-campo="fila-rendimiento">
                            <dt>Rendimiento aprox.</dt>
                            <dd data-campo="rendimiento"></dd>
                        </div>
                    </dl>

                    <p class="stock" data-campo="estado" aria-live="polite"></p>

                    <div class="product-card__footer">
                        <div class="qty">
                            <button type="button" class="qty__btn" data-accion="restar" aria-label="Restar una unidad">−</button>
                            <input type="number" class="qty__input" value="1" min="1" max="999" step="1" inputmode="numeric" aria-label="Cantidad de ${nombre}">
                            <button type="button" class="qty__btn" data-accion="sumar" aria-label="Sumar una unidad">+</button>
                        </div>
                        <button type="button" class="btn btn--primary btn--sm product-card__add" data-accion="agregar"></button>
                    </div>
                </div>
            </article>
        `;
    }

    function articuloSeleccionado(tarjeta) {
        const grupo = grupos[tarjeta.dataset.grupo];
        const marcado = tarjeta.querySelector(".options input:checked");
        return grupo.articulos.find(a => a.cve_art === marcado.value);
    }

    /** Muestra clave, rendimiento y disponibilidad de la presentación elegida */
    function actualizarTarjeta(tarjeta) {
        const articulo = articuloSeleccionado(tarjeta);
        const campo = nombre => tarjeta.querySelector(`[data-campo="${nombre}"]`);

        campo("clave").textContent = articulo.cve_art;
        campo("rendimiento").textContent = articulo.rendimiento || "";
        campo("fila-rendimiento").hidden = !articulo.rendimiento;

        const stock = campo("estado");
        stock.textContent = articulo.disponible ? "Disponible" : "Agotado por el momento";
        stock.classList.toggle("stock--agotado", !articulo.disponible);

        const boton = tarjeta.querySelector(".product-card__add");
        boton.disabled = !articulo.disponible;
        boton.textContent = articulo.disponible ? "Agregar" : "Agotado";

        tarjeta.querySelector(".product-card__image").src = articulo.imagen;
    }

    function aplicarFiltros() {
        const terminos = normalizar(estado.busqueda).split(/\s+/).filter(Boolean);
        let visibles = 0;

        document.querySelectorAll("#products-grid .product-card").forEach(tarjeta => {
            const grupo = grupos[tarjeta.dataset.grupo];
            const claves = grupo.articulos.map(a => normalizar(a.cve_art));
            const texto = [normalizar(grupo.descripcion), ...claves, ...claves.map(c => c.replace(/-/g, ""))].join(" ");

            const coincideLinea = estado.linea === "todos" || grupo.linea.id === estado.linea;
            const coincide = coincideLinea && terminos.every(t => texto.includes(t));

            tarjeta.hidden = !coincide;
            if (!coincide) return;
            visibles++;

            // Si se busca una clave concreta, se selecciona esa presentación
            const terminosClave = terminos.filter(t => t.length >= 6 && /\d/.test(t));
            const porClave = grupo.articulos.filter(a => {
                const clave = normalizar(a.cve_art);
                return terminosClave.some(t => clave.includes(t) || clave.replace(/-/g, "").includes(t));
            });
            if (porClave.length === 1) {
                const radio = [...tarjeta.querySelectorAll(".options input")].find(r => r.value === porClave[0].cve_art);
                radio.checked = true;
                actualizarTarjeta(tarjeta);
            }
        });

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
            aplicarFiltros();
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

        grid.addEventListener("change", evento => {
            const tarjeta = evento.target.closest(".product-card");
            if (evento.target.matches(".options input")) actualizarTarjeta(tarjeta);
            if (evento.target.matches(".qty__input")) evento.target.value = limitarCantidad(evento.target.value);
        });

        grid.addEventListener("click", evento => {
            const boton = evento.target.closest("button[data-accion]");
            if (!boton) return;

            const tarjeta = boton.closest(".product-card");
            const entrada = tarjeta.querySelector(".qty__input");
            const cantidad = limitarCantidad(entrada.value);

            if (boton.dataset.accion === "sumar") entrada.value = limitarCantidad(cantidad + 1);
            if (boton.dataset.accion === "restar") entrada.value = limitarCantidad(cantidad - 1);
            if (boton.dataset.accion === "agregar") {
                Carrito.agregar(articuloSeleccionado(tarjeta).cve_art, cantidad);
                entrada.value = 1;
            }
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
        grid.querySelectorAll(".product-card").forEach(actualizarTarjeta);

        crearPestanas();
        configurarEventos();
        seleccionarLinea("todos");

        return productos;
    }

    return { iniciar, LINEAS };
})();
