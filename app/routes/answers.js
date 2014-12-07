var express = require('express');
var swig  = require('swig');
var router = express.Router();

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
