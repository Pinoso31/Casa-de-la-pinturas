/* ==========================================================================
   CATÁLOGO DE PRODUCTOS (DATOS DE EJEMPLO)
   --------------------------------------------------------------------------
   Un registro por artículo (SKU), igual que en ASPEL SAE: cada presentación
   tiene su propia clave. La web agrupa en una sola tarjeta los registros que
   comparten `linea` y `descripcion`.

   Campos:
     cve_art       Clave del artículo (máximo 16 caracteres, como en SAE)
     descripcion   Nombre del producto, SIN la presentación
     linea         Vinílicas / Agua | Aceite / Esmaltes | Anticorrosivos |
                   Brochas y Felpas (Herramientas)
     presentacion  Cuarto | Galón | Cubeta (herramientas: su medida)
     rendimiento   Texto informativo; "" si no aplica
     disponible    true = "En stock" / false = "Sobre pedido"
     imagen        Ruta o URL de la imagen

   IMPORTANTE: claves, rendimientos y existencias son ficticios y deben
   validarse contra el inventario real. No se incluyen precios.
   ========================================================================== */
const PRODUCTOS_SAE = [
    /* ---------------------------- Vinílicas / Agua ---------------------------- */
    { cve_art: "VIN-101-CU", descripcion: "Vinílica Premium Blanco", linea: "Vinílicas / Agua", presentacion: "Cuarto", rendimiento: "9 a 10 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },
    { cve_art: "VIN-101-GL", descripcion: "Vinílica Premium Blanco", linea: "Vinílicas / Agua", presentacion: "Galón", rendimiento: "35 a 40 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },
    { cve_art: "VIN-101-CB", descripcion: "Vinílica Premium Blanco", linea: "Vinílicas / Agua", presentacion: "Cubeta", rendimiento: "175 a 200 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },

    { cve_art: "VIN-205-GL", descripcion: "Vinílica Estándar Hueso", linea: "Vinílicas / Agua", presentacion: "Galón", rendimiento: "28 a 32 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },
    { cve_art: "VIN-205-CB", descripcion: "Vinílica Estándar Hueso", linea: "Vinílicas / Agua", presentacion: "Cubeta", rendimiento: "140 a 160 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },

    { cve_art: "ACR-310-CU", descripcion: "Látex Acrílico Exterior Beige Arena", linea: "Vinílicas / Agua", presentacion: "Cuarto", rendimiento: "8 a 9 m² por mano", disponible: false, imagen: "assets/productos/vinilica.svg" },
    { cve_art: "ACR-310-GL", descripcion: "Látex Acrílico Exterior Beige Arena", linea: "Vinílicas / Agua", presentacion: "Galón", rendimiento: "32 a 36 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },
    { cve_art: "ACR-310-CB", descripcion: "Látex Acrílico Exterior Beige Arena", linea: "Vinílicas / Agua", presentacion: "Cubeta", rendimiento: "160 a 180 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },

    { cve_art: "SEL-400-GL", descripcion: "Sellador Acrílico para Paredes", linea: "Vinílicas / Agua", presentacion: "Galón", rendimiento: "30 a 35 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },
    { cve_art: "SEL-400-CB", descripcion: "Sellador Acrílico para Paredes", linea: "Vinílicas / Agua", presentacion: "Cubeta", rendimiento: "150 a 175 m² por mano", disponible: true, imagen: "assets/productos/vinilica.svg" },

    /* --------------------------- Aceite / Esmaltes ---------------------------- */
    { cve_art: "ESM-110-CU", descripcion: "Esmalte Sintético Brillante Blanco", linea: "Aceite / Esmaltes", presentacion: "Cuarto", rendimiento: "8 a 10 m² por mano", disponible: true, imagen: "assets/productos/esmalte.svg" },
    { cve_art: "ESM-110-GL", descripcion: "Esmalte Sintético Brillante Blanco", linea: "Aceite / Esmaltes", presentacion: "Galón", rendimiento: "35 a 40 m² por mano", disponible: true, imagen: "assets/productos/esmalte.svg" },
    { cve_art: "ESM-110-CB", descripcion: "Esmalte Sintético Brillante Blanco", linea: "Aceite / Esmaltes", presentacion: "Cubeta", rendimiento: "175 a 200 m² por mano", disponible: false, imagen: "assets/productos/esmalte.svg" },

    { cve_art: "ESM-190-CU", descripcion: "Esmalte Sintético Brillante Negro", linea: "Aceite / Esmaltes", presentacion: "Cuarto", rendimiento: "9 a 11 m² por mano", disponible: true, imagen: "assets/productos/esmalte.svg" },
    { cve_art: "ESM-190-GL", descripcion: "Esmalte Sintético Brillante Negro", linea: "Aceite / Esmaltes", presentacion: "Galón", rendimiento: "38 a 42 m² por mano", disponible: true, imagen: "assets/productos/esmalte.svg" },

    { cve_art: "MAD-220-CU", descripcion: "Esmalte para Madera Caoba", linea: "Aceite / Esmaltes", presentacion: "Cuarto", rendimiento: "8 a 10 m² por mano", disponible: true, imagen: "assets/productos/esmalte.svg" },
    { cve_art: "MAD-220-GL", descripcion: "Esmalte para Madera Caoba", linea: "Aceite / Esmaltes", presentacion: "Galón", rendimiento: "32 a 38 m² por mano", disponible: true, imagen: "assets/productos/esmalte.svg" },

    { cve_art: "SOL-500-CU", descripcion: "Diluyente Thinner Corriente", linea: "Aceite / Esmaltes", presentacion: "Cuarto", rendimiento: "", disponible: true, imagen: "assets/productos/esmalte.svg" },
    { cve_art: "SOL-500-GL", descripcion: "Diluyente Thinner Corriente", linea: "Aceite / Esmaltes", presentacion: "Galón", rendimiento: "", disponible: true, imagen: "assets/productos/esmalte.svg" },
    { cve_art: "SOL-500-CB", descripcion: "Diluyente Thinner Corriente", linea: "Aceite / Esmaltes", presentacion: "Cubeta", rendimiento: "", disponible: true, imagen: "assets/productos/esmalte.svg" },

    /* ----------------------------- Anticorrosivos ----------------------------- */
    { cve_art: "ANT-610-CU", descripcion: "Anticorrosivo Rojo Óxido", linea: "Anticorrosivos", presentacion: "Cuarto", rendimiento: "7 a 9 m² por mano", disponible: true, imagen: "assets/productos/anticorrosivo.svg" },
    { cve_art: "ANT-610-GL", descripcion: "Anticorrosivo Rojo Óxido", linea: "Anticorrosivos", presentacion: "Galón", rendimiento: "30 a 35 m² por mano", disponible: true, imagen: "assets/productos/anticorrosivo.svg" },
    { cve_art: "ANT-610-CB", descripcion: "Anticorrosivo Rojo Óxido", linea: "Anticorrosivos", presentacion: "Cubeta", rendimiento: "150 a 175 m² por mano", disponible: true, imagen: "assets/productos/anticorrosivo.svg" },

    { cve_art: "ANT-620-CU", descripcion: "Anticorrosivo Gris", linea: "Anticorrosivos", presentacion: "Cuarto", rendimiento: "7 a 9 m² por mano", disponible: true, imagen: "assets/productos/anticorrosivo.svg" },
    { cve_art: "ANT-620-GL", descripcion: "Anticorrosivo Gris", linea: "Anticorrosivos", presentacion: "Galón", rendimiento: "30 a 35 m² por mano", disponible: true, imagen: "assets/productos/anticorrosivo.svg" },
    { cve_art: "ANT-620-CB", descripcion: "Anticorrosivo Gris", linea: "Anticorrosivos", presentacion: "Cubeta", rendimiento: "150 a 175 m² por mano", disponible: false, imagen: "assets/productos/anticorrosivo.svg" },

    { cve_art: "ANT-690-GL", descripcion: "Anticorrosivo Industrial Negro", linea: "Anticorrosivos", presentacion: "Galón", rendimiento: "28 a 32 m² por mano", disponible: true, imagen: "assets/productos/anticorrosivo.svg" },
    { cve_art: "ANT-690-CB", descripcion: "Anticorrosivo Industrial Negro", linea: "Anticorrosivos", presentacion: "Cubeta", rendimiento: "140 a 160 m² por mano", disponible: true, imagen: "assets/productos/anticorrosivo.svg" },

    /* -------------------- Brochas y Felpas (Herramientas) --------------------- */
    { cve_art: "BRO-700-02", descripcion: "Brocha Profesional Cerda Natural", linea: "Brochas y Felpas (Herramientas)", presentacion: "2\"", rendimiento: "", disponible: true, imagen: "assets/productos/brocha.svg" },
    { cve_art: "BRO-700-03", descripcion: "Brocha Profesional Cerda Natural", linea: "Brochas y Felpas (Herramientas)", presentacion: "3\"", rendimiento: "", disponible: true, imagen: "assets/productos/brocha.svg" },
    { cve_art: "BRO-700-04", descripcion: "Brocha Profesional Cerda Natural", linea: "Brochas y Felpas (Herramientas)", presentacion: "4\"", rendimiento: "", disponible: true, imagen: "assets/productos/brocha.svg" },

    { cve_art: "FEL-810-04", descripcion: "Felpa para Superficie Lisa", linea: "Brochas y Felpas (Herramientas)", presentacion: "4\"", rendimiento: "", disponible: true, imagen: "assets/productos/felpa.svg" },
    { cve_art: "FEL-810-09", descripcion: "Felpa para Superficie Lisa", linea: "Brochas y Felpas (Herramientas)", presentacion: "9\"", rendimiento: "", disponible: true, imagen: "assets/productos/felpa.svg" },

    { cve_art: "FEL-830-09", descripcion: "Felpa para Superficie Rugosa", linea: "Brochas y Felpas (Herramientas)", presentacion: "9\"", rendimiento: "", disponible: true, imagen: "assets/productos/felpa.svg" },

    { cve_art: "ROD-900-09", descripcion: "Rodillo Completo con Maneral", linea: "Brochas y Felpas (Herramientas)", presentacion: "9\"", rendimiento: "", disponible: false, imagen: "assets/productos/felpa.svg" }
];
