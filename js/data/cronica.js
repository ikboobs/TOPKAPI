/**
 * CRÓNICA DE LA CORTE — ARCHIVO EDITABLE
 *
 * Este archivo es la única fuente de datos de méritos, sucesos y rumores.
 * Edita las listas y vuelve a publicar/subir la página para que los cambios
 * aparezcan para TODOS los visitantes.
 *
 * MÉRITOS:
 * {
 *   princeId: "arata", // IDs válidos: arata, osman, osome, shizuku
 *   points: 2,
 *   month: "enero",
 *   year: "4",
 *   reason: "Descripción de la acción reconocida por la corte."
 * }
 *
 * SUCESOS Y RUMORES:
 * {
 *   title: "Título del acontecimiento",
 *   category: "Banquete", // categoría libre: Banquete, Muerte, Alianza, etc.
 *   status: "Oficial", // usar "Oficial" o "Pasillo"
 *   month: "enero",
 *   year: "4",
 *   description: "Relato del acontecimiento."
 * }
 *
 * Los registros más recientes se muestran primero.
 * Para añadir un registro, coloca una coma después del objeto anterior.
 */

const CHRONICLE_DATA = {
  merits: [
    // Añade aquí los méritos. Ejemplo:
    // {
    //   princeId: "arata",
    //   points: 2,
    //   month: "enero",
    //   year: "4",
    //   reason: "Atendió a los heridos durante una emergencia en el palacio."
    // }
  ],

  events: [
    // Añade aquí sucesos oficiales y rumores. Ejemplo:
    // {
    //   title: "El banquete de primavera",
    //   category: "Banquete",
    //   status: "Oficial",
    //   month: "marzo",
    //   year: "4",
    //   description: "La corte se reunió en el palacio para celebrar..."
    // },
    // {
    //   title: "Un compromiso cuestionado",
    //   category: "Matrimonio o compromiso",
    //   status: "Pasillo",
    //   month: "abril",
    //   year: "4",
    //   description: "Circula el rumor de que..."
    // }
  ]
};

export default CHRONICLE_DATA;
