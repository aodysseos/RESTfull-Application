var express = require('express');
var swig  = require('swig');
var router = express.Router();

/* GET questions listing. */
router.get('/questions', function (req, res) {
    req.models.question.find(
        {}, // search parameters: anything 
        {}, // no options
        function (err, all_questions) {
            if (err) {
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(500).send(JSON.stringify(err));
                    return;
                }
                res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                return;
            }
            // send to the client what we found in the DB
            if (req.accepts('html', 'json') === false) {
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.stringify(all_questions).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
            } else {
                res.render('questions', {all_questions: all_questions});
            }
        }
    );
});

/* GET single question. */
router.get('/questions/:id', function (req, res) {
    req.models.question.get(
        req.params.id,
        {}, // no options
        function (err, question) {
            if (err) {
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            question.getAnswers(function (err, answers) {
                question.getComments(function (err, comments) {
                    // send to the client what we found in the DB
                    if (req.accepts('html', 'json') === false) {
                        res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                        return;
                    }
                    if (req.accepts('html', 'json') === 'json') {
                        res.type('json');
                        res.send(JSON.stringify(question).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
                    } else {
                        res.render('question', {question: question});
                    }
                });
            });
        }
    );
});

/* POST add a question */
router.post('/questions', function (req, res) {
    // Note: Needs to validate the data
    // received through the request, to make sure
    // we get all the information we need or expect
    // node-orm2 provides some utilities for validating the models
    req.models.question.create(
        [{ title: req.body.title, content: req.body.content }],
        function (err, questions_created) {
            if (err) {
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(500).send(JSON.stringify(err));
                    return;
                }
                res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                return;
            }
            if (req.accepts('html', 'json') === false) {
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.stringify(questions_created).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
            } else {
                res.redirect(303, '/questions/' + questions_created[0].id);
            }
        }
    );
});

/* DELETE a question */
router.delete('/questions/:id', function (req, res) {
    req.models.question.get(
        req.params.id,
        {}, // no options
        function (err, question) {
            if (err) {
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            question.remove(function (err) {
                if (err) {
                    console.log('error!', err);
                    return;
                }
                if (req.accepts('html', 'json') === false) {
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.send(JSON.stringify({message: "success"}));
                } else {
                    res.redirect(303, '/questions');
                }
            });
        }
    );
});

/* PUT edits a question */
router.put('/questions/:id', function (req, res) {
    req.models.question.get(
        req.params.id,
        {}, // no options
        function (err, question) {
            if (err) {
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            question.save({title: req.body.title, content: req.body.content}, function (err) {
                if (err) {
                    console.log('error!', err);
                    return;
                }
            });
            if (req.accepts('html', 'json') === false) {
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.stringify(question).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
            } else {
                res.redirect(303, '/questions/' + req.params.id);
            }
        }
    );
});

module.exports = router;
