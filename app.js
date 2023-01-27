const express = require('express')
const http = require('http')
const app = express();
const router = express.Router()
const path = require('path')
const server = http.createServer(app);
const socketIO = require('socket.io')
const moment = require('moment')

const chatRouter = require('./routes/chat');
const imageRouter = require('./routes/image');

require('moment-timezone')
moment.tz.setDefault('Asia/Seoul');

const io = socketIO(server);
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)
app.use(express.static(path.join(__dirname, "src")))
app.use('/chat', chatRouter);
app.use('/image', imageRouter);

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
})

io.on("connection", (socket) => {
    socket.on("chatting", (data) => {
        const { name, msg } = data;
        io.emit("chatting", {
            name,
            msg,
            time: moment(new Date()).format("h:mm A")
        })
    })
});

server.listen(PORT, () => console.log(`server is running ${PORT}`));