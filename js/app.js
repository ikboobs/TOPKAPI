import TOPKAPI from "./data.js";
import CHRONICLE_DATA from "./data/cronica.js";
import MERIT_SYSTEM_DATA from "./data/meritos.js";
const ORGANOGRAMAS = TOPKAPI.organigramas;

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

function normalizedRank(value) {
  return String(value || "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").replace(/\s+/g, " ");
}
function peopleWithRank(rank) {
  const key = normalizedRank(rank);
  return people.filter(person => normalizedRank(person.rank) === key);
}
function rankPeopleMarkup(rank) {
  const holders = peopleWithRank(rank);
  return holders.length
    ? holders.map(person => personNode(person.id, person.rank)).join("")
    : `<span class="org-vacant">Vacante · sin integrante con el rango «${esc(rank)}»</span>`;
}
function rankBranch(node) {
  const children = (node.children || []).map(rankBranch).join("");
  return `<article class="org-branch"><h4>${esc(node.title)}</h4>${node.description ? `<p>${esc(node.description)}</p>` : ""}<div class="org-people">${rankPeopleMarkup(node.rank)}</div>${children ? `<div class="org-subbranches">${children}</div>` : ""}</article>`;
}

function renderDynasty() {
  $("#dynastyDiagram").innerHTML = `<div class="org-chart">
    <div class="org-root"><span class="org-kicker">Casa reinante</span><h3>Osmanlı Hanedanı</h3>${personNode("osamu", "Sultán · soberano")}</div>
    <div class="org-connector"></div>
    <div class="org-columns">
      <article class="org-branch"><h4>Dinastía Imperial</h4><p>La rama de sangre imperial de la generación del soberano y sus vínculos directos.</p>
        <h5>Hermanos del Sultán · Rama Colateral</h5><div class="org-people">${personNode("atsumu", "Şehzade · hermano gemelo del sultán")}${personNode("otoha", "Sultana imperial · hermana del sultán")}</div>
        <div class="org-subbranch"><h5>Descendencia de Otoha</h5><div class="org-people">${personNode("hiro", "Sultanzade")}${personNode("kenji", "Hanımsultan")}</div></div>
      </article>
      ${hierarchyGroup("Şehzades · Hijos del Sultán", "Descendencia masculina de Osamu.", ["arata", "osman", "osome", "shizuku"])}
      ${hierarchyGroup("Sultanas Imperiales · Hijas del Sultán", "Descendencia femenina de Osamu.", ["atsuki", "zayan", "osuyu"])}
      ${hierarchyGroup("Consorte Imperial", "Haseki Sultan · consorte principal.", ["tarae"])}
    </div></div>`;
}

function renderGovernment() {
  const config = ORGANOGRAMAS.government;
  const offices = config.offices;
  const grouped = [...new Set(offices.map(office => office.group))].map(group => {
    const items = offices.filter(office => office.group === group);
    return `<article class="org-branch"><h4>${esc(group)}</h4><div class="org-subbranches">${items.map(office => `<article class="org-branch"><h5>${esc(office.title)}</h5><p class="office-subtitle">${esc(office.translation)}</p><p>${esc(office.purpose)}</p><div class="org-people">${rankPeopleMarkup(office.rank)}</div></article>`).join("")}</div></article>`;
  }).join("");
  $("#governmentDiagram").innerHTML = `<div class="org-chart"><div class="org-root"><span class="org-kicker">${esc(config.rootKicker)}</span><h3>${esc(config.rootTitle)}</h3><p>${esc(config.rootDescription)}</p>${personNode("osamu", "Sultán · cabeza del Estado")}</div><div class="org-connector"></div><div class="org-columns">${grouped}</div></div>`;
}

function renderHarem() {
  const config = ORGANOGRAMAS.harem.root;
  $("#haremDiagram").innerHTML = `<div class="org-chart"><div class="org-root"><span class="org-kicker">Autoridad superior de la casa imperial</span><h3>${esc(config.title)}</h3><p>${esc(config.description)}</p><div class="org-people">${rankPeopleMarkup(config.rank)}</div></div><div class="org-connector"></div><div class="org-columns">${(config.children || []).map(rankBranch).join("")}</div></div>`;
}

function renderAdministration() {
  const config = ORGANOGRAMAS.administration;
  const groups = config.groups.map(group => `<article class="org-branch"><h4>${esc(group.title)}</h4><p>${esc(group.description)}</p><div class="org-subbranches">${group.offices.map(office => `<article class="org-branch"><h5>${esc(office.title)}</h5><p class="office-subtitle">${esc(office.translation)}</p><p>${esc(office.purpose)}</p><div class="org-people">${rankPeopleMarkup(office.rank)}</div></article>`).join("")}</div></article>`).join("");
  $("#administrationDiagram").innerHTML = `<div class="org-chart"><div class="org-root"><span class="org-kicker">${esc(config.rootKicker)}</span><h3>${esc(config.rootTitle)}</h3><p>${esc(config.rootDescription)}</p></div><div class="org-connector"></div><div class="org-columns">${groups}</div></div>`;
}

function renderNobility() {
  const config = ORGANOGRAMAS.nobility;
  const houses = config.houses.map(house => {
    const members = people.filter(person => person.house === house.name);
    return `<article class="org-branch"><h4>${esc(house.name)}</h4><p>${esc(house.description)}</p><div class="org-people">${members.length ? members.map(person => personNode(person.id, person.rank)).join("") : `<span class="org-vacant">Sin integrantes registrados</span>`}</div></article>`;
  }).join("");
  $("#nobilityDiagram").innerHTML = `<div class="org-chart"><div class="org-root"><span class="org-kicker">${esc(config.rootKicker)}</span><h3>${esc(config.rootTitle)}</h3><p>${esc(config.rootDescription)}</p></div><div class="org-connector"></div><div class="org-columns">${houses}</div></div>`;
}

const eligiblePrinces = ["arata", "osman", "osome", "shizuku"].map(byId).filter(Boolean);
const formatDateLabel = (month, year) => `En el mes de ${month || "sin especificar"}, del año ${year || "sin especificar"} del sultanato de Osamu I`;
const competitionEntries = Array.isArray(MERIT_SYSTEM_DATA.entries) ? MERIT_SYSTEM_DATA.entries : [];
const gameById = (id) => MERIT_SYSTEM_DATA.games.find(game => game.id === id);
const competitionPoints = (entry) => Number(gameById(entry.gameId)?.points || 0);

function renderMilitaryMerits() {
  let container = document.querySelector("#militaryMerits");
  if (!container) {
    const anchor = $("#successionPodium");
    if (!anchor) return;
    anchor.insertAdjacentHTML("afterend", `
      <div class="chronicle-subheading" id="militaryMeritHeading">
        <p class="eyebrow">Trayectoria de la corte</p>
        <h3>Méritos Militares y Estratégicos</h3>
        <p>Los resultados de las competencias se convierten en puntos acumulativos. Los reconocimientos son concedidos por el Sultán; alcanzar los umbrales habilita las recompensas correspondientes.</p>
      </div>
      <div id="militaryMerits" class="chronicle-list"></div>
    `);
    container = $("#militaryMerits");
  }

  const militaryParticipants = people.filter(person =>
    person.gender === "Masculino" &&
    ["Alfa", "Beta"].includes(person.caste) &&
    person.group !== "dinastia"
  );
  const starThreshold = Number(MERIT_SYSTEM_DATA.thresholds?.star || 75);
  const promotionThreshold = Number(MERIT_SYSTEM_DATA.thresholds?.promotion || 150);
  const ranking = militaryParticipants.map(person => {
    const entries = competitionEntries.filter(entry => entry.participantId === person.id);
    const total = entries.reduce((sum, entry) => sum + competitionPoints(entry), 0);
    return { ...person, total, hasStar: total >= starThreshold, promotionEligible: total >= promotionThreshold };
  }).sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "es"));
  const max = Math.max(1, ...ranking.map(person => person.total));
  const rows = ranking.map((person, index) => `
    <div class="merit-row">
      <span class="merit-rank">${person.total ? index + 1 : "—"}</span>
      <span class="merit-name">${esc(person.name)}</span>
      <div class="merit-track"><i style="width:${person.total ? Math.max(3, person.total / max * 100) : 0}%"></i></div>
      <strong>${person.total}</strong>
    </div>`).join("");
  const gameTable = MERIT_SYSTEM_DATA.games.map(game => `
    <div class="merit-row">
      <span class="merit-name">${esc(game.name)}</span>
      <span></span><span></span><strong>+${Number(game.points)} pts.</strong>
    </div>`).join("");
  const records = competitionEntries.length
    ? [...competitionEntries].reverse().map(entry => {
        const person = byId(entry.participantId);
        const game = gameById(entry.gameId);
        const isPrince = eligiblePrinces.some(prince => prince.id === entry.participantId);
        return `<article class="chronicle-entry"><div class="entry-meta"><span class="tag">Mérito competitivo · +${competitionPoints(entry)} puntos</span><span class="tag">${isPrince ? "Sucesión imperial" : "Mérito militar"}</span><time>${esc(formatDateLabel(entry.month, entry.year))}</time></div><h4>${esc(person?.name || "Participante")}</h4><p>${esc(game?.name || "Competencia no especificada")}${entry.result ? ` — ${esc(entry.result)}` : ""}</p></article>`;
      }).join("")
    : `<p class="empty-state">Todavía no hay resultados de competencias registrados.</p>`;

  container.innerHTML = `
    <div class="chronicle-panel">
      <h3>Tabla oficial de competencias</h3>
      <p>Los puntos se asignan según la actividad reconocida. Autoridad otorgante: ${esc(MERIT_SYSTEM_DATA.recognizedBy || "el Sultán")}.</p>
      <div class="merit-ranking">${gameTable}</div>
      <p class="storage-note">${starThreshold} puntos: una estrella de mérito · ${promotionThreshold} puntos: evaluación para ascenso de puesto. Los Şehzades acumulan estos puntos en su trayectoria sucesoria y no reciben ascensos de rango por este sistema.</p>
    </div>
    <div class="chronicle-subheading"><h3>Clasificación militar y estratégica</h3><p>Participan los hombres Alfa y Beta de la corte que no pertenecen a la dinastía imperial.</p></div>
    <div class="merit-ranking">${rows || `<p class="empty-state">No hay participantes elegibles registrados.</p>`}</div>
    <div class="chronicle-subheading"><h3>Historial de competencias</h3></div>
    <div class="chronicle-list">${records}</div>
    <div class="chronicle-subheading"><h3>Reconocimientos y ascensos</h3></div>
    <div class="merit-ranking">
      ${ranking.filter(person => person.hasStar || person.promotionEligible).map(person => `<p><strong>${esc(person.name)}</strong>: ${person.hasStar ? "Ha obtenido una estrella de mérito." : ""}${person.promotionEligible ? " Ha alcanzado el umbral para ser evaluado para un ascenso." : ""}</p>`).join("") || `<p class="empty-state">Aún no se han alcanzado umbrales de recompensa.</p>`}
    </div>`;
}

function renderChismografo() {
  const historicalMerits = Array.isArray(CHRONICLE_DATA.merits) ? CHRONICLE_DATA.merits : [];
  const successionEntries = competitionEntries.filter(entry => eligiblePrinces.some(prince => prince.id === entry.participantId));
  const totals = eligiblePrinces.map(person => {
    const historicalTotal = historicalMerits.filter(item => item.princeId === person.id)
      .reduce((sum, item) => sum + Number(item.points || 0), 0);
    const competitiveTotal = successionEntries.filter(item => item.participantId === person.id)
      .reduce((sum, item) => sum + competitionPoints(item), 0);
    return { ...person, total: historicalTotal + competitiveTotal };
  }).sort((x, y) => y.total - x.total || x.name.localeCompare(y.name, "es"));
  const max = Math.max(1, ...totals.map(x => x.total));
  const starThreshold = Number(MERIT_SYSTEM_DATA.thresholds?.star || 75);
  const noMerits = totals.every(p => p.total === 0);
  const podium = noMerits ? totals : totals.slice(0, 3);
  let previousTotal = null, place = 0;
  const rankingRows = totals.map((p, i) => {
    if (p.total !== previousTotal) place = i + 1;
    previousTotal = p.total;
    return `<div class="merit-row"><span class="merit-rank">${noMerits ? "—" : place}</span><span class="merit-name">${esc(p.name)}</span><div class="merit-track"><i style="width:${p.total ? Math.max(3, p.total / max * 100) : 0}%"></i></div><strong>${p.total}</strong></div>`;
  }).join("");
  $("#successionPodium").innerHTML = `<div class="podium-grid ${noMerits ? "all-contenders" : ""}">${podium.map((p, i) => `<article class="podium-card ${noMerits ? "" : "place-" + (i + 1)}"><span class="podium-place">${noMerits ? "Aspirante" : (i + 1) + "° lugar"}</span>${portrait(p)}<strong>${esc(p.name)}</strong><small>${esc(p.rank)}</small><b>${p.total} puntos ${p.total >= starThreshold ? "· ★ Mérito obtenido" : ""}</b></article>`).join("")}</div><div class="merit-ranking">${rankingRows}</div>`;

  const allSuccessionMerits = [
    ...historicalMerits.map(item => ({ ...item, meritType: "histórico", participantId: item.princeId, label: item.reason })),
    ...successionEntries.map(item => ({ ...item, meritType: "competitivo", participantId: item.participantId, label: `${gameById(item.gameId)?.name || "Competencia"}${item.result ? ` — ${item.result}` : ""}`, points: competitionPoints(item) }))
  ];
  $("#meritHistory").innerHTML = allSuccessionMerits.length
    ? [...allSuccessionMerits].reverse().map(item => {
        const prince = byId(item.participantId);
        const typeLabel = item.meritType === "competitivo" ? "Mérito competitivo" : "Mérito histórico";
        return `<article class="chronicle-entry"><div class="entry-meta"><span class="tag">${typeLabel} · ${Number(item.points)} ${Number(item.points) === 1 ? "punto" : "puntos"}</span><time>${esc(formatDateLabel(item.month, item.year))}</time></div><h4>${esc(prince?.name || "Şehzade")}</h4><p>${esc(item.label || "Mérito reconocido por el Sultán.")}</p></article>`;
      }).join("")
    : `<p class="empty-state">Aún no se han registrado méritos. Todos los Şehzades comienzan con cero.</p>`;

  const events = Array.isArray(CHRONICLE_DATA.events) ? CHRONICLE_DATA.events : [];
  $("#chronicleEntries").innerHTML = events.length
    ? [...events].reverse().map(item => `<article class="chronicle-entry ${item.status === "Pasillo" ? "rumor-entry" : "official-entry"}"><div class="entry-meta"><span class="tag">${esc(item.status)}</span><span class="tag">${esc(item.category)}</span><time>${esc(formatDateLabel(item.month, item.year))}</time></div><h4>${esc(item.title)}</h4><p>${esc(item.description)}</p>${item.status === "Pasillo" ? `<p class="rumor-note">Se registra como rumor de pasillo; no constituye un hecho confirmado.</p>` : ""}</article>`).join("")
    : `<p class="empty-state">Todavía no hay sucesos registrados en la memoria de la corte.</p>`;
  renderMilitaryMerits();
}

function setupChismografo() {
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
  $("#dialogMeta").innerHTML = [person.age ? `<span class="tag">${esc(person.age)} años</span>` : "", person.gender ? `<span class="tag">Género: ${esc(person.gender)}</span>` : "", person.caste ? `<span class="tag">Casta: ${esc(person.caste)}</span>` : "", person.subgroup ? `<span class="tag">${esc(person.subgroup)}</span>` : "", person.aroma && person.aroma !== "No consignado" ? `<span class="tag">Aroma: ${esc(person.aroma)}</span>` : ""].join("");
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
