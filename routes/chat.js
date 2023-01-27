const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('chat', { title: '이전 대화 보기' });
});

module.exports = router;