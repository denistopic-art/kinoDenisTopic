function prikaziOsnovnuSalu() {
  const sala = document.getElementById("sala");

  sala.innerHTML = `
    <div class="info">
      <h1>Kino sala</h1>
      <div class="detalji">
        <p>Film i vrijeme će biti učitani iz JavaScript-a.</p>
      </div>
    </div>
  `;
}