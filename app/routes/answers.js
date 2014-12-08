var express = require('express');
var swig  = require('swig');
var router = express.Router();

/* POST new answer to question */
router.post('/questions/:id/answers', function (req, res) {
    req.models.question.get( //get q to which we post
        req.params.id,
        {}, // no options
        function (err, question) {
            if (err) { //Not found?
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            console.log("Adding answer to question " + question.id);
            req.models.answer.create( //Create the q
                [{ title: req.body.title, content: req.body.content, question_id: question.id }],
                function (err, answers_created) {
                    if (err) { //Any breakage at this point is gonna be server-side. Of course, that will never happen.
                        console.log('error!', err);
                        if (req.accepts('html', 'json') === 'json') {
                            res.type('json');
                            res.status(500).send(JSON.stringify(err));
                            return;
                        }
                        res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                        return;
                    }
                    if (req.accepts('html', 'json') === false) { //Can't return what you want me to return :(
                        res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                        return;
                    }
                    if (req.accepts('html', 'json') === 'json') { //Show JSON output
                        res.type('json');
                        res.send(JSON.stringify(answers_created).replace(/,?"(answers|comments)":\[[^\]]*\]/g, "")); //We don't want to see answers or comments here!
                    } else {
                        res.redirect(303, '/questions/' + question.id); //Go back to question
                    }
                }
            );
        }
    );
});

/* GET answer */
router.get('/questions/:qid/answers/:aid', function (req, res) {
    req.models.answer.get( //fetch from db
        req.params.aid,
        {}, // no options
        function (err, answer) {
            if (err) { //Not found?
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //Only display the answer if it's requested for the right question
            if (answer.question_id !== parseInt(req.params.qid, 10)) { //sanitise question ID
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            // send to the client what we found in the DB
            answer.getComments(function (err, comments) {
                if (req.accepts('html', 'json') === false) { //not acceptable
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') { //JSON output
                    res.type('json');
                    res.send(JSON.stringify(answer).replace(/,?"(answers|comments)":\[[^\]]*\]/g, "")); //Don't show answers or comments here
                } else {
                    res.render('answer', {answer: answer});
                }
            });
        }
    );
});

/* PUT edits an answer */
router.put('/questions/:qid/answers/:aid', function (req, res) {
    req.models.answer.get( //fetch ans to edit
        req.params.aid,
        {}, // no options
        function (err, answer) {
            if (err) { //404?
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            if (answer.question_id !== parseInt(req.params.qid, 10)) { //sanitise question ID
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            answer.save({title: req.body.title, content: req.body.content}, function (err) { //Edit it!
                if (err) { //Any error at this point is critical, and server-side
                    console.log('error!', err);
                    if (req.accepts('html', 'json') === 'json') {
                        res.type('json');
                        res.status(500).send(JSON.stringify(err));
                        return;
                    }
                    res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                    return;
                }
            });
            if (req.accepts('html', 'json') === false) { //Not acceptable
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') { //JSON
                res.type('json');
                res.send(JSON.stringify(answer).replace(/,?"(answers|comments)":\[[^\]]*\]/g, "")); //hide answers and comments from this output
            } else {
                res.redirect(303, '/questions/' + req.params.qid + '/answers/' + req.params.aid); //Show them the edited answer
            }
        }
    );
});

/* DELETE answer */
router.delete('/questions/:qid/answers/:aid', function (req, res) { //fetch answer to dump
    req.models.answer.get(
        req.params.aid,
        {}, // no options
        function (err, answer) {
            if (err) { //not found?
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            if (answer.question_id !== parseInt(req.params.qid, 10)) { //sanitise qid
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            answer.remove(function (err) { //remove ans
                if (err) { //Didn't work? That's a 500
                    console.log('error!', err);
                    if (req.accepts('html', 'json') === 'json') {
                        res.type('json');
                        res.status(500).send(JSON.stringify(err));
                        return;
                    }
                    res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                    return;
                }
                if (req.accepts('html', 'json') === false) { //Unacceptable!
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') { //simple JSON confirmation
                    res.type('json');
                    res.send(JSON.stringify({message: "success"}));
                } else {
                    res.redirect(303, '/questions/' + req.params.qid); //take them one level up
                }
            });
        }
    );
});

/* GET all answers to a question */
router.get('/questions/:id/answers', function (req, res) {
    req.models.question.get( //get the question for which we want answers
        req.params.id,
        {}, // no options
        function (err, question) {
            if (err) { //404?
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            question.getAnswers(function (err, answers) { //get all the answers
                // send to the client what we found in the DB
                if (req.accepts('html', 'json') === false) { //not acceptable
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') { //json list
                    res.type('json');
                    res.send(JSON.stringify(answers).replace(/,?"(answers|comments)":\[[^\]]*\]/g, "")); //no need for comments
                } else {
                    res.redirect(301, '/questions/' + req.params.id); //HTML shouldn't be looking here
                }
            });
        }
    );
});

module.exports = router;
