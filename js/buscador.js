/* ==========================================================================
   BUSCADOR
   Encuentra productos aunque el cliente escriba en plural o femenino, use la
   línea, la presentación o la medida, o cometa un error de escritura.
   Si buscas un producto y no aparece, agrega la palabra en SINONIMOS o en
   PALABRAS_POR_LINEA.
   ========================================================================== */
const Buscador = (() => {
    // Palabras que no ayudan a distinguir productos
    const PALABRAS_VACIAS = new Set([
        "a", "al", "color", "con", "de", "del", "el", "en", "la", "las", "los", "o", "para", "pintar", "por", "un", "una", "y"
    ]);

    // Otras formas de escribir una palabra: "lo que escribe": "lo que se busca"
    const SINONIMOS = {
        "tiner": "thinner",
        "tinner": "thinner",
        "thiner": "thinner",
        "solvente": "diluyente",
        "1/4": "cuarto"
    };

    // Palabras de uso común que no aparecen en el nombre del producto
    const PALABRAS_POR_LINEA = {
        "Látex": "pintura pared vinilica agua",
        "Aceite": "pintura esmalte",
        "Anticorrosivo": "pintura metal hierro",
        "Brochas": "pulgadas",
        "Felpas": "pulgadas rodillo"
    };

    // Igual que las anteriores, según una palabra del nombre
    const PALABRAS_POR_NOMBRE = [
        { si: "esmalte", agrega: "pintura" },   // el thinner no es pintura
        { si: "felpa", agrega: "rodillo" }
    ];

    const indices = new WeakMap();

    /** Minúsculas y sin tildes, para comparar textos */
    function normalizar(texto) {
        return String(texto).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
    }

    function separarPalabras(texto) {
        return normalizar(texto).split(/[^a-z0-9]+/).filter(Boolean);
    }

    /** Palabras de un artículo: las propias y, aparte, las de su categoría */
    function indexar(articulo) {
        if (indices.has(articulo)) return indices.get(articulo);

        const codigo = normalizar(articulo.cve_art);
        const propias = [
            ...separarPalabras(articulo.descripcion),
            ...separarPalabras(articulo.presentacion),
            // Las fracciones se guardan enteras para encontrar "3/8" o "1/2"
            ...normalizar(articulo.presentacion).split(/[\s"]+/).filter(parte => parte.includes("/")),
            ...separarPalabras(articulo.marca),
            ...separarPalabras(codigo),
            codigo,
            codigo.replace(/-/g, "")
        ];
        const agregadas = PALABRAS_POR_NOMBRE
            .filter(regla => propias.includes(regla.si))
            .map(regla => regla.agrega);
        const amplias = [
            ...propias,
            ...separarPalabras(articulo.linea),
            ...separarPalabras(PALABRAS_POR_LINEA[articulo.linea] || ""),
            ...agregadas
        ];

        const indice = { propias, amplias };
        indices.set(articulo, indice);
        return indice;
    }

    /** La palabra escrita y sus formas en singular, masculino o femenino */
    function variantes(termino) {
        const bases = [termino];
        if (termino.length >= 4 && termino.endsWith("s")) bases.push(termino.slice(0, -1));
        if (termino.length >= 6 && termino.endsWith("es")) bases.push(termino.slice(0, -2));

        const formas = new Set();
        bases.forEach(base => {
            formas.add(base);
            if (SINONIMOS[base]) formas.add(SINONIMOS[base]);
            if (base.length >= 4 && base.endsWith("a")) formas.add(`${base.slice(0, -1)}o`);
            if (base.length >= 4 && base.endsWith("o")) formas.add(`${base.slice(0, -1)}a`);
        });
        return [...formas];
    }

    function separarTerminos(texto) {
        return normalizar(texto)
            .replace(/(\d)\s*(pulgadas?\b|pulg\b|["'“”″’]+)/g, "$1 ") // 4", 4 pulg
            .split(/[^a-z0-9/-]+/)
            .map(termino => termino.replace(/^[-/]+|[-/]+$/g, ""))
            .filter(termino => termino && !PALABRAS_VACIAS.has(termino))
            .map(termino => ({ original: termino, formas: variantes(termino) }));
    }

    function contiene(palabra, forma) {
        // Un número corto es una medida: "4" no debe encontrar el código 400
        if (/^\d{1,2}$/.test(forma)) return palabra === forma;
        if (forma.length < 3) return palabra.startsWith(forma);
        return palabra.includes(forma);
    }

    /* -------------------------- Errores de escritura ----------------------- */

    // Iguala letras que suenan igual en español
    function sonido(palabra) {
        return palabra.replace(/ll/g, "y").replace(/v/g, "b").replace(/z/g, "s").replace(/c(?=[ei])/g, "s");
    }

    /** Una sola letra de diferencia: cambiada, de más, de menos o invertida */
    function casiIgual(a, b) {
        if (Math.abs(a.length - b.length) > 1) return false;
        let i = 0;
        while (i < a.length && a[i] === b[i]) i++;

        if (a.length === b.length) {
            return a.slice(i + 1) === b.slice(i + 1)
                || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2));
        }
        const [larga, corta] = a.length > b.length ? [a, b] : [b, a];
        return larga.slice(i + 1) === corta.slice(i);
    }

    function seParece(palabra, termino) {
        const formas = termino.endsWith("s") ? [termino, termino.slice(0, -1)] : [termino];
        return formas.some(forma =>
            /^[a-z]{5,}$/.test(forma) && (sonido(forma) === sonido(palabra) || casiIgual(forma, palabra))
        );
    }

    /* ------------------------------- Búsqueda ------------------------------ */

    // De lo más preciso a lo más amplio. Se usa el primer nivel con resultados,
    // así "esmalte" muestra los esmaltes y "aceite" muestra toda su línea.
    const NIVELES = [
        { campo: "propias", aproximado: false },
        { campo: "amplias", aproximado: false },
        { campo: "propias", aproximado: true },
        { campo: "amplias", aproximado: true }
    ];

    function cumple(articulo, terminos, { campo, aproximado }) {
        const palabras = indexar(articulo)[campo];
        return terminos.every(termino => palabras.some(palabra =>
            termino.formas.some(forma => contiene(palabra, forma))
            || (aproximado && seParece(palabra, termino.original))
        ));
    }

    /**
     * Recibe los grupos del catálogo y el texto escrito. Devuelve un Map con
     * cada grupo encontrado y sus artículos que coinciden con la búsqueda.
     */
    function buscar(grupos, texto) {
        const terminos = separarTerminos(texto);
        if (!terminos.length) return new Map(grupos.map(grupo => [grupo, grupo.articulos]));

        for (const nivel of NIVELES) {
            const resultado = new Map();
            grupos.forEach(grupo => {
                const coinciden = grupo.articulos.filter(articulo => cumple(articulo, terminos, nivel));
                if (coinciden.length) resultado.set(grupo, coinciden);
            });
            if (resultado.size) return resultado;
        }
        return new Map();
    }

    return { buscar };
})();
