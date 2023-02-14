const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const sequelize = require("sequelize");
const Chat = require("../models").Chat;
const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더 생성...");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", async (req, res) => {
  let result = await Chat.findAll({
    limit: 6,
    order: [["id", "DESC"]],
  });

  if (result) {
    result = result.reverse();
    res.render("index", { chats: result });
  } else {
    res.render("index");
  }
});

router.post("/img", upload.single("img"), async (req, res) => {
  console.log(req.file);
  try {
    const chat = await Chat.create({
      name: "뿌요미",
      img: req.file.path,
      time: moment(new Date()).format("h:mm A"),
    });

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
