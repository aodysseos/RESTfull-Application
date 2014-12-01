var express = require('express');
var router = express.Router();

/* GET questions listing. */
router.get('/questions', function(req, res) {
	req.models.question.find(
			{}, // search parameters: anything 
			{}, // no options
			function (err, question_list) {
				if (err) {
					console.log('error!', err);
					return;
				}
				// send to the client what we found in the DB
				res.render('questions', JSON.stringify(question_list));
				//res.send(JSON.stringify(all_questions));
			});
});

/* POST a question */
router.post('/questions', function (req, res) {
	var q_title = req.body.title;
	var q_content = req.body.content;
	// Note: Needs to validate the data
	// received through the request, to make sure
	// we get all the information we need or expect
	// node-orm2 provides some utilities for validating the models
	req.models.question.create(
			[{ title: q_title,	content: q_content },],
			function (err, questions_created) {
				res.send(JSON.stringify(questions_created));
			});
});

/* GET single question. */
router.get('/questions/:id', function(req, res) {
  	if(questions.length <= req.params.id || req.params.id < 0) {
	    res.statusCode = 404;
	    res.render('questions', { title: "Error 404", content: "No question found" });
  	}  
  	var q = questions[req.params.id];
 	res.render('questions', { title: q.title, content: q.content });
});

module.exports = router;
