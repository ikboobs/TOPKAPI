import TOPKAPI from "./data.js";
const $ = (selector) => document.querySelector(selector);
const grid = $("#characterGrid");
const search = $("#searchCharacters");
const groupFilter = $("#groupFilter");

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[ch]);
}
function groupLabel(group) {
  return ({dinastia:"Dinastía",gobierno:"Gobierno y nobleza",harem:"Harén",mujeres:"Mujeres del palacio",hombres:"Hombres del palacio"})[group] || group;
}
function renderCharacters() {
  const query = search.value.trim().toLocaleLowerCase("es");
  const group = groupFilter.value;
  const list = TOPKAPI.characters.filter(person => {
    const matchesGroup = group === "all" || person.group === group;
    const haystack = [person.name,person.rank,person.caste,person.aroma,person.summary,person.bio].join(" ").toLocaleLowerCase("es");
    return matchesGroup && haystack.includes(query);
  });
  grid.innerHTML = list.map(person => `
    <article class="character-card reveal" tabindex="0" role="button" data-person="${escapeHtml(person.id)}" aria-label="Abrir perfil de ${escapeHtml(person.name)}">
      ${person.image
        ? `<img src="images/${escapeHtml(person.image)}" alt="Retrato de ${escapeHtml(person.name)}" onerror="this.outerHTML='<div class=&quot;image-placeholder&quot;>Retrato pendiente</div>'">`
        : `<div class="image-placeholder">Retrato pendiente</div>`}
      <div class="character-info">
        <span class="rank">${escapeHtml(person.rank)}</span>
        <h3>${escapeHtml(person.name)}</h3>
        <p>${escapeHtml(person.summary)}</p>
        <div class="card-tags">
          ${person.age ? `<span class="tag">${escapeHtml(person.age)} años</span>` : ""}
          ${person.caste ? `<span class="tag">${escapeHtml(person.caste)}</span>` : ""}
          <span class="tag">${escapeHtml(groupLabel(person.group))}</span>
        </div>
      </div>
    </article>`).join("") || `<p class="empty-state">No hay personajes que coincidan con la búsqueda.</p>`;
  grid.querySelectorAll("[data-person]").forEach(card => {
    card.addEventListener("click", () => openProfile(card.dataset.person));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); openProfile(card.dataset.person);
      }
    });
  });
  observeReveal();
}
function listHtml(items) {
  return `<ul>${(items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}
function relationText(text) {
  const names = TOPKAPI.characters
    .map(person => person.name)
    .sort((a, b) => b.length - a.length);
  let html = escapeHtml(text || "");
  for (const name of names) {
    const escapedName = escapeHtml(name);
    const safeName = escapedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(
      new RegExp(safeName, "g"),
      `<button class="relation-link" data-related-name="${escapedName}">${escapedName}</button>`
    );
  }
  return html;
}
function openProfile(id) {
  const person = TOPKAPI.characters.find(item => item.id === id);
  if (!person) return;

  $("#dialogGroup").textContent = groupLabel(person.group);
  $("#dialogName").textContent = person.name;
  $("#dialogRank").textContent = person.rank || "";

  $("#dialogMeta").innerHTML = [
    person.age
      ? `<span class="tag">${escapeHtml(person.age)} años</span>`
      : "",
    person.caste
      ? `<span class="tag">${escapeHtml(person.caste)}</span>`
      : "",
    person.aroma
      ? `<span class="tag">Aroma: ${escapeHtml(person.aroma)}</span>`
      : ""
  ].join("");
  $("#dialogBody").innerHTML =
    `<p>${escapeHtml(person.bio || person.summary || "")}</p>`;
  const relations = person.relations || [];
  $("#dialogRelations").innerHTML = `
    <div class="profile-relations">
      ${relations.map(relation => `
        <div class="relation-item">${relationText(relation)}</div>
      `).join("")}
    </div>
    ${person.interaction
      ? `<p class="profile-note">${escapeHtml(person.interaction)}</p>`
      : ""}
  `;
  $("#dialogNote").textContent = person.note || "";
  $("#profileDialog").showModal();
}
function renderOfficeCards() {
  $("#officeGrid").innerHTML = TOPKAPI.offices.map(office => `
    <article class="office-card reveal">
      <p class="eyebrow">Cargo y atribuciones</p>
      <h3>${escapeHtml(office.name)}</h3>
      <p class="office-holder">${escapeHtml(office.holder)}</p>
      <p>${escapeHtml(office.purpose)}</p>
      <details><summary>Responsabilidades del puesto</summary>${listHtml(office.duties)}</details>
      <p class="access-line"><strong>Interacción:</strong> ${escapeHtml(office.access)}</p>
    </article>`).join("");
}
function renderInfoCards(target, items) {
  $(target).innerHTML = items.map(item => `
    <article class="info-card reveal">
      <p class="eyebrow">Estructura del palacio</p>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
      <p><strong>Responsables:</strong> ${relationText(item.people)}</p>
      <p><strong>Interacciones:</strong> ${escapeHtml(item.interaction)}</p>
    </article>`).join("");
}
function observeReveal() {
  const elements = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("visible")); return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.08});
  elements.forEach(el => observer.observe(el));
}

search.addEventListener("input", renderCharacters);
groupFilter.addEventListener("change", renderCharacters);
$("#dialogClose").addEventListener("click", () => $("#profileDialog").close());
$("#profileDialog").addEventListener("click", event => {
  if (event.target === $("#profileDialog")) $("#profileDialog").close();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && $("#profileDialog").open) $("#profileDialog").close();
});
$("#menuToggle").addEventListener("click", () => {
  const links = $("#navLinks");
  const opened = links.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(opened));
});
document.querySelectorAll("#navLinks a").forEach(link => link.addEventListener("click", () => {
  $("#navLinks").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));
document.addEventListener("click", event => {
  const button = event.target.closest("[data-related-name]");
  if (!button) return;
  const name = button.dataset.relatedName;
  const person = TOPKAPI.characters.find(item => item.name === name);
  if (person) openProfile(person.id);
});

renderCharacters();
renderOfficeCards();
renderInfoCards("#haremGrid", TOPKAPI.sections.harem);
renderInfoCards("#womenGrid", TOPKAPI.sections.women);
renderInfoCards("#menGrid", TOPKAPI.sections.men);
observeReveal();
