const express = require('express')
const sequelize = require('sequelize');
const Chat = require('../models').Chat;
const router = express.Router();

router.get('/', async (req, res) => {
    let result = await Chat.findAll({
        limit: 6,
        order: [
            ['id', 'DESC'],
        ]
    });

    if (result) {
        result = result.reverse();
        res.render('index', {chats: result});
    } else {
        res.render('index');
    }

});

module.exports = router;