require("dotenv").config();
const express = require("express");
const connectToDatabase = require("./database");
const Blog = require("./model/blogModel");

const app = express();
app.use(express.json());
const { multer, storage } = require("./middleware/multerConfig");
const upload = multer({ storage: storage });
const fs = require("fs");
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173","blogspot-umber.vercel.app"]
  })
);

connectToDatabase();

app.get("/", (req, res) => {
  res.json({ message: "This is Homepage" });
});

app.post("/blog", upload.single("image"), async (req, res) => {
  const { title, subtitle, description } = req.body;
  let filename;
  if (req.file) {
    filename = `blogspot-umber.vercel.app/${req.file.filename}`
  }else {
    filename="https://www.chitkara.edu.in/blogs/wp-content/uploads/2023/09/Blogging-in-Digital-Marketing.jpg"
  }

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
  const blog = await Blog.findByIdAndDelete(id);
  const imageName = blog.image;
  fs.unlink(`storage/${imageName}`, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("File deleted successfully");
    }
  });
  res.status(200).json({
    message: "Blog Deleted Successfully",
  });
});

app.patch("/blog/:id", upload.single("image"), async (req, res) => {
  const id = req.params.id;
  const { title, subtitle, description } = req.body;
  let imageName;
  if (req.file) {
    imageName =  `blogspot-umber.vercel.app/${req.file.filename}`
    const blog = await Blog.findById(id);
    const oldImageName = blog.image;
    fs.unlink(`storage/${oldImageName}`, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("File deleted successfully");
      }
    });
  }
  await Blog.findByIdAndUpdate(id, {
    title: title,
    subtitle: subtitle,
    description: description,
    image: imageName,
  });
  res.status(200).json({
    message: "Blog Updated successfully",
  });
});

app.use(express.static("./storage"));

app.listen(process.env.PORT, () => {
  console.log("NodeJS project has started");
});
