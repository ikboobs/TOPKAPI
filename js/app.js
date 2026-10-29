import TOPKAPI from "./data.js";
const $ = (s) => document.querySelector(s);
const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const groupNames={dinastia:"Dinastía imperial",gobierno:"Gobierno imperial",harem:"Harén imperial",administracion:"Administración imperial",nobleza:"Nobleza"};
const removedNames=["Hoshiumi Kōrai","Kōsei Miya Hoshiumi","Osāki Miya Hoshiumi","Matsukawa Issei","Shirabu Kenjiro"];
const people=TOPKAPI.characters.filter(p=>!removedNames.some(n=>p.name.toLocaleLowerCase("es").includes(n.toLocaleLowerCase("es"))));
function findPerson(name){return people.find(p=>p.name.toLocaleLowerCase("es")===String(name).toLocaleLowerCase("es"));}
function personButton(name,label){const p=findPerson(name);return p?`<button class="relation-link" data-person-link="${esc(p.id)}">${esc(label||p.name)}</button>`:esc(label||name);}
function tags(p){return `<div class="card-tags">${p.age?`<span class="tag">${esc(p.age)} años</span>`:""}${p.gender?`<span class="tag">${esc(p.gender)}</span>`:""}${p.caste?`<span class="tag">${esc(p.caste)}</span>`:""}${p.aroma&&p.aroma!=="No consignado"?`<span class="tag">Aroma: ${esc(p.aroma)}</span>`:""}</div>`;}
function card(p){return `<article class="character-card reveal" tabindex="0" role="button" data-person="${esc(p.id)}" aria-label="Abrir ficha de ${esc(p.name)}"><div class="character-image">${p.image?`<img src="images/${esc(p.image)}" alt="Retrato de ${esc(p.name)}" onerror="this.parentElement.innerHTML='<div class=&quot;image-placeholder&quot;>Retrato pendiente</div>'">`:`<div class="image-placeholder">Retrato pendiente</div>`}</div><div class="character-info"><span class="rank">${esc(p.rank||"Integrante de la corte")}</span><h3>${esc(p.name)}</h3>${tags(p)}<p>${esc(p.summary||p.bio||"")}</p><span class="profile-prompt">Consultar ficha ↗</span></div></article>`;}
function section(title,desc,list){return `<section class="character-subsection"><div class="subsection-heading"><h3>${esc(title)}</h3><p>${esc(desc)}</p></div><div class="character-grid">${list.map(card).join("")||`<p class="empty-state">No hay perfiles registrados en este apartado.</p>`}</div></section>`;}
function renderDynasty(){const order=[
{title:"Alto Sultanato",desc:"La sangre que sostiene la casa reinante.",ids:["osamu","atsumu","otoha"]},
{title:"Consortes imperiales",desc:"",ids:["tarae","kenma","shimizu"]},
{title:"Şehzades",desc:"Hijos varones del sultán reconocidos como príncipes.",ids:["arata","osman","osome","shizuku"]},
{title:"Sultanas",desc:"Hijas de la casa imperial, con rango por nacimiento y responsabilidades propias de su posición.",ids:["atsuki","zayan","osuyu"]},
{title:"Descendientes por Linea Materna.",desc:"Sobrinos del sultán.",ids:["hiro","kenji"]}
];
const byId=id=>people.find(p=>p.id===id);const html=order.map(g=>section(g.title,g.desc,g.ids.map(byId).filter(Boolean))).join("");
const other=people.filter(p=>p.group==="dinastia"&&!order.some(g=>g.ids.includes(p.id)));
$("#dynastyGroups").innerHTML=html+(other.length?section("Otras ramas dinásticas", "Parentescos y ramas colaterales registradas en la corte.",other):"");
}
function diagramNode(title,subtitle,desc="",children=""){return `<div class="hierarchy-node"><strong>${esc(title)}</strong><span>${esc(subtitle)}</span>${desc?`<p>${esc(desc)}</p>`:""}${children}</div>`;}
function renderGovernment(){
 const offices=TOPKAPI.offices;
 const branches=offices.slice(2).map(o=>`<div class="hierarchy-node compact"><strong>${esc(o.name)}</strong><span>${esc(o.translation)} · ${esc(o.holder)}</span><p>${esc(o.purpose)}</p></div>`).join("");
 $("#governmentDiagram").innerHTML=`<div class="hierarchy-root">${diagramNode("Sultan Osamu Miya","Soberano del Imperio","Autoridad suprema de la corte imperial.")}</div><div class="hierarchy-connector"></div>${diagramNode("Sadrazam","Gran visir · Vacante",offices[0].purpose)}<div class="hierarchy-connector"></div>${diagramNode("Vezirler","Visires · Vacante",offices[1].purpose)}<div class="hierarchy-connector"></div><div class="hierarchy-branches">${branches}</div>`;
 $("#officeGrid").innerHTML=offices.map(o=>`<article class="office-card reveal"><p class="eyebrow">Cargo del Dîvân-ı Hümâyun</p><h3>${esc(o.name)}</h3><p class="office-subtitle">${esc(o.translation)}</p><p class="office-holder">Lo ocupa: <strong>${esc(o.holder)}</strong></p><p>${esc(o.purpose)}</p></article>`).join("");
}
function openProfile(id){const p=people.find(x=>x.id===id);if(!p)return;$("#dialogGroup").textContent=groupNames[p.group]||"Corte imperial";$("#dialogName").textContent=p.name;$("#dialogRank").textContent=p.rank||"Miembro de la corte";$("#dialogMeta").innerHTML=[p.age?`<span class="tag">${esc(p.age)} años</span>`:"",p.gender?`<span class="tag">Género: ${esc(p.gender)}</span>`:"",p.caste?`<span class="tag">Casta: ${esc(p.caste)}</span>`:"",p.aroma&&p.aroma!=="No consignado"?`<span class="tag">Aroma: ${esc(p.aroma)}</span>`:""].join("");$("#dialogBody").innerHTML=`<p>${esc(p.bio||p.summary||"")}</p>`;let rel=(p.relations||[]).map(text=>`<p class="relation-item">${relationLinks(text)}</p>`).join("");$("#dialogRelations").innerHTML=rel||`<p class="relation-item">No se han registrado vínculos adicionales.</p>`;$("#dialogNote").textContent=p.note||p.interaction||"";$("#profileDialog").showModal();}
function relationLinks(text){let html=esc(text);const names=people.map(p=>p.name).sort((a,b)=>b.length-a.length);for(const n of names){const safe=esc(n).replace(/[.*+?^${}()|[\]\\]/g,"\\$&");html=html.replace(new RegExp(safe,"g"),`<button class="relation-link" data-name-link="${esc(n)}">${esc(n)}</button>`);}return html;}
function renderOffices(){
 const positions=TOPKAPI.positions;
 const node=o=>`<div class="hierarchy-node compact"><strong>${esc(o.name)}</strong><span>${esc(o.translation)} · ${esc(o.holder)}</span></div>`;
 $("#administrationDiagram").innerHTML=`<div class="hierarchy-root">${diagramNode("Saray-ı Hümâyun","Servicio y administración del palacio","Organización de los servicios internos y de los accesos autorizados.")}</div><div class="hierarchy-connector"></div><div class="hierarchy-branches">${positions.map(node).join("")}</div>`;
 $("#administrationGrid").innerHTML=positions.map(o=>`<article class="office-card reveal"><p class="eyebrow">${o.holder==="Vacante"?"Convocatoria abierta":"Cargo ocupado"}</p><h3>${esc(o.name)}</h3><p class="office-subtitle">${esc(o.translation)}</p><p class="office-holder">Lo ocupa: <strong>${esc(o.holder)}</strong></p><p>${esc(o.purpose)}</p><p class="access-line"><strong>Notas:</strong> ${esc(o.notes||"El acceso y las atribuciones se rigen por el protocolo del palacio.")}</p></article>`).join("");
$("#administrationCharacters").innerHTML = people
  .filter(p => ["tadashi", "aran"].includes(p.id))
  .map(card)
  .join("");
}
function renderHarem(){
 const groups=[
 {title:"Sultanas imperiales · Sultanlar",desc:"",ids:["otoha"]},
 {title:"Consortes imperiales",desc:"Las consortes conservan los rangos consignados en sus fichas.",ids:["tarae","kenma","shimizu"]},
{
  title: "İkbal y cariyes",desc: "Miembros del harén con distintos rangos y situaciones personales.",
  ids: [
    "alissa",
    "akiko",
    "yaku",
    "shizuka",
    "natsu",
    "shoyo",
    "kageyama",
    "svet",
  ]
}, {title:"Servicio del harén",desc:"Personal dedicado a las tareas y la administración cotidiana de la casa interior.",ids:["kei"]}
 ];
 const all=groups.map(g=>{const list=g.ids.map(id=>people.find(p=>p.id===id)).filter((p,i,a)=>p&&a.findIndex(x=>x.id===p.id)===i);return section(g.title,g.desc,list);}).join("");
 $("#haremPositions").innerHTML=all;
 $("#haremDiagram").innerHTML=`<div class="hierarchy-root">${diagramNode("Harem-i Hümâyun","Casa interior imperial","La organización respeta el rango, la asignación y las normas de acceso.")}</div><div class="hierarchy-connector"></div><div class="hierarchy-branches">${groups.map(g=>`<div class="hierarchy-node compact"><strong>${esc(g.title)}</strong><span>${g.ids.map(id=>people.find(p=>p.id===id)?.name).filter(Boolean).join(" · ")||"Integrantes según ficha"}</span></div>`).join("")}</div>`;
}
function renderNobility(){
 const houses=[
 {name:"Casa Ushijima",ids:["ushijima","oikawa","ruzgar","rashida"],desc:"Casa noble encabezada por Wakatoshi Bey."},
 {name:"Casa Bokuto",ids:["bokuto","akaashi","bokuto-son"],desc:"Casa vinculada a la nobleza militar y a la administración de sus dominios."},
 {name:"Casa Kuroo",ids:["kuroo","daisho","kuroo-son"],desc:"Casa con vínculos militares, comerciales y territoriales."},
 {name:"Casa Tendō",ids:["tendo"],desc:"Casa individual registrada en torno a Satori Tendō."},
 {name:"Casa Sakusa",ids:["sakusa"],desc:"Casa individual de rango Pachá."},
 {name:"Casa Iwaizumi",ids:["iwaizumi"],desc:"Casa noble de tradición militar y administración de dominios."},
 {name:"Casa Haiba",ids:["lev"],desc:"Casa de la nobleza de origen extranjero."},
 {name:"Casa Matsukawa",ids:["issa"],desc:"Casa de estatus perdido."},
 {name:"Casas nobles por completar",ids:[],desc:"Las casas adicionales se incorporarán cuando sus fichas y vínculos estén registrados."}
 ];
 const actual=houses.map(h=>({...h,members:h.ids.map(id=>people.find(p=>p.id===id)).filter(Boolean)})).filter(h=>h.members.length);
 $("#nobilityGroups").innerHTML=actual.map(h=>section(h.name,h.desc,h.members)).join("");
 $("#nobilityDiagram").innerHTML=`<div class="hierarchy-root">${diagramNode("Ümerâ ve Eşraf","Nobleza imperial","Las casas se organizan por linaje, matrimonio y descendencia registrados.")}</div><div class="hierarchy-connector"></div><div class="hierarchy-branches">${actual.map(h=>`<div class="hierarchy-node compact"><strong>${esc(h.name)}</strong><span>${h.members.map(p=>esc(p.name)).join(" · ")}</span></div>`).join("")}</div>`;
}
function renderSearch(){const q=$("#searchCharacters").value.trim().toLocaleLowerCase("es");const target=$("#searchResults");if(!q){target.innerHTML="";target.classList.remove("active");return;}const matches=people.filter(p=>[p.name,p.rank,p.caste,p.aroma,p.summary,p.bio,p.gender].join(" ").toLocaleLowerCase("es").includes(q)).slice(0,10);target.innerHTML=matches.length?matches.map(p=>`<button class="search-result" data-person-link="${esc(p.id)}"><span><strong>${esc(p.name)}</strong><small>${esc(p.rank)} · ${esc(p.age||"—")} años</small></span><span>↗</span></button>`).join(""):`<p class="empty-state">No se encontraron personajes.</p>`;target.classList.add("active");}
function observeReveal(){if(!("IntersectionObserver"in window)){document.querySelectorAll(".reveal").forEach(e=>e.classList.add("visible"));return;}const ob=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");ob.unobserve(e.target);}}),{threshold:.06});document.querySelectorAll(".reveal:not(.visible)").forEach(e=>ob.observe(e));}
$("#searchCharacters").addEventListener("input",renderSearch);$("#clearSearch").addEventListener("click",()=>{$("#searchCharacters").value="";renderSearch();$("#searchCharacters").focus();});document.addEventListener("click",e=>{const card=e.target.closest("[data-person]");if(card){openProfile(card.dataset.person);return;}const link=e.target.closest("[data-person-link]");if(link){openProfile(link.dataset.personLink);return;}const named=e.target.closest("[data-name-link]");if(named){const p=findPerson(named.dataset.nameLink);if(p)openProfile(p.id);}});document.addEventListener("keydown",e=>{const card=e.target.closest("[data-person]");if(card&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openProfile(card.dataset.person);}if(e.key==="Escape"&&$("#profileDialog").open)$("#profileDialog").close();});$("#dialogClose").addEventListener("click",()=>$("#profileDialog").close());$("#profileDialog").addEventListener("click",e=>{if(e.target===$("#profileDialog"))$("#profileDialog").close();});$("#menuToggle").addEventListener("click",()=>{const n=$("#navLinks"),opened=n.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(opened));});document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>{$("#navLinks").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false");}));
renderDynasty();
renderGovernment();
renderOffices();
renderHarem();
renderNobility();

document.querySelectorAll(".reveal").forEach(el => {
  el.classList.add("visible");
});
