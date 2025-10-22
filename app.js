require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./database");
const Blog = require("./model/blogModel");

const app = express();
app.use(express.json());
const { multer, storage } = require("./middleware/multerConfig");
const upload = multer({ storage: storage });

connectToDatabase();

app.get("/", (req, res) => {
  res.json({ message: "This is Homepage" });
});

app.post("/blog", upload.single("image"), async (req, res) => {
  const { title, subtitle, description } = req.body;
  const image = req.file ? req.file.filename : null;

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
