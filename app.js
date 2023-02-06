const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
const moment = require('moment')
const nunjucks = require('nunjucks')
const favicon = require('serve-favicon')
const requestIP = require('request-ip');
const fs = require('fs')

const { sequelize, Chat } = require('./models');
const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');
const imageRouter = require('./routes/image');
const multer = require('multer')

require('moment-timezone')
moment.tz.setDefault('Asia/Seoul');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'html')
nunjucks.configure('views', {
    express:app,
    watch: true,
});
sequelize.sync({ force: false })
    .then(() => {
        console.log('DB 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use('/', indexRouter);
app.use('/chat', chatRouter);
app.use('/image', imageRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} X`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
})

io.on("connection", (socket) => {
    // chat
    socket.on("chatting", (data) => {
        var { name, msg } = data;
        /* 유저 정보 수집
        const clientIP = socket.request.connection.remoteAddress;
        const userAgent = socket.handshake.headers['user-agent'];
        */
        const time = moment(new Date()).format("h:mm A");
        
        if (name === undefined || name == null || name == '')
            name = '뿌요미';
        if (msg === undefined || msg == null || msg == '')
            msg = '뿌꾸 사랑해';
        
        if (name.length > 10) {
            name = name.substr(0, 10);
        }

        const reg = /<[^>]*>?/g
        name = name.replace(reg, '');
        msg = msg.replace(reg, '');

        if (name.indexOf('>_') !== -1) {
            name = name.replace('>_', '>_<');
        }

        if (msg.indexOf('>_') !== -1) {
            msg = msg.replace('>_', '>_<');
        }

        Chat.create({
            name,
            msg,
            time
        })
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.error(err);
        });

        io.emit("chatting", {
            name,
            msg,
            time
        })
    });

    // image
    socket.on('image', (data) => {
        console.log(data);
    })
});

server.listen(5000, () => {
    const dir = "./uploads";
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir);
    console.log('서버 실행');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: storage});