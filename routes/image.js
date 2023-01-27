const express = require('express')
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('image', { title: '이미지 보기' });
});

module.exports = router;