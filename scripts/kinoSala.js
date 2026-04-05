let trenutnaProjekcijaIndex = 0;

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
  const projekcija = podaci.projekcije[trenutnaProjekcijaIndex];
  const { redovi, sortiraniRedovi } = grupisiSjedistaPoRedovima(projekcija.sjedista);

  let oznakeRedovaHTML = `<div class="oznake-redova">`;
  let sjedistaHTML = `<div class="sjedista">`;

  for (const red of sortiraniRedovi) {
    oznakeRedovaHTML += `<div>${red}</div>`;

    for (const sjediste of redovi[red]) {
      sjedistaHTML += `
        <div class="sjediste ${sjediste.status}"></div>
      `;
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
}