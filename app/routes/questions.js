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
				if(req.accepts('html', 'json') == 'json')
					res.send(JSON.stringify(all_questions));
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
                                // send to the client what we found in the DB
                                if(req.accepts('html', 'json') == 'json')
                                        res.send(JSON.stringify(question));
                                else
                                        res.render('question', {question: question});
				});
                        });
});

/* POST add a question */
router.post('/questions', function (req, res) {
	var q_title = req.body.title;
	var q_content = req.body.content;
	// Note: Needs to validate the data
	// received through the request, to make sure
	// we get all the information we need or expect
	// node-orm2 provides some utilities for validating the models
	req.models.question.create(
			[{ title: q_title, content: q_content },],
			function (err, questions_created)
			{
				if(req.accepts('html', 'json') == 'json')
					res.send(JSON.stringify(questions_created));
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
                                if(req.accepts('html', 'json') == 'json')
                                        res.send(JSON.stringify({deleted: true}));
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
				if(req.accepts('html', 'json') == 'json')
					res.send(JSON.stringify(question));
				else
					res.redirect(303, '/questions/' + req.params.id);
                        });
});

/* POST new answer to question */
router.post('/questions/:id/answers', function(req, res) {
	req.models.question.get(
		req.params.id,
		{}, // no options
		  function (err, question) {
                                if (err) {
                                        console.log('error!', err);
                                        res.status(404).send(req.url + " not found\n\n");
                                        return;
                                }
		console.log("Adding answer to question " + question.id);
		req.models.answer.create(
			[{ title: req.body.title, content: req.body.content, question_id: question.id },],
			function (err, answers_created)
			{
				if(err)
					console.log(err);
								if(req.accepts('html', 'json') == 'json')
					res.send(JSON.stringify(answers_created));
				else
					res.redirect(303, '/questions/' + question.id);
			});
});
});

/* GET answer */
router.get('/questions/:qid/answers/:aid', function(req, res) {
        req.models.answer.get(
                        req.params.aid,
                        {}, // no options
                        function (err, answer) {
                                if (err) {
                                        console.log('error!', err);
                                        res.status(404).send(req.url + " not found\n\n");
                                        return;
                                }
				//Only display the answer if it's requested for the right question
				if(answer.question_id != req.params.qid)
				{
					console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
					res.status(409).send("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id + "\n\n");
					return;
				}
                                // send to the client what we found in the DB
                                if(req.accepts('html', 'json') == 'json')
                                        res.send(JSON.stringify(answer));
                                else
                                        res.render('answer', {answer: answer});
                        });
});

/* PUT edits an answer */
router.put('/questions/:qid/answers/:aid', function(req, res) {
        req.models.answer.get(
                        req.params.aid,
                        {}, // no options
                        function (err, answer) {
                                if (err) {
                                        console.log('error!', err);
                                        res.status(404).send(req.url + " not found\n\n");
                                        return;
                                }
				if(answer.question_id != req.params.qid)
                                {
                                        console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                                        res.status(409).send("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id + "\n\n");
                                        return;
                                }

                                answer.save({title: req.body.title, content: req.body.content}, function(err){
                                        if(err)
                                        {
                                                console.log('error!', err);
						res.status(500).send("500: Internal Server Error\n\n");
                                                return;
                                        }
                                });
                                if(req.accepts('html', 'json') == 'json')
                                        res.send(JSON.stringify(answer));
                                else
                                        res.redirect(303, '/questions/' + req.params.qid + '/answers/' + req.params.aid);
                        });
});

/* DELETE answer */
router.delete('/questions/:qid/answers/:aid', function(req, res) {
        req.models.answer.get(
                        req.params.aid,
                        {}, // no options
                        function (err, answer) {
                                if (err) {
                                        console.log('error!', err);
                                        res.status(404).send(req.url + " not found\n\n");
                                        return;
                                }
				if(answer.question_id != req.params.qid)
				{
					console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
					res.status(409).send("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id + "\n\n");
					return;
				}
                                answer.remove(function(err){
                                        if(err)
                                        {
                                                console.log('error!', err);
                                                return;
                                        }
                                if(req.accepts('html', 'json') == 'json')
                                        res.send(JSON.stringify({deleted: true}));
                                else
                                        res.redirect(303, '/questions/' + req.params.qid);

                                });
                        });
});
	

module.exports = router;
