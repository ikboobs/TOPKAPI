import dinastia from "./data/dinastia.js";
import gobierno from "./data/gobierno.js";
import haren from "./data/haren.js";
import mujeres from "./data/mujeres.js";
import hombres from "./data/hombres.js";
import { offices, sections } from "./data/estructura.js";

const TOPKAPI = { characters: [...dinastia, ...gobierno, ...haren, ...mujeres, ...hombres], offices, sections };
export default TOPKAPI;
