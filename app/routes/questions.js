var express = require('express');
var swig  = require('swig');
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
			if(req.accepts('html', 'json') == false)
			{
				res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
				return;
			}
			else if(req.accepts('html', 'json') == 'json')
			{
				res.type('json');
				res.send(JSON.stringify(all_questions));
			}
			else
				res.render('questions', {all_questions: all_questions});
	});
});

/* GET single question. */
router.get('/questions/:id', function(req, res) {
	req.models.question.get(
		req.params.id,
		{}, // no options
		function (err, question) {
			if (err) {
				console.log('error!', err);
				res.status(404).send(req.url + " not found\n\n");
				return;
			}
			question.getAnswers(function(err, answers){
				question.getComments(function(err, comments){
					// send to the client what we found in the DB
					if(req.accepts('html', 'json') == false)
					{
						res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
						return;
					}
					else if(req.accepts('html', 'json') == 'json')
					{
						res.type('json');
						res.send(JSON.stringify(question));
					}
					else
						res.render('question', {question: question});
				});
			});
	});
});

/* POST add a question */
router.post('/questions', function (req, res) {
	// Note: Needs to validate the data
	// received through the request, to make sure
	// we get all the information we need or expect
	// node-orm2 provides some utilities for validating the models
	req.models.question.create(
		[{ title: req.body.title, content: req.body.content },],
		function (err, questions_created) {
			if(req.accepts('html', 'json') == false)
			{
				res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
				return;
			}
			else if(req.accepts('html', 'json') == 'json')
			{
				res.type('json');
				res.send(JSON.stringify(questions_created));
			}
			else
				res.redirect(303, '/questions/' + questions_created[0].id);
	});
});

/* DELETE a question */
router.delete('/questions/:id', function(req, res) {
	req.models.question.get(
		req.params.id,
		{}, // no options
		function (err, question) {
			if (err) {
				console.log('error!', err);
				res.status(404).send(req.url + " not found\n\n");
				return;
			}
			question.remove(function(err){
				if(err)
				{
					console.log('error!', err);
					return;
				}
				if(req.accepts('html', 'json') == false)
				{
					res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
					return;
				}
				else if(req.accepts('html', 'json') == 'json')
				{
					res.type('json');
					res.send(JSON.stringify({deleted: true}));
				}
				else
					res.redirect(303, '/questions');
			});
	});
});

/* PUT edits a question */
router.put('/questions/:id', function(req, res) {
	req.models.question.get(
		req.params.id,
		{}, // no options
		function (err, question) {
			if (err) {
				console.log('error!', err);
				res.status(404).send(req.url + " not found\n\n");
				return;
			}
			question.save({title: req.body.title, content: req.body.content}, function(err){
				if(err)
				{
					console.log('error!', err);
					return;
				}
			});
			if(req.accepts('html', 'json') == false)
			{
				res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
				return;
			}
			else if(req.accepts('html', 'json') == 'json')
			{
				res.type('json');
				res.send(JSON.stringify(question));
			}
			else
				res.redirect(303, '/questions/' + req.params.id);
	});
});

module.exports = router;
