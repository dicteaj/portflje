// -------------------------------------------------------------
// FELLES FUNKSJONER
// -------------------------------------------------------------

const menuButton = document.querySelector(".menu-button");
const mainMenu = document.querySelector(".main-menu");

if (menuButton && mainMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mainMenu.classList.toggle("is-open", !isOpen);
    menuButton.textContent = isOpen ? "Meny +" : "Lukk ×";
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mainMenu.classList.remove("is-open");
      menuButton.textContent = "Meny +";
    });
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

// -------------------------------------------------------------
// HOBBYPROSJEKTER
// Kopier ett objekt for å legge til et prosjekt.
//
// category må være: "Søm", "Kunst", "Annet" 
// visual bestemmer den midlertidige bakgrunnen.
// -------------------------------------------------------------

const hobbyProjects = [
  {
    number: "01",
    title: "Publikumsfavoritten",
    category: "Søm",
    year: "2025",
    description:
      "Et av syprosjektene mine vant publikumsprisen i Symesterskapet på Rebell i Tromsø. Mesterskapet gikk ut på at man skulle lage et plagg kun ved bruk av gjenbruksmaterialer. Jeg tok i bruk en gammel bluse og et laken til korsettet, og resten av lakenet og gammel tyll fra et bryllup til skjørtet. Tyll-laget av skjørtet kan tas av og det er to lag med kortere skjørt under.",
    details: ["Materiale: Bluse, Laken, Tyll", "Mønster: Korsettet - TailorApp på Etsy"],
    visual: "stitch",
    featured: true,
    image: "bilder/symesterskap2.png",
  },
  {
    number: "02",
    title: "Mønster tester",
    category: "Søm",
    year: "2026",
    description:
      "Jeg syntes det er gøy å være med på å teste ut mønstre før de blir gitt ut. Jeg testet ut dette mønsteret fra den norske designeren Maria Juterud.",
    details: ["Materiale: Bomull, blonder, knapper", "Mønster: The Lily Dress -Maria Juterud"],
    visual: "pattern",
    image: "bilder/Lily_dress.JPG",
  },
  {
    number: "03",
    title: "Mammas Maleri",
    category: "Kunst",
    year: "2023",
    description:
      "Et maleri malt til min Mor, til å ha på hennes hytte. Interiøret på hytta er blått, mye blå porselen, og det er omringet av natur og dyr, jeg forsøkte å følge dette temaet.",
    details: ["Materiale: Akrylmaling, lerret"],
    visual: "checker",
    image: "bilder/mamma2.png",
  },
  {
    number: "04",
    title: "Star Wars Skjerf",
    category: "Annet",
    year: "2024",
    description:
      "Star Wars skjef strikket dobbelt. Svart med hvite detaljer på en side, og omvendt på andre. Laget med gratis-mønster fra nettet.",
    details: ["Star Wars", "Svart og Hvit", "100% Ull"],
    visual: "scribble",
    image: "bilder/skjerf.png",
  },

];

const hobbyGrid = document.querySelector("[data-hobby-grid]");
const filterButtons = document.querySelectorAll("[data-filter]");
const filterStatus = document.querySelector(".filter-status");

function createProjectCard(project) {
  const article = document.createElement("article");
  article.className = `hobby-card${project.featured ? " hobby-card--featured" : ""}`;

  const imageMarkup = project.image
    ? `<img src="${project.image}" alt="${project.title}" />`
    : `<span class="image-note">Bytt med prosjektbilde</span>`;

  article.innerHTML = `
    <div class="hobby-card__visual visual--${project.visual}">
      ${imageMarkup}
      <span class="hobby-card__number">${project.number}</span>
    </div>
    <div class="hobby-card__content">
      <div class="hobby-card__meta">
        <span>${project.category}</span>
        <span>${project.year}</span>
      </div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <ul>
        ${project.details.map((detail) => `<li>${detail}</li>`).join("")}
      </ul>
    </div>
  `;

  return article;
}

function renderHobbyProjects(category = "Alle") {
  if (!hobbyGrid) return;

  const visibleProjects =
    category === "Alle"
      ? hobbyProjects
      : hobbyProjects.filter((project) => project.category === category);

  hobbyGrid.replaceChildren(
    ...visibleProjects.map((project) => createProjectCard(project)),
  );

  if (filterStatus) {
    const projectWord =
      visibleProjects.length === 1 ? "prosjekt" : "prosjekter";
    filterStatus.textContent = `Viser ${visibleProjects.length} ${projectWord}`;
  }
}

if (hobbyGrid) {
  renderHobbyProjects();

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === "Alle"),
    );

    button.addEventListener("click", () => {
      filterButtons.forEach((otherButton) => {
        otherButton.classList.remove("is-active");
        otherButton.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      renderHobbyProjects(button.dataset.filter);
    });
  });
}

const printCvButton = document.querySelector("[data-print-cv]");

if (printCvButton) {
  printCvButton.addEventListener("click", () => {
    window.print();
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
