var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.accepts('html', 'json') === false) {
        res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
        return;
    }
    if (req.accepts('html', 'json') === 'json') {
        res.type('json');
        res.send(JSON.stringify({online: true}));
    } else {
        res.render('index');
    }
});

module.exports = router;