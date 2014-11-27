var express = require('express');
var router = express.Router();

/* GET questions listing. */
router.get('/', function(req, res) {
   req.models.question.find();
   res.render('questions', { question: 'Question' });
});

/* POST question listing. */
router.get('/', function(req, res) {
   req.models.question.find();
   res.render('questions', { question: 'Question' });
});

module.exports = router;
