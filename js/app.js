import TOPKAPI from "./data.js";

const $ = (selector) => document.querySelector(selector);
const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

const people = TOPKAPI.characters;
const byId = (id) => people.find((person) => person.id === id);
const findPerson = (name) => people.find((person) => person.name.toLocaleLowerCase("es") === String(name).toLocaleLowerCase("es"));
const groupNames = {
  dinastia: "Dinastía imperial",
  gobierno: "Gobierno imperial",
  harem: "Harén imperial",
  administracion: "Administración del palacio",
  nobleza: "Nobleza y casas"
};

function portrait(person, size = "small") {
  if (!person) return `<span class="mini-portrait placeholder ${size}" aria-hidden="true">✦</span>`;
  return person.image
    ? `<img class="mini-portrait ${size}" src="images/${esc(person.image)}" alt="Retrato de ${esc(person.name)}" loading="lazy" onerror="this.outerHTML='<span class=&quot;mini-portrait placeholder ${size}&quot;>✦</span>'">`
    : `<span class="mini-portrait placeholder ${size}" aria-hidden="true">✦</span>`;
}

function tags(person) {
  return `<div class="card-tags">${person.age ? `<span class="tag">${esc(person.age)} años</span>` : ""}${person.gender ? `<span class="tag">${esc(person.gender)}</span>` : ""}${person.caste ? `<span class="tag">${esc(person.caste)}</span>` : ""}${person.aroma && person.aroma !== "No consignado" ? `<span class="tag">Aroma: ${esc(person.aroma)}</span>` : ""}</div>`;
}

function card(person) {
  return `<article class="character-card reveal" tabindex="0" role="button" data-person="${esc(person.id)}" aria-label="Abrir ficha de ${esc(person.name)}">
    <div class="character-image">${person.image ? `<img src="images/${esc(person.image)}" alt="Retrato de ${esc(person.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=&quot;image-placeholder&quot;>Retrato pendiente</div>'">` : `<div class="image-placeholder">Retrato pendiente</div>`}</div>
    <div class="character-info"><span class="rank">${esc(person.rank || "Integrante de la corte")}</span><h3>${esc(person.name)}</h3>${tags(person)}<p>${esc(person.summary || person.bio || "")}</p><span class="profile-prompt">Consultar ficha ↗</span></div>
  </article>`;
}

function section(title, description, list) {
  return `<section class="character-subsection"><div class="subsection-heading"><h3>${esc(title)}</h3>${description ? `<p>${esc(description)}</p>` : ""}</div><div class="character-grid">${list.map(card).join("") || `<p class="empty-state">No hay perfiles registrados en este apartado.</p>`}</div></section>`;
}

function personNode(id, context = "") {
  const person = byId(id);
  if (!person) return "";
  return `<button class="org-person" type="button" data-person-link="${esc(person.id)}" aria-label="Consultar ficha de ${esc(person.name)}">
    ${portrait(person)}<span class="org-person-copy"><strong>${esc(person.name)}</strong><small>${esc(context || person.rank || "Integrante de la corte")}</small></span><span class="org-open">↗</span>
  </button>`;
}

function hierarchyGroup(title, description, ids, context = "") {
  const nodes = ids.map((id) => personNode(id, context)).filter(Boolean).join("");
  return `<article class="org-branch"><h4>${esc(title)}</h4>${description ? `<p>${esc(description)}</p>` : ""}<div class="org-people">${nodes || `<span class="org-vacant">Sin integrantes registrados</span>`}</div></article>`;
}

function renderDynasty() {
  const groups = [
    { title: "Soberano", desc: "Osamu Miya, titular del sultanato y cabeza de la casa reinante.", ids: ["osamu"] },
    { title: "Dinastía Imperial", desc: "La rama de sangre imperial de la generación del soberano y sus vínculos directos. Atsumu y Otoha son hermanos de Osamu; Hiro y Kenji pertenecen a la descendencia de Otoha.", ids: ["atsumu", "otoha", "hiro", "kenji"] },
    { title: "Şehzades · Hijos del Sultán", desc: "Príncipes nacidos de Osamu y reconocidos como descendientes directos de la línea reinante.", ids: ["arata", "osman", "osome", "shizuku"] },
    { title: "Sultanas Imperiales · Hijas del Sultán", desc: "Hijas de Osamu cuyo rango imperial procede de su nacimiento dentro de la dinastía.", ids: ["atsuki", "zayan", "osuyu"] },
    { title: "Consorte Imperial", desc: "Tarae, Haseki Sultan y consorte principal de Osamu. Su posición deriva de su unión con el soberano, no del nacimiento en la dinastía.", ids: ["tarae"] }
  ];
  $("#dynastyGroups").innerHTML = groups.map((group) => section(group.title, group.desc, group.ids.map(byId).filter(Boolean))).join("");
  $("#dynastyDiagram").innerHTML = `<div class="org-chart">
    <div class="org-root"><span class="org-kicker">Casa reinante</span><h3>Osmanlı Hanedanı</h3>${personNode("osamu", "Sultán · soberano")}</div>
    <div class="org-connector"></div>
    <div class="org-columns">
      <article class="org-branch"><h4>Dinastía Imperial</h4><p>Rama colateral y descendencia de la casa imperial por línea materna.</p>
        <h5>Hermanos del Sultán · Rama Colateral</h5><div class="org-people">${personNode("atsumu", "Şehzade · hermano gemelo del sultán")}${personNode("otoha", "Sultana imperial · hermana del sultán")}</div>
        <div class="org-subbranch"><h5>Descendencia de Otoha</h5><div class="org-people">${personNode("hiro", "Sultanzade")}${personNode("kenji", "Hanımsultan")}</div></div>
      </article>
      ${hierarchyGroup("Şehzades · Hijos del Sultán", "Descendencia masculina de Osamu.", ["arata", "osman", "osome", "shizuku"])}
      ${hierarchyGroup("Sultanas Imperiales · Hijas del Sultán", "Descendencia femenina de Osamu.", ["atsuki", "zayan", "osuyu"])}
      ${hierarchyGroup("Consorte Imperial", "Haseki Sultan · consorte principal.", ["tarae"])}
    </div></div>`;
}

function renderGovernment() {
  const offices = TOPKAPI.offices;
  const officeCard = (office, index) => {
    const holder = findPerson(office.holder);
    return `<article class="office-card reveal"><p class="eyebrow">${index < 2 ? "Dîvân-ı Hümâyun · Dirección" : "Cargo del gobierno central"}</p><h3>${esc(office.name)}</h3><p class="office-subtitle">${esc(office.translation)}</p><div class="office-holder-row">${holder ? personNode(holder.id, office.translation) : `<span class="org-vacant">Responsable: ${esc(office.holder || "Vacante")}</span>`}</div><p>${esc(office.purpose)}</p></article>`;
  };
  const governmentNodes = offices.map((office) => `<article class="org-branch"><h4>${esc(office.name)}</h4><p>${esc(office.translation)} · ${esc(office.purpose)}</p><div class="org-people"><span class="org-vacant">${esc(office.holder || "Vacante")}</span></div></article>`).join("");
  $("#governmentDiagram").innerHTML = `<div class="org-chart"><div class="org-root"><span class="org-kicker">Autoridad suprema</span><h3>Sultanato de Osamu</h3>${personNode("osamu", "Sultán · cabeza del Estado")}</div><div class="org-connector"></div><div class="org-columns">${governmentNodes}</div></div>`;
  $("#officeGrid").innerHTML = offices.map(officeCard).join("");
}

function renderHarem() {
  // Otoha ejerce las funciones de Valide por delegación del sultán:
  // su autoridad se sitúa por encima de la organización de las consortes,
  // aunque su legitimidad procede de su nacimiento y no de la maternidad del soberano.
  const groups = [
    { title: "Autoridad de la casa imperial", desc: "Otoha Sultán, hermana del soberano, ejerce las funciones de Valide de facto por confianza y delegación de Osamu. No es la madre biológica del sultán.", ids: ["otoha"] },
    { title: "Haseki Sultan", desc: "Tarae ocupa el rango de consorte principal. Su precedencia dentro del harén queda inmediatamente debajo de la autoridad de la casa imperial.", ids: ["tarae"] },
    { title: "Baş Kadın", desc: "Consortes de rango elevado que siguen a la Haseki en el orden de precedencia establecido en la corte de Osamu.", ids: ["kenma", "shimizu"] },
    { title: "İkbal", desc: "Consortes favorecidas que poseen un rango reconocido dentro del harén.", ids: ["alissa", "akiko"] },
    { title: "Administración y servicio de la casa interior", desc: "Personal encargado de la coordinación doméstica, la supervisión de dependencias y las tareas de servicio.", ids: ["yaku", "kei", "shoyo"] },
    { title: "Cariye personales", desc: "Servidoras asignadas a las residencias y necesidades particulares de las mujeres de mayor rango.", ids: ["shizuka", "natsu"] }
  ];
  $("#haremPositions").innerHTML = groups.map((group) => section(group.title, group.desc, group.ids.map(byId).filter(Boolean))).join("");
  $("#haremDiagram").innerHTML = `<div class="org-chart">
    <div class="org-root"><span class="org-kicker">Autoridad superior de la casa imperial</span><h3>Valide de facto</h3>${personNode("otoha", "Otoha Sultán · hermana del sultán")}</div>
    <div class="org-connector"></div>
    <div class="org-root"><span class="org-kicker">Precedencia del harén</span><h3>Haseki Sultan</h3>${personNode("tarae", "Tarae · consorte principal")}</div>
    <div class="org-connector"></div>
    <div class="org-columns">
      ${hierarchyGroup("Baş Kadın", "Consortes de precedencia elevada.", ["kenma", "shimizu"])}
      ${hierarchyGroup("İkbal", "Consortes favorecidas.", ["alissa", "akiko"])}
      ${hierarchyGroup("Administración y servicio", "Personal de coordinación y servicio de la casa interior.", ["yaku", "kei", "shoyo"])}
      ${hierarchyGroup("Cariye personales", "Servidoras asignadas a Otoha y Tarae.", ["shizuka", "natsu"])}
    </div></div>`;
}

function renderAdministration() {
  const positions = TOPKAPI.positions;
  const node = (position) => {
    const holder = findPerson(position.holder);
    return `<article class="office-card reveal"><p class="eyebrow">${position.holder === "Vacante" ? "Cargo vacante" : "Cargo ocupado"}</p><h3>${esc(position.name)}</h3><p class="office-subtitle">${esc(position.translation)}</p><div class="office-holder-row">${holder ? personNode(holder.id, position.name) : `<span class="org-vacant">Responsable: ${esc(position.holder || "Vacante")}</span>`}</div><p>${esc(position.purpose)}</p>${position.notes ? `<p class="access-line"><strong>Notas:</strong> ${esc(position.notes)}</p>` : ""}</article>`;
  };
  $("#administrationDiagram").innerHTML = `<div class="org-chart"><div class="org-root"><span class="org-kicker">Saray-ı Hümâyun</span><h3>Servicio y administración del palacio</h3><p>Los oficios se distribuyen por responsabilidad, dependencia y acceso autorizado.</p></div><div class="org-connector"></div><div class="org-columns">
    ${hierarchyGroup("Administración y protocolo", "Accesos, portería y coordinación de servicios.", ["akiteru"])}
    ${hierarchyGroup("Jardines y espacios exteriores", "Custodia y mantenimiento de los espacios exteriores.", ["aran"])}
    ${hierarchyGroup("Protección personal", "Guardia asignada a la Haseki y a sus hijos.", ["tadashi"])}
    ${hierarchyGroup("Servicio de la casa interior", "Supervisión cotidiana de las dependencias y el personal.", ["kei", "yaku", "shizuka"])}
  </div></div>`;
  $("#administrationGrid").innerHTML = positions.map(node).join("");
  // Los responsables ya aparecen junto al oficio que desempeñan.
}

function renderNobility() {
  const houses = [
    { name: "Casa Ushijima", ids: ["tooru", "ruzgar", "rashida"], desc: "Casa noble encabezada históricamente por Wakatoshi Bey; actualmente conserva vínculos familiares registrados." },
    { name: "Casa Bokuto", ids: ["kotaro", "akaashi", "ren", "yun"], desc: "Casa vinculada a la nobleza militar y a la administración de sus dominios." },
    { name: "Casa Kuroo", ids: ["tetsuro", "daisho", "noe"], desc: "Casa con vínculos militares, comerciales y territoriales." },
    { name: "Casa Tendō", ids: ["satori", "takeshiro"], desc: "Casa individual registrada en torno a Satori Tendō." },
    { name: "Casa Sakusa", ids: ["kiyoomi"], desc: "Casa individual de rango pachá." },
    { name: "Casa Iwaizumi", ids: ["hajime"], desc: "Casa noble de tradición militar y administración de dominios." },
    { name: "Casa Haiba", ids: ["lev"], desc: "Casa de la nobleza de origen extranjero." }
  ];
  const actual = houses.map((house) => ({ ...house, members: house.ids.map(byId).filter(Boolean) })).filter((house) => house.members.length);
  $("#nobilityGroups").innerHTML = actual.map((house) => section(house.name, house.desc, house.members)).join("");
  $("#nobilityDiagram").innerHTML = `<div class="org-chart"><div class="org-root"><span class="org-kicker">Ümerâ ve Eşraf</span><h3>Casas nobles del Imperio</h3><p>Linajes, matrimonios, descendencia y servicios que vinculan a las casas con la corte.</p></div><div class="org-connector"></div><div class="org-columns">${actual.map((house) => hierarchyGroup(house.name, house.desc, house.ids)).join("")}</div></div>`;
}

const CHRONICLE_KEY = "topkapi-osamu-chronicle-v1";
const MERIT_KEY = "topkapi-osamu-merits-v1";
const eligiblePrinces = ["arata", "osman", "osome", "shizuku"].map(byId).filter(Boolean);
const readStore = (key) => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } };
const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const formatDateLabel = (month, year) => `En el mes de ${month}, del año ${year} del sultanato de Osamu I`;
const monthOptions = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
function renderChismografo() {
  const merits = readStore(MERIT_KEY);
  const totals = eligiblePrinces.map(person => ({...person, total: merits.filter(item => item.princeId === person.id).reduce((sum,item)=>sum + Number(item.points || 0),0)})).sort((x,y)=>y.total-x.total || x.name.localeCompare(y.name,"es"));
  const max = Math.max(1, ...totals.map(x=>x.total));
  const noMerits = max === 1 && totals.every(p => p.total === 0);
  const podium = noMerits ? totals : totals.slice(0,3);
  let previousTotal = null, place = 0;
  const rankingRows = totals.map((p,i) => {
    if (p.total !== previousTotal) place = i + 1;
    previousTotal = p.total;
    return `<div class="merit-row"><span class="merit-rank">${place}</span><span class="merit-name">${esc(p.name)}</span><div class="merit-track"><i style="width:${p.total ? Math.max(3,p.total/max*100) : 0}%"></i></div><strong>${p.total}</strong></div>`;
  }).join("");
  $("#successionPodium").innerHTML = `<div class="podium-grid ${noMerits?"all-contenders":""}">${podium.map((p,i)=>`<article class="podium-card ${noMerits?"":"place-"+(i+1)}"><span class="podium-place">${noMerits?"Aspirante":(i+1)+"° lugar"}</span>${portrait(p)}<strong>${esc(p.name)}</strong><small>${esc(p.rank)}</small><b>${p.total} méritos</b></article>`).join("")}</div><div class="merit-ranking">${rankingRows}</div>`;
  $("#meritHistory").innerHTML = merits.length ? [...merits].reverse().map(item=>{const prince=byId(item.princeId);return `<article class="chronicle-entry"><div class="entry-meta"><span class="tag">Mérito · ${Number(item.points)} ${Number(item.points)===1?"punto":"puntos"}</span><time>${esc(formatDateLabel(item.month,item.year))}</time></div><h4>${esc(prince?.name || "Şehzade")}</h4><p>${esc(item.reason)}</p></article>`}).join("") : `<p class="empty-state">Aún no se han registrado méritos. Todos los Şehzades comienzan con cero.</p>`;
  const events = readStore(CHRONICLE_KEY);
  $("#chronicleEntries").innerHTML = events.length ? [...events].reverse().map((item,index)=>`<article class="chronicle-entry ${item.status==="Pasillo"?"rumor-entry":"official-entry"}"><div class="entry-meta"><span class="tag">${esc(item.status)}</span><span class="tag">${esc(item.category)}</span><time>${esc(formatDateLabel(item.month,item.year))}</time></div><h4>${esc(item.title)}</h4><p>${esc(item.description)}</p>${item.status==="Pasillo"?`<p class="rumor-note">Se registra como rumor de pasillo; no constituye un hecho confirmado.</p>`:""}</article>`).join("") : `<p class="empty-state">Todavía no hay sucesos registrados en la memoria de la corte.</p>`;
}
function setupChismografo() {
  const monthSelect = (id) => `<select id="${id}" required>${monthOptions.map(m=>`<option value="${m}">${m[0].toUpperCase()+m.slice(1)}</option>`).join("")}</select>`;
  const princeSelect = `<select id="meritPrince" required>${eligiblePrinces.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("")}</select>`;
  $("#meritMonth").innerHTML = monthSelect("meritMonthSelect");
  $("#meritPrince").innerHTML = princeSelect;
  $("#chronicleMonth").innerHTML = monthSelect("chronicleMonthSelect");
  $("#meritForm").addEventListener("submit",event=>{
    event.preventDefault();
    const item={princeId:$("#meritPrince select").value,points:Number($("#meritPoints").value),month:$("#meritMonth select").value,year:$("#meritYear").value.trim(),reason:$("#meritReason").value.trim()};
    if(!item.points||item.points<1||!item.year||!item.reason)return;
    const records=readStore(MERIT_KEY);records.push(item);writeStore(MERIT_KEY,records);event.target.reset();renderChismografo();
  });
  $("#chronicleForm").addEventListener("submit",event=>{
    event.preventDefault();
    const item={title:$("#chronicleTitle").value.trim(),category:$("#chronicleCategory").value,status:$("#chronicleStatus").value,month:$("#chronicleMonth select").value,year:$("#chronicleYear").value.trim(),description:$("#chronicleDescription").value.trim()};
    if(!item.title||!item.year||!item.description)return;
    const records=readStore(CHRONICLE_KEY);records.push(item);writeStore(CHRONICLE_KEY,records);event.target.reset();renderChismografo();
  });
  renderChismografo();
}

function relationLinks(text) {
  const names = people.map((person) => person.name).filter(Boolean).sort((a, b) => b.length - a.length);
  const escapedNames = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matcher = new RegExp(`(${escapedNames.join("|")})`, "g");
  let output = "";
  let cursor = 0;
  for (const match of text.matchAll(matcher)) {
    output += esc(text.slice(cursor, match.index));
    output += `<button class="relation-link" data-name-link="${esc(match[0])}">${esc(match[0])}</button>`;
    cursor = match.index + match[0].length;
  }
  return output + esc(text.slice(cursor));
}

function openProfile(id) {
  const person = byId(id);
  if (!person) return;
  $("#dialogGroup").textContent = groupNames[person.group] || "Corte imperial";
  $("#dialogName").textContent = person.name;
  $("#dialogRank").textContent = person.rank || "Miembro de la corte";
  $("#dialogMeta").innerHTML = [person.age ? `<span class="tag">${esc(person.age)} años</span>` : "", person.gender ? `<span class="tag">Género: ${esc(person.gender)}</span>` : "", person.caste ? `<span class="tag">Casta: ${esc(person.caste)}</span>` : "", person.aroma && person.aroma !== "No consignado" ? `<span class="tag">Aroma: ${esc(person.aroma)}</span>` : ""].join("");
  $("#dialogBody").innerHTML = `<p>${esc(person.bio || person.summary || "")}</p>`;
  const relations = (person.relations || []).filter(Boolean).map((relation) => `<p class="relation-item">${relationLinks(relation)}</p>`).join("");
  $("#dialogRelations").innerHTML = relations || `<p class="relation-item">No se han registrado vínculos adicionales.</p>`;
  $("#dialogNote").textContent = person.note || person.Note || person.interaction || "";
  const dialog = $("#profileDialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}

function renderSearch() {
  const query = $("#searchCharacters").value.trim().toLocaleLowerCase("es");
  const target = $("#searchResults");
  if (!query) { target.innerHTML = ""; target.classList.remove("active"); return; }
  const matches = people.filter((person) => [person.name, person.rank, person.caste, person.aroma, person.summary, person.bio, person.gender].join(" ").toLocaleLowerCase("es").includes(query)).slice(0, 12);
  target.innerHTML = matches.length ? matches.map((person) => `<button class="search-result" data-person-link="${esc(person.id)}"><span><strong>${esc(person.name)}</strong><small>${esc(person.rank)} · ${esc(person.age || "—")} años</small></span><span>↗</span></button>`).join("") : `<p class="empty-state">No se encontraron personajes.</p>`;
  target.classList.add("active");
}

$("#searchCharacters").addEventListener("input", renderSearch);
$("#clearSearch").addEventListener("click", () => { $("#searchCharacters").value = ""; renderSearch(); $("#searchCharacters").focus(); });
document.addEventListener("click", (event) => {
  const cardElement = event.target.closest("[data-person]");
  if (cardElement) { openProfile(cardElement.dataset.person); return; }
  const link = event.target.closest("[data-person-link]");
  if (link) { openProfile(link.dataset.personLink); return; }
  const named = event.target.closest("[data-name-link]");
  if (named) { const person = findPerson(named.dataset.nameLink); if (person) openProfile(person.id); }
});
document.addEventListener("keydown", (event) => {
  const cardElement = event.target.closest("[data-person]");
  if (cardElement && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openProfile(cardElement.dataset.person); }
  if (event.key === "Escape" && $("#profileDialog").open) $("#profileDialog").close();
});
$("#dialogClose").addEventListener("click", () => $("#profileDialog").close());
$("#profileDialog").addEventListener("click", (event) => { if (event.target === $("#profileDialog")) $("#profileDialog").close(); });
$("#menuToggle").addEventListener("click", () => { const nav = $("#navLinks"); const opened = nav.classList.toggle("open"); $("#menuToggle").setAttribute("aria-expanded", String(opened)); });
document.querySelectorAll("#navLinks a").forEach((anchor) => anchor.addEventListener("click", () => { $("#navLinks").classList.remove("open"); $("#menuToggle").setAttribute("aria-expanded", "false"); }));

renderDynasty();
renderGovernment();
renderHarem();
renderAdministration();
renderNobility();
setupChismografo();
