const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const vm = require("vm");

const app = express();

app.use(cors());
app.use(express.json());

const APP_JS_FILE = path.join(__dirname, "..", "scripts", "app.js");

function readAppData() {
  const fileContent = fs.readFileSync(APP_JS_FILE, "utf8");

  const sandbox = {
    window: {}
  };

  vm.createContext(sandbox);
  vm.runInContext(fileContent, sandbox);

  if (!sandbox.window.podaci) {
    throw new Error("window.podaci nije pronađen u app.js.");
  }

  return sandbox.window.podaci;
}

function writeAppData(data) {
  const newContent = `window.podaci = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(APP_JS_FILE, newContent, "utf8");
}

app.get("/", (req, res) => {
  res.send("Server radi!");
});

app.get("/projekcije", (req, res) => {
  try {
    const data = readAppData();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri čitanju app.js fajla.",
      error: error.message
    });
  }
});

app.post("/rezervisi", (req, res) => {
  try {
    const { projekcijaIndex, red, broj } = req.body;

    const data = readAppData();

    if (
      projekcijaIndex === undefined ||
      projekcijaIndex < 0 ||
      projekcijaIndex >= data.projekcije.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Neispravna projekcija."
      });
    }

    const projekcija = data.projekcije[projekcijaIndex];

    const sjediste = projekcija.sjedista.find(
      (s) => s.red === red && s.broj === broj
    );

    if (!sjediste) {
      return res.status(404).json({
        success: false,
        message: "Sjedište nije pronađeno."
      });
    }

    if (sjediste.status !== "slobodno") {
      return res.status(400).json({
        success: false,
        message: "Sjedište nije slobodno."
      });
    }

    sjediste.status = "rezervisano";
    writeAppData(data);

    res.json({
      success: true,
      message: "Sjedište je rezervisano."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Greška pri upisu u app.js fajl.",
      error: error.message
    });
  }
});

app.listen(4000, () => {
  console.log("Server pokrenut na http://localhost:4000");
});