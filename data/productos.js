/* ==========================================================================
   CATÁLOGO DE PRODUCTOS
   --------------------------------------------------------------------------
   Cada producto se escribe una sola vez y al final se convierte en un
   registro por artículo (SKU), igual que en ASPEL SAE.

   CÓDIGO COMPLETO: {marca}-{número de línea}-{tamaño}
     Marca:   C = Corona | M = Modelo | L = Lanco | S = Sur
     Tamaño:  04 = Cuarto | 05 = Galón | 01 = Cubeta
   Ejemplo:   M-70-05 = Modelo, línea 70, galón

   NÚMEROS DE LÍNEA
     Pinturas: tomados del número de serie de Modelo (70MZ -> 70).
     Brochas y felpas: 701 a 704 y 801 son PROVISIONALES, el fabricante no
     publica número de línea. En ellas el final del código es la medida.

   IMÁGENES
     Fotos por presentación de sinsa.com.ni; el resto, de pinturasmodelo.com.
     Se cargan desde esos sitios. Si una falla, se usa la de respaldo.
     `referencial: true` = la foto no corresponde exactamente a ese tamaño.

   La disponibilidad queda en `null` ("Consultar") hasta validarla con el
   inventario real. No se incluyen precios.
   ========================================================================== */
const PRODUCTOS_SAE = (() => {
    const MARCAS = { C: "Corona", M: "Modelo", L: "Lanco", S: "Sur" };

    const TAMANOS = [
        { clave: "cuarto", codigo: "04", nombre: "Cuarto" },
        { clave: "galon", codigo: "05", nombre: "Galón" },
        { clave: "cubeta", codigo: "01", nombre: "Cubeta" }
    ];

    // Imagen local que se muestra si no cargan las de internet
    const RESPALDO_LOCAL = {
        "Látex": "assets/productos/vinilica.svg",
        "Aceite": "assets/productos/esmalte.svg",
        "Anticorrosivo": "assets/productos/anticorrosivo.svg",
        "Madera": "assets/productos/esmalte.svg",
        "Especialidades": "assets/productos/vinilica.svg",
        "Brochas": "assets/productos/brocha.svg",
        "Felpas": "assets/productos/felpa.svg"
    };

    const oficial = ruta => `https://www.pinturasmodelo.com/images/productos/${ruta}`;
    const tienda = ruta => `https://b2csinsa.vteximg.com.br/arquivos/ids/${ruta}`;

    /* ------------------------------- Pinturas -------------------------------
       fotos: una por tamaño, si existe. cuartoReferencial: la foto del cuarto
       muestra la etiqueta de galón.
       ---------------------------------------------------------------------- */
    const PINTURAS = [
        /* Látex */
        {
            marca: "M", numero: "70", categoria: "Látex", nombre: "Acrílica Universal",
            oficial: oficial("universal/Acrilica-Universal.jpg"),
            fotos: {
                cuarto: tienda("841292/101052310-1.jpg?v=639130415760100000"),
                galon: tienda("630646/100968959-1.jpg?v=638955728952470000"),
                cubeta: tienda("947053/100781342-1.jpg?v=639191135867230000")
            },
            cuartoReferencial: true,
            uso: "Decoración en exteriores e interiores: concreto, repello, block y mampostería.",
            beneficios: ["Excelente cubrimiento", "Fácil de aplicar y lavable", "Alta duración", "Hasta 3000 colores entintados, mate y satinado"],
            rendimiento: "37 m² por galón a una mano",
            secado: "Al tacto en 1 hora; repintado de 3 a 4 horas"
        },
        {
            marca: "M", numero: "30", categoria: "Látex", nombre: "Óptima Látex Mate",
            oficial: oficial("universal/Latex-Mate.jpg"),
            fotos: {
                galon: tienda("839772/100407852-1.jpg?v=639130218661170000"),
                cubeta: tienda("839762/100407836-1.jpg?v=639130218256500000")
            },
            uso: "Interiores y exteriores protegidos: concreto, repello, block y mampostería.",
            beneficios: ["Alto cubrimiento", "Fácil de aplicar y lavable", "Alta duración", "Hasta 3000 colores entintados, mate y satinado"],
            rendimiento: "28 m² por galón a una mano",
            secado: "Al tacto en 1 hora; repintado de 3 a 4 horas"
        },
        {
            marca: "M", numero: "4", categoria: "Látex", nombre: "Arquitex Látex",
            oficial: oficial("universal/Arquitex.jpg"),
            fotos: {
                galon: tienda("841654/130293091-1.jpg?v=639130499367600000"),
                cubeta: tienda("988644/100407844-1.jpg?v=639302058624570000")
            },
            uso: "Interiores y exteriores protegidos: tabla yeso, fibrocemento, concreto y block.",
            beneficios: ["Buen cubrimiento", "Fácil de aplicar", "Acabado mate"],
            rendimiento: "21.5 m² por galón a una mano",
            secado: "Al tacto en 1 hora; repintado de 3 a 4 horas"
        },

        /* Aceite */
        {
            marca: "M", numero: "1", categoria: "Aceite", nombre: "Óptima Esmalte Brillante",
            oficial: oficial("universal/OptimaEsmalteBrillante.jpg"),
            fotos: {
                cuarto: tienda("841253/101051499-1.jpg?v=639130400460730000"),
                galon: tienda("935367/141817954-1.jpg?v=639178919978070000"),
                cubeta: tienda("839903/100420002-1.jpg?v=639130244917970000")
            },
            cuartoReferencial: true,
            uso: "Metal, mampostería, block y madera en exteriores e interiores.",
            beneficios: ["Color duradero", "Resiste desgaste, abrasión, lavado e intemperie", "Apto para trabajo pesado en ambientes moderados", "Acabado brillante"],
            rendimiento: "29 m² por galón a una mano",
            secado: "Al tacto de 3 a 4 horas; repintado de 8 a 12 horas"
        },
        {
            marca: "M", numero: "8", categoria: "Aceite", nombre: "Arquitex Esmalte",
            oficial: oficial("universal/arquitex-aceite.jpg"),
            fotos: {
                galon: tienda("988820/100445883-1.jpg?v=639302068763470000"),
                cubeta: tienda("881140/100419992-1.jpg?v=639139198983930000")
            },
            uso: "Hierro negro en rejas, portones, barandas y techos, en exteriores e interiores.",
            beneficios: ["Buena adherencia y cubrimiento", "Buena resistencia al agua", "Alta durabilidad", "Acabado brillante"],
            rendimiento: "23 m² por galón a una mano",
            secado: "Al tacto de 3 a 4 horas; repintado de 8 a 12 horas"
        },

        /* Anticorrosivo */
        {
            marca: "M", numero: "95", categoria: "Anticorrosivo", nombre: "Oxi-Fin",
            oficial: oficial("universal/oxifin.jpg"),
            fotos: {
                galon: tienda("879962/130293104-1.jpg?v=639138975002600000"),
                cubeta: tienda("994875/125569330-1.jpg?v=639302830705370000")
            },
            uso: "Base agua para hierro, estructuras galvanizadas y aluminio.",
            beneficios: ["Resiste intemperie urbana e industrial liviana", "Protege por barrera e inhibición química", "Se diluye con agua", "Alta adherencia en metal"],
            rendimiento: "46 m² por galón a una mano",
            secado: "Al tacto en 1 hora; repintado de 3 a 4 horas"
        },
        {
            marca: "M", numero: "91", categoria: "Anticorrosivo", nombre: "Anticorrosivo Industrial",
            oficial: oficial("universal/anticorrosivo-industrial.jpg"),
            fotos: {
                cuarto: tienda("840985/100950097-1.jpg?v=639130386683300000"),
                galon: tienda("876847/100897927-1.jpg?v=639138370572500000"),
                cubeta: tienda("962705/100867980-1.jpg?v=639238106141430000")
            },
            cuartoReferencial: true,
            uso: "Hierro negro en tanques, rejas, portones, barandas y techos. También funciona como primario.",
            beneficios: ["Inhibe la corrosión y protege por barrera", "Buena adhesión", "Resiste la intemperie", "Acabado semi-brillante"],
            rendimiento: "27 m² por galón a una mano",
            secado: "Al tacto de 3 a 4 horas; repintado de 8 a 12 horas"
        },
        {
            marca: "M", numero: "50", categoria: "Anticorrosivo", nombre: "Óptima Fast Dry",
            oficial: oficial("anticorrosivos/Optima-Fast-Dry.jpg"),
            fotos: {
                galon: tienda("618806/127592517-1.jpg?v=638954137857200000")
            },
            uso: "Acero estructural en ambientes de corrosión moderada: puertas, balcones y vallas.",
            beneficios: ["Secado rápido", "Gran durabilidad", "Buena dureza de película", "Acabado brillante"],
            rendimiento: "23 m² por galón a una mano",
            secado: "Al tacto de 20 a 30 minutos; repintado de 2 a 3 horas"
        },

        /* Madera */
        {
            marca: "M", numero: "9", categoria: "Madera", nombre: "Barniz Interiores",
            oficial: oficial("universal/barniz-interiores.jpg"),
            fotos: {
                cuarto: tienda("841291/101051991-1.jpg?v=639130409559900000"),
                galon: tienda("990222/100681288-1.jpg?v=639302282828800000")
            },
            uso: "Maderas preciosas, comerciales y plywood en interiores: muebles, puertas, ventanas y cielos.",
            beneficios: ["Protege contra golpes y rayones", "Disimula imperfecciones", "Acabado brillante", "Variedad de tonos"],
            rendimiento: "47 m² por galón a una mano",
            secado: "Al tacto de 5 a 15 minutos; total de 4 a 6 horas"
        },
        {
            marca: "M", numero: "950", categoria: "Madera", nombre: "Barniz Marino",
            oficial: oficial("universal/barniz-marino.jpg"),
            fotos: {
                galon: tienda("880903/100410621-1.jpg?v=639139132718730000")
            },
            uso: "Muebles, paredes de madera, machimbres y ventanas, en interiores y exteriores protegidos.",
            beneficios: ["Acabado mate", "Alta resistencia a la abrasión", "Resiste el agua y la luz UV no directa", "Gran durabilidad"],
            rendimiento: "50 m² por galón a una mano",
            secado: "Al tacto de 5 a 15 minutos; total de 4 a 6 horas"
        },
        {
            marca: "M", numero: "11055", categoria: "Madera", nombre: "Sellador para Madera",
            oficial: oficial("universal/sellador-para-madera.jpg"),
            fotos: {
                cuarto: tienda("841579/125318514-1.jpg?v=639130462657200000"),
                galon: tienda("841568/125316586-1.jpg?v=639130461450600000")
            },
            cuartoReferencial: true,
            uso: "Carpintería y ebanistería. No apto para climas muy calientes o fríos.",
            beneficios: ["Rellena el poro de la madera", "Fácil de lijar", "Secado rápido", "Alto rendimiento"],
            rendimiento: "30 m² por galón a una mano",
            secado: "Al tacto de 5 a 15 minutos; total 1 hora"
        },
        {
            marca: "M", numero: "180", categoria: "Madera", nombre: "Tinte para Madera",
            oficial: oficial("universal/tinte-para-madera.jpg"),
            fotos: {
                cuarto: tienda("1002508/130293260-1.jpg?v=639304771475500000"),
                galon: tienda("1002502/130293198-1.jpg?v=639304770936270000")
            },
            cuartoReferencial: true,
            uso: "Superficies de madera que no estén expuestas a la intemperie.",
            beneficios: ["Muy buena penetración", "Acentúa el color de la madera", "Listo para aplicar", "Diversidad de colores"],
            rendimiento: "",
            secado: "Al tacto en 5 minutos; total 1 hora"
        },

        /* Especialidades */
        {
            marca: "M", numero: "5504", categoria: "Especialidades", nombre: "Verde Pizarra",
            oficial: oficial("universal/verdepizarra.jpg"),
            fotos: {},
            uso: "Elaboración de pizarras sobre madera o concreto liso en interiores.",
            beneficios: ["Facilita escribir con tiza", "Buen contraste para la lectura", "Se puede lavar", "Gran adherencia"],
            rendimiento: "53 m² por galón a una mano",
            secado: "Al tacto de 45 a 50 minutos; lista para usar en 72 horas"
        },
        {
            marca: "M", numero: "45", categoria: "Especialidades", nombre: "Sellador de Pared",
            oficial: oficial("universal/sellador-universal-de-paredes.jpg"),
            fotos: {
                galon: tienda("841662/130293147-1.jpg?v=639130499851500000"),
                cubeta: tienda("969095/100414745-1.jpg?v=639246569255700000")
            },
            uso: "Sella concreto, repello, block y mampostería antes del acabado final.",
            beneficios: ["Reduce el consumo de pintura de acabado", "Mejora el anclaje", "Resiste agua y álcalis"],
            rendimiento: "36 m² por galón a una mano",
            secado: "Al tacto en 1 hora; repintado de 3 a 4 horas"
        },
        {
            marca: "M", numero: "18", categoria: "Especialidades", nombre: "Flexotex Impermeabilizante",
            oficial: oficial("universal/flexotex.jpg"),
            fotos: {
                galon: tienda("842527/149679111-1.jpg?v=639130612106170000"),
                cubeta: tienda("997030/102213921-1.jpg?v=639303185895400000")
            },
            uso: "Barrera elástica contra la humedad en terrazas horizontales.",
            beneficios: ["Aislante térmico", "Acompaña la elongación de la superficie", "Permite reparar juntas y fisuras con malla", "Se diluye con agua"],
            rendimiento: "33 m² por galón a 2 mils de película seca",
            secado: "Al tacto de 1 a 2 horas; repintado de 5 a 7 horas"
        },
        {
            marca: "M", numero: "20", categoria: "Especialidades", nombre: "Pintura para Tráfico",
            oficial: oficial("especialidades/trafico-amarillo.jpg"),
            fotos: {
                galon: tienda("632663/125316519-1.jpg?v=638956171435970000"),
                cubeta: tienda("946991/100426279-1.jpg?v=639190506638170000")
            },
            uso: "Señalización de calles, carreteras, estacionamientos y zonas de seguridad.",
            beneficios: ["Resiste abrasión e intemperie", "Secado rápido", "Acabado mate", "Admite esferas de vidrio reflectivas"],
            rendimiento: "51 m² por galón a una mano",
            secado: "Al tacto en 30 minutos; repintado en 2 horas"
        }
    ];

    /* --------------------------- Brochas y felpas ---------------------------
       medidas: [texto, final del código, foto, número de línea si cambia]
       ---------------------------------------------------------------------- */
    const brocha = ruta => oficial(`brochas/${ruta}.png`);

    const HERRAMIENTAS = [
        {
            marca: "M", numero: "701", categoria: "Brochas", nombre: "Brocha Expert DoIt Everyday",
            uso: "Cabo plástico fundido, ferrul de aluminio niquelado y filamentos de poliéster.",
            beneficios: ["Uso profesional", "Para toda clase de pintura", "Corte recto", "Acabado uniforme"],
            medidas: [
                ["1\"", "10", tienda("880048/130293702-1.jpg?v=639138989121030000")],
                ["1.5\"", "15", tienda("880049/130293711-1.jpg?v=639138989121500000")],
                ["2\"", "20", tienda("880047/130293729-1.jpg?v=639138989120700000")],
                ["2.5\"", "25", tienda("880050/130293737-1.jpg?v=639138989121670000")],
                ["3\"", "30", tienda("880051/130293745-1.jpg?v=639138989125070000")],
                ["4\"", "40", tienda("880074/130293753-1.jpg?v=639138994491200000")]
            ]
        },
        {
            marca: "M", numero: "702", categoria: "Brochas", nombre: "Brocha Expert Elite",
            uso: "Cabo de madera barnizada tipo Flat, ferrul de aluminio niquelado y filamentos de poliéster.",
            beneficios: ["Uso general", "Para toda clase de pintura", "Corte recto", "Acabado uniforme"],
            medidas: [
                ["1\"", "10", brocha("Elite/WEB-BROCHA-ELITE-DE-1-PULGADA")],
                ["1.5\"", "15", brocha("Elite/WEB-BROCHA-ELITE-DE-15-PULGADAS")],
                ["2\"", "20", brocha("Elite/WEB-BROCHA-ELITE-DE-2-PULGADAS")],
                ["2.5\"", "25", brocha("Elite/WEB-BROCHA-ELITE-DE-25-PULGADAS")],
                ["3\"", "30", brocha("Elite/WEB-BROCHA-ELITE-DE-3-PULGADAS")],
                ["4\"", "40", brocha("Elite/WEB-BROCHA-ELITE-DE-4-PULGADAS")]
            ]
        },
        {
            marca: "M", marcaNombre: "Farbe", numero: "703", categoria: "Brochas", nombre: "Brocha Farbe 1\"",
            etiqueta: "Modelo de brocha",
            uso: "Brocha de 1 pulgada con cabo de madera, en versiones Esperto y Pittore.",
            beneficios: ["Esperto: filamento claro", "Pittore: filamento negro"],
            medidas: [
                ["Esperto 1\"", "10", tienda("905717/145518097-1.jpg?v=639222400718630000")],
                ["Pittore 1\"", "10", tienda("902479/145518038-1.jpg?v=639222400716900000"), "704"]
            ]
        },
        {
            marca: "M", numero: "801", categoria: "Felpas", nombre: "Felpa Expert",
            uso: "Superficies lisas y medias, con toda clase de pinturas.",
            beneficios: ["Anti-goteo", "Gran absorción y cobertura", "Lavable y reutilizable", "Tubo de polipropileno resistente"],
            medidas: [
                ["3/8\" x 9\"", "38", tienda("841732/130293892-1.jpg?v=639130506723700000")],
                ["1/2\" x 9\"", "12", tienda("841746/130293981-1.jpg?v=639130507155700000")],
                ["3/4\" x 9\"", "34", tienda("841726/130293905-1.jpg?v=639130506721830000")],
                ["1 1/4\" x 9\"", "114", tienda("841727/130293913-1.jpg?v=639130506722630000")]
            ]
        }
    ];

    // Imagen oficial de cada herramienta, por si falla la foto principal
    const OFICIAL_HERRAMIENTA = {
        "701": brocha("DoitEveryday/WEB-BROCHA-DO-IT-EVERYDAY-DE-4-PULGADAS"),
        "702": brocha("Elite/WEB-BROCHA-ELITE-DE-4-PULGADAS"),
        "801": oficial("felpas/expert/WEB-FELPA-EXPERT-ANTIGOTEO-1-2-PLG-X-9-PLG.png")
    };

    /* ------------------------------ Artículos ------------------------------- */

    function datosComunes(producto) {
        return {
            descripcion: producto.nombre,
            linea: producto.categoria,
            marca: producto.marcaNombre || MARCAS[producto.marca],
            uso: producto.uso,
            beneficios: producto.beneficios,
            disponible: null,
            respaldo_local: RESPALDO_LOCAL[producto.categoria]
        };
    }

    const pinturas = PINTURAS.flatMap(producto => TAMANOS.map((tamano, orden) => {
        const propia = producto.fotos[tamano.clave];
        return {
            ...datosComunes(producto),
            cve_art: `${producto.marca}-${producto.numero}-${tamano.codigo}`,
            presentacion: tamano.nombre,
            tamano: tamano.clave,
            orden,
            rendimiento: producto.rendimiento,
            secado: producto.secado,
            // Sin foto de ese tamaño se muestra la del galón o la oficial
            imagen: propia || producto.fotos.galon || producto.oficial,
            referencial: !propia || (tamano.clave === "cuarto" && Boolean(producto.cuartoReferencial)),
            respaldo: producto.oficial
        };
    }));

    const herramientas = HERRAMIENTAS.flatMap(producto =>
        producto.medidas.map(([presentacion, medida, imagen, numero], orden) => ({
            ...datosComunes(producto),
            cve_art: `${producto.marca}-${numero || producto.numero}-${medida}`,
            presentacion,
            etiqueta: producto.etiqueta || "Medida",
            orden,
            rendimiento: "",
            secado: "",
            imagen,
            referencial: false,
            respaldo: OFICIAL_HERRAMIENTA[producto.numero] || ""
        }))
    );

    return [...pinturas, ...herramientas];
})();
