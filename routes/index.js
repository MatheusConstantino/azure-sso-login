var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'SSO Azure Login',
        isAuthenticated: req.session.isAuthenticated,
        username: req.session.account?.username,
        name: req.session.account?.preferred_username,
    });
});

module.exports = router;