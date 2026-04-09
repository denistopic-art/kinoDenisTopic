const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
  const data = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(data);
}

app.get("/", (req, res) => {
  res.send("Server radi!");
});

app.get("/projekcije", (req, res) => {
  const data = readData();
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server pokrenut na http://localhost:3000");
});