const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

app.get("/", (req, res) => {
  res.send("Server radi!");
});

app.get("/projekcije", (req, res) => {
  const data = readData();
  res.json(data);
});

app.post("/rezervisi", (req, res) => {
  const { projekcijaIndex, red, broj } = req.body;

  const data = readData();

  if (
    projekcijaIndex === undefined ||
    !data.projekcije[projekcijaIndex]
  ) {
    return res.status(400).json({ success: false, message: "Neispravna projekcija." });
  }

  const sjediste = data.projekcije[projekcijaIndex].sjedista.find(
    (s) => s.red === red && s.broj === broj
  );

  if (!sjediste) {
    return res.status(404).json({ success: false, message: "Sjedište nije pronađeno." });
  }

  if (sjediste.status !== "slobodno") {
    return res.status(400).json({ success: false, message: "Sjedište nije slobodno." });
  }

  sjediste.status = "rezervisano";
  writeData(data);

  res.json({ success: true, message: "Sjedište je rezervisano." });
});

app.listen(3000, () => {
  console.log("Server pokrenut na http://localhost:3000");
});