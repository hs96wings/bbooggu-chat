const express = require('express')
const sequelize = require("sequelize");
const Chat = require("../models").Chat;
const Black = require('../models').Black;
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', isNotLoggedIn, (req, res, next) => {
    res.render('login');
});

router.get('/manage', isLoggedIn, async (req, res, next) => {
    let result = await Chat.findAll({
        limit: 300,
        order: [["id", "DESC"]],
      });
    
      if (result) {
        res.render("admin", { chats: result, title: "이전 대화 목록" });
      } else {
        res.render("admin", { message: "데이터를 불러오는 데 실패했습니다" });
      }
});

router.post('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        await Chat.destroy({ where: { id: req.params.id }});
    } catch (error) {
        req.flash('error', 'id가 잘못되었습니다');
    }
    res.redirect('/admin/manage');
})

router.post('/block', isLoggedIn, async (req, res, next) => {
    const ip = req.body.ip;
    const sid = req.body.sid;
    const io = req.app.get('io');
    const addBlack = Black.create({ black: ip });

    console.log(ip);
    console.log(sid);
    if (addBlack) {
        req.flash('success', 'ip가 차단되었습니다');
    } else {
        req.flash('error', '유효하지 않은 ip입니다');
    }

    io.sockets.sockets.forEach((socket) => {
        if (socket.id == sid)
            socket.disconnect(true);
    });
    
    res.redirect('/admin/manage');
})

module.exports = router;