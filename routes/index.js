const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
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
    limit: 10,
    order: [["id", "DESC"]],
  });

  if (result) {
    result = result.reverse();
    let id = result[0].dataValues.id
    res.render("index", { chats: result, user: req.user, id: id});
  } else {
    res.render("index");
  }
});

router.post("/img", upload.single("img"), async (req, res) => {
  try {
    const chat = await Chat.create({
      img: req.file.path,
      time: moment(new Date()).format("h:mm A"),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });

    res.json({ img: req.file.path });
  } catch (error) {
    console.log(error);
  }
});

router.post("/more", async(req, res) => {
  let chatId = parseInt(req.body.id);
  let result = await Chat.findAll({
    limit: 10,
    order: [["id", "DESC"]],
    where: {
      id: {[Op.lt]: chatId},
    }
  });

  if (result) {
    res.send({result: result});
  }
})

router.get('/moment', async (req, res) => {
  res.render('moment.html');
})

router.post("/moment/add", async(req, res) => {
  res.send({result: 'success'});
})

module.exports = router;
