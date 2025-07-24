const express = require("express");
const app = express();
const multer = require("multer");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv").config();
const model = require("./models/models");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.set("view engine", "ejs");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/uploads", upload.single("file"), async (req, res, next) => {
  try {
    const fileData = new model({
      filename: req.body.filename,
      filepath: `/uploads/${req.file.filename}`,
    });

    await fileData.save();
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.status(500).send("Upload failed");
  }
});

app.get("/get", async (req, res) => {
  const find = await model.find({});

  res.json(find);
});

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("database connect");
});

app.listen(process.env.PORT, () => {
  console.log(`server listen on port ${process.env.PORT}`);
});
