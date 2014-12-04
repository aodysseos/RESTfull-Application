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
        req.models.question.get(
                        req.params.id,
                        {}, // no options
                        function (err, question) {
                                if (err) {
                                        console.log('error!', err);
					res.status(404).send(req.url + " not found\n\n");
                                        return;
                                }
                                // send to the client what we found in the DB
                                res.send(JSON.stringify(question));
                        });
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
			[{ title: q_title, content: q_content },],
			function (err, questions_created) {
				res.send(JSON.stringify(questions_created));
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
					console.log("Removed question " + req.params.id + "\n");
					res.send("Removed question " + req.params.id + "\n");
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
				res.send(JSON.stringify(question));
                        });
});


module.exports = router;
