const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const moment = require("moment");
const nunjucks = require("nunjucks");
const favicon = require("serve-favicon");
const requestIP = require("request-ip");
const fs = require("fs");

const { sequelize, Chat } = require("./models");
const indexRouter = require("./routes/index");
const chatRouter = require("./routes/chat");
const imageRouter = require("./routes/image");
const infoRouter = require("./routes/info");
const momentRouter = require("./routes/moment");
const multer = require("multer");

require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.set("port", process.env.PORT || 5000);
app.set("view engine", "html");
nunjucks.configure("views", {
  express: app,
  watch: true,
});
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("DB 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use("/", indexRouter);
app.use("/uploads", express.static("./uploads"));
app.use("/chat", chatRouter);
app.use("/image", imageRouter);
app.use("/info", infoRouter);
app.use("/moment", momentRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} X`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

io.on("connection", (socket) => {
  // chat
  socket.on("chatting", (data) => {
    let { msg } = data;
    const time = moment(new Date()).format("h:mm A");

    if (msg === undefined || msg == null || msg == "") msg = "뿌꾸 사랑해";

    const reg = /<[^>]*>?/g;
    msg = msg.replace(reg, "");

    if (msg.indexOf(">_") !== -1) {
      msg = msg.replace(">_", ">_<");
    }

    Chat.create({
      msg,
      time,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });

    io.emit("chatting", {
      msg,
      time,
    });
  });

  // image
  socket.on("imaging", (data) => {
    let { img } = data;
    const time = moment(new Date()).format("h:mm A");

    io.emit("imaging", {
      img,
      time,
    });
  });
});

server.listen(5000, () => {
  console.log("서버 실행");
});
