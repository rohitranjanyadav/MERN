require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./database");

const app = express();
app.use(express.json());

connectToDatabase();

app.get("/", (req, res) => {
  res.json({ message: "This is Homepage" });
});

app.post("/blog", (req, res) => {
  const {title,subtitle,description,image} = req.body;
  res.status(200).json({
    message: "Blog API hit successfully",
  });
});

app.listen(process.env.PORT, () => {
  console.log("NodeJS project has started");
});
