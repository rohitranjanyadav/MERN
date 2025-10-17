const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "This is Homepage" });
});

app.get("/about", (req, res) => {
  res.json({ message: "About Page" });
});

app.listen(3000, () => {
  console.log("NodeJS project has started");
});
