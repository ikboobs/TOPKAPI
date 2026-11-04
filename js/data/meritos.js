// Sistema de méritos competitivos de Topkapı Palace.
// Los resultados se registran aquí; no se editan desde la página pública.
const MERIT_SYSTEM_DATA = {
  recognizedBy: "el Sultán",
  thresholds: {
    star: 75,
    promotion: 150
  },
  games: [
    { id: "batalla-naval", name: "Batalla naval", points: 15 },
    { id: "tiro-arco", name: "Tiro con arco", points: 10 },
    { id: "bankroll", name: "Bankroll", points: 10 },
    { id: "domino", name: "Dominó", points: 5 },
    { id: "ludo", name: "Ludo", points: 5 },
    { id: "ocho", name: "Ocho", points: 5 },
    { id: "gofish", name: "Go Fish", points: 5 }
  ],
  // Añadir aquí los resultados oficiales. Los puntos de los Şehzades se
  // suman a sus méritos históricos; los demás participantes usan el
  // contador militar y estratégico.
  entries: [
    // Ejemplo de registro (quitar los // para utilizarlo):
    { participantId: "arata", gameId: "tiro-arco", month: "Noviembre", year: "12" },
    { participantId: "arata", gameId: "batalla-naval", month: "Noviembre", year: "12" }
  ]
};

export default MERIT_SYSTEM_DATA;
