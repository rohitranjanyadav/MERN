require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./database");
const Blog = require("./model/blogModel");

const app = express();
app.use(express.json());

connectToDatabase();

app.get("/", (req, res) => {
  res.json({ message: "This is Homepage" });
});

app.post("/blog", async (req, res) => {
  const { title, subtitle, description, image } = req.body;

  if (!title || !subtitle || !description || !image) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  await Blog.create({
    title: title,
    subtitle: subtitle,
    description: description,
    image: image,
  });

  res.status(200).json({
    message: "Blog API hit successfully",
  });
});

app.listen(process.env.PORT, () => {
  console.log("NodeJS project has started");
});
