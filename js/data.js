import dinastia from "./data/dinastia.js";
import haren from "./data/haren.js";
import gobierno from "./data/gobierno.js";
import administracion from "./data/administracion.js";
import nobleza from "./data/nobleza.js";

const TOPKAPI = {
  characters: [
    ...dinastia,
    ...haren.characters,
    ...administracion.characters,
    ...nobleza.characters
  ],
  offices: gobierno.offices,
  positions: administracion.positions
};

export default TOPKAPI;
