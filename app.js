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
  const filename = req.file.filename;

  if (!title || !subtitle || !description) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  await Blog.create({
    title: title,
    subtitle: subtitle,
    description: description,
    image: filename,
  });

  res.status(200).json({
    message: "Blog API hit successfully",
  });
});

app.get("/blog", async (req, res) => {
  const blogs = await Blog.find();
  res.status(200).json({
    message: "Blogs fetched successfully",
    data: blogs,
  });
});

app.use(express.static("./storage"));

app.listen(process.env.PORT, () => {
  console.log("NodeJS project has started");
});
