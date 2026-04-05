let trenutnaProjekcijaIndex = 0;
const DOZVOLJENI_STATUSI = ["slobodno", "zauzeto", "rezervisano"];
function validirajPodatke(podaci) {
  if (!podaci || !Array.isArray(podaci.projekcije) || podaci.projekcije.length === 0) {
    return false;
  }

  for (const projekcija of podaci.projekcije) {
    if (!projekcija.film || !projekcija.vrijeme || !Array.isArray(projekcija.sjedista)) {
      return false;
    }

    for (const sjediste of projekcija.sjedista) {
      if (
        !sjediste.red ||
        typeof sjediste.broj !== "number" ||
        !DOZVOLJENI_STATUSI.includes(sjediste.status)
      ) {
        return false;
      }
    }
  }

  return true;
}
function prikaziGresku() {
  const sala = document.getElementById("sala");
  sala.innerHTML = `<p class="greska">Podaci nisu validni!</p>`;
}
function grupisiSjedistaPoRedovima(sjedista) {
  const redovi = {};

  for (const sjediste of sjedista) {
    if (!redovi[sjediste.red]) {
      redovi[sjediste.red] = [];
    }
    redovi[sjediste.red].push(sjediste);
  }

  const sortiraniRedovi = Object.keys(redovi).sort();

  for (const red of sortiraniRedovi) {
    redovi[red].sort((a, b) => a.broj - b.broj);
  }

  return { redovi, sortiraniRedovi };
}

function prikaziSalu() {
    
  const sala = document.getElementById("sala");

  if (!validirajPodatke(podaci)) {
    prikaziGresku();
    return;
  }

  const projekcija = podaci.projekcije[trenutnaProjekcijaIndex];
  const { redovi, sortiraniRedovi } = grupisiSjedistaPoRedovima(projekcija.sjedista);

  let oznakeRedovaHTML = `<div class="oznake-redova">`;
  let sjedistaHTML = `<div class="sjedista">`;

  for (const red of sortiraniRedovi) {
    oznakeRedovaHTML += `<div>${red}</div>`;

    for (const sjediste of redovi[red]) {
      sjedistaHTML += `<div class="sjediste ${sjediste.status}"
        data-red="${sjediste.red}"
        data-broj="${sjediste.broj}"
        title="Red ${sjediste.red}, sjedište ${sjediste.broj}"></div>`;
    }
  }

  oznakeRedovaHTML += `</div>`;
  sjedistaHTML += `</div>`;

  sala.innerHTML = `
    <div class="info">
      <h1>${projekcija.film}</h1>
      <div class="detalji">
        <p>Vrijeme projekcije: ${projekcija.vrijeme}</p>
        <p>Sala: 1</p>
      </div>
    </div>

    <hr class="linija">

    <div class="platno">PLATNO</div>

    <div class="sala-scroll">
      <div class="sala-container">
        ${oznakeRedovaHTML}
        ${sjedistaHTML}
      </div>
    </div>

    <hr class="linija">

    <div class="legenda">
      <div class="stavka-legende">
        <div class="kvadrat slobodno"></div>
        <span>Dostupno</span>
      </div>
      <div class="stavka-legende">
        <div class="kvadrat zauzeto"></div>
        <span>Zauzeto</span>
      </div>
      <div class="stavka-legende">
        <div class="kvadrat rezervisano"></div>
        <span>Rezervisano</span>
      </div>
    </div>
  `;

  osvjeziDugmad();
  dodajKlikNaSjedista();
}
function dodajKlikNaSjedista() {
  const elementiSjedista = document.querySelectorAll(".sjediste");

  elementiSjedista.forEach((element) => {
    element.addEventListener("click", function () {
      const red = this.dataset.red;
      const broj = Number(this.dataset.broj);

      const projekcija = podaci.projekcije[trenutnaProjekcijaIndex];
      const sjediste = projekcija.sjedista.find(
        (s) => s.red === red && s.broj === broj
      );

      if (sjediste && sjediste.status === "slobodno") {
        sjediste.status = "rezervisano";
        prikaziSalu();
      }
    });
  });
}

function idiNaPrethodnuProjekciju() {
  if (trenutnaProjekcijaIndex > 0) {
    trenutnaProjekcijaIndex--;
    prikaziSalu();
  }
}

function idiNaSljedecuProjekciju() {
  if (trenutnaProjekcijaIndex < podaci.projekcije.length - 1) {
    trenutnaProjekcijaIndex++;
    prikaziSalu();
  }
}

function osvjeziDugmad() {
  const prethodnaBtn = document.getElementById("prethodnaBtn");
  const sljedecaBtn = document.getElementById("sljedecaBtn");

  prethodnaBtn.disabled = trenutnaProjekcijaIndex === 0;
  sljedecaBtn.disabled = trenutnaProjekcijaIndex === podaci.projekcije.length - 1;
}


function pokreniAplikaciju() {
  document
    .getElementById("prethodnaBtn")
    .addEventListener("click", idiNaPrethodnuProjekciju);

  document
    .getElementById("sljedecaBtn")
    .addEventListener("click", idiNaSljedecuProjekciju);

  prikaziSalu();
}