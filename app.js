require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./database");
const Blog = require("./model/blogModel");

const app = express();
app.use(express.json());
const { multer, storage } = require("./middleware/multerConfig");
const upload = multer({ storage: storage });
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

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

app.get("/blog/:id", async (req, res) => {
  const id = req.params.id;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json({
      message: "No blog found",
    });
  }
  res.status(200).json({
    message: "Fetched successfully",
    data: blog,
  });
});

app.delete("/blog/:id", async (req, res) => {
  const id = req.params.id;
  await Blog.findByIdAndDelete(id);
  res.status(200).json({
    message:"Blog Deleted Successfully"
  })
});

app.use(express.static("./storage"));

app.listen(process.env.PORT, () => {
  console.log("NodeJS project has started");
});
