var express = require('express');
var router = express.Router();

var questions = [
    {title:"Name", content:"What is your name?"}, 
    {title:"Surname", content:"What is your surname?"}, 
    {title:"Study", content: "What do you study?"}
];

/* GET questions listing. */
router.get('/', function(req, res) {
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


/* GET single question. */
router.get('/questions/:id', function(req, res) {
  if(questions.length <= req.params.id || req.params.id < 0) {
    res.statusCode = 404;
    res.render('questions', { title: "Error 404", content: "No question found" });
  }  
  var q = questions[req.params.id];
  res.render('questions', { title: "title", content: "content" });
});

/* POST add a question */
router.post('/questions/', function (req, res) {

	// Note: Needs to validate the data
	// received through the request, to make sure
	// we get all the information we need or expect
	// node-orm2 provides some utilities for validating the models
	req.models.question.create(
			[{
				title: req.body.title,
				content: req.body.content
			},], // object
			function (err, devices_created) {
				res.send(JSON.stringify(questions_created));
			});
});

module.exports = router;
