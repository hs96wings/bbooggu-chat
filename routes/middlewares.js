exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', '로그인이 필요합니다');
        res.redirect('/');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', '로그인한 상태입니다');
        res.redirect('/');
    }
};