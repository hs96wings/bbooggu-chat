const express = require('express')
const sequelize = require('sequelize');
const Chat = require('../models').Chat;
const router = express.Router();

router.get('/', async (req, res, next) => {
    let result = await Chat.findAll({
        order: [
            ['id', 'DESC'],
        ]
    });

    if (result) {
        res.render('chat', {chats: result, title: '이전 대화 목록'});
    } else {
        res.render('error', {message: '데이터를 불러오는 데 실패했습니다'});
    }

});

module.exports = router;