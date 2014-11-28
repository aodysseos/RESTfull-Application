var express = require('express');
var router = express.Router();

/* GET questions listing. */
router.get('/questions', function(req, res) {
	req.models.question.find(
			{}, // search parameters: anything 
			{}, // no options
			function (err, all_questions) {
				if (err) {
					console.log('error!', err);
					return;
				}
				// send to the client what we found in the DB
				res.send(JSON.stringify(all_questions));
			});
});

/* GET form add a question */
router.get('/questions/add', function (req, res) {
	 res.render('add', { title: "Add a question" });
});

/* GET single question. */
router.get('/questions/:id', function(req, res) {
	var questions = [
	    {title:"Name", content:"What is your name?"}, 
	    {title:"Surname", content:"What is your surname?"}, 
	    {title:"Study", content: "What do you study?"}
	];

  	if(questions.length <= req.params.id || req.params.id < 0) {
	    res.statusCode = 404;
	    res.render('questions', { title: "Error 404", content: "No question found" });
  	}  
  	
  	var q = questions[req.params.id];
 	res.render('questions', { title: q.title, content: q.content });
});

/* POST add a question */
router.post('/questions/add', function (req, res) {
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

module.exports = router;
