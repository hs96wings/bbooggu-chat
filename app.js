const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const moment = require("moment");
const nunjucks = require("nunjucks");
const favicon = require("serve-favicon");
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
// const requestIP = require("request-ip");
const passport = require('passport');
const flash = require('express-flash');

const { sequelize, Chat } = require("./models");
const passportConfig = require('./passport');
const indexRouter = require("./routes/index");
const chatRouter = require("./routes/chat");
const imageRouter = require("./routes/image");
const infoRouter = require("./routes/info");
const momentRouter = require("./routes/moment");
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth')

require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
passportConfig();
app.set("port", process.env.PORT || 5000);
app.set("view engine", "html");
app.use(morgan('dev'));
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
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/uploads", express.static("./uploads"));
app.use("/chat", chatRouter);
app.use("/image", imageRouter);
app.use("/info", infoRouter);
app.use("/moment", momentRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

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

    const urlReg = /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    let urlTmp = msg.match(urlReg);
    if (urlTmp != null) {
      for (url of urlTmp) {
        if (url.indexOf('http') == -1)
          msg = msg.replace(url, '<a href="https://' + url + '">' + url + '</a>');
        else
          msg = msg.replace(url, '<a href="' + url + '">' + url + '</a>');
      }
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
