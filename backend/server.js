const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server radi!");
});

app.listen(3000, () => {
  console.log("Server pokrenut na http://localhost:3000");
});