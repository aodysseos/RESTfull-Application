var express = require('express');
var swig  = require('swig');
var router = express.Router();

/* GET questions listing. */
router.get('/questions', function (req, res) {
    req.models.question.find( //find all qs
        {}, // search parameters: anything 
        {}, // no options
        function (err, all_questions) {
            if (err) { //In case of errors, inform the user
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') { //Special case for JSON
                    res.type('json');
                    res.status(500).send(JSON.stringify(err));
                    return;
                }
                res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)}); //HTML error
                return;
            }
            // send to the client what we found in the DB
            if (req.accepts('html', 'json') === false) { //We only accept JSON and HTML requests. Refuse anything else.
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') { //If JSON is preferred, give them JSON
                res.type('json');
                res.send(JSON.stringify(all_questions).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
            } else {
                res.render('questions', {all_questions: all_questions}); //Render HTML question list
            }
        }
    );
});

/* GET single question. */
router.get('/questions/:id', function (req, res) {
    req.models.question.get( //get specific q from db
        req.params.id, //identify it by ID
        {}, // no options
        function (err, question) {
            if (err) { //throw errors if any found, assume it's a 404
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') { //json error
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"}); //html error
                return;
            }
            question.getAnswers(function (err, answers) { //fetch answers for HTML listing
                question.getComments(function (err, comments) {
                    // send to the client what we found in the DB
                    if (req.accepts('html', 'json') === false) { //only accept json/html requests
                        res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                        return;
                    }
                    if (req.accepts('html', 'json') === 'json') { //json response should not contain answers or comments
                        res.type('json');
                        res.send(JSON.stringify(question).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
                    } else { //return HTML listing
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
    req.models.question.create( //create q
        [{ title: req.body.title, content: req.body.content }],
        function (err, questions_created) {
            if (err) { //any error at this stage will be a 500, as the user probably can't do anything about it
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(500).send(JSON.stringify(err));
                    return;
                }
                res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                return;
            }
            if (req.accepts('html', 'json') === false) { //json/html only
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.status(201).stringify(questions_created).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
            } else {
                res.redirect(201, '/questions/' + questions_created[0].id);
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
            question.remove(function (err) {
                if (err) { //any error at this stage will be a 500, as the user probably can't do anything about it
                    console.log('error!', err);
                    if (req.accepts('html', 'json') === 'json') {
                        res.type('json');
                        res.status(500).send(JSON.stringify(err));
                        return;
                    }
                    res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                    return;
                }
                if (req.accepts('html', 'json') === false) { //Remove the question still, but notify the client that we can't provide the output it wants
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') { //JSON confirmation of success
                    res.type('json');
                    res.send(JSON.stringify({message: "success"}));
                } else {
                    res.redirect(303, '/questions'); //in case of HTML just take the user back one level up
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
        function (err, question) { //Not found?
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
            question.save({title: req.body.title, content: req.body.content}, function (err) { //Save the question
                if (err) { //any error at this stage will be a 500, as the user probably can't do anything about it
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
            if (req.accepts('html', 'json') === false) { //Can't return anything you want!
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') { //JSON confirmation of successful edit, return the new question
                res.type('json');
                res.send(JSON.stringify(question).replace(/,?"(answers|comments)":\[[^\]]*\]/g, ""));
            } else { //in HTML just show them the updated question
                res.redirect(303, '/questions/' + req.params.id);
            }
        }
    );
});

module.exports = router;
