var express = require('express');
var swig  = require('swig');
var router = express.Router();

/* POST new comment to question */
router.post('/questions/:id/comments', function (req, res) {
    req.models.question.get( //fetch the question to post to
        req.params.id, //by id
        {}, // no options
        function (err, question) {
            if (err) { //The question doesn't exist?
                console.log('error!', err);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            console.log("Adding comment to question " + question.id); //notify console
            req.models.q_comment.create( //Create the comment
                [{ title: req.body.title, content: req.body.content, question_id: question.id }],
                function (err, comments_created) {
                    if (err) { //If it blows up at this point, it's a server error :(
                        console.log(err);
                        if (req.accepts('html', 'json') === 'json') {
                            res.type('json');
                            res.status(500).send(JSON.stringify(err));
                            return;
                        }
                        res.status(500).render('error', {error: "500: Internal Server Error", message: JSON.stringify(err)});
                        return;
                    }
                    if (req.accepts('html', 'json') === false) { //We still can't return anything but html/json
                        res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                        return;
                    }
                    if (req.accepts('html', 'json') === 'json') { //Return comments in JSON
                        res.type('json');
                        res.send(JSON.stringify(comments_created));
                    } else {
                        res.redirect(303, '/questions/' + question.id); //In HTML just show them the updated question
                    }
                }
            );
        }
    );
});

/* GET comment */
router.get('/questions/:qid/comments/:cid', function (req, res) {
    req.models.q_comment.get( //fetch comment
        req.params.cid, //by ID
        {}, // no options
        function (err, comment) {
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
            //Only display the comment if it's requested for the right question
            if (comment.question_id !== parseInt(req.params.qid, 10)) { //compare IDs to check if we're not requesting the wrong comment for the wrong question.
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + comment.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            // send to the client what we found in the DB
            if (req.accepts('html', 'json') === false) { //Not acceptable Accept headers
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') { //Return JSON comment
                res.type('json');
                res.status(201).send(JSON.stringify(comment));
            } else {
                res.status(201).render('q_comment', {comment: comment}); //Show the comment page
            }
        }
    );
});

/* PUT edits a comment */
router.put('/questions/:qid/comments/:cid', function (req, res) {
    req.models.q_comment.get(
        req.params.cid, //fetch comment by ID
        {}, // no options
        function (err, comment) { //Not found?
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
            if (comment.question_id !== parseInt(req.params.qid, 10)) { //Make sure we're not making an illegal request (comment does not belong to q we think it does)
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + comment.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            comment.save({title: req.body.title, content: req.body.content}, function (err) {
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
            });
            if (req.accepts('html', 'json') === false) { //Refuse to respond with anything other than html or json
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.stringify(comment)); //JSON comment representation
            } else {
                res.redirect(303, '/questions/' + req.params.qid + '/comments/' + req.params.cid); //in case of HTML just show them the edited comment
            }
        }
    );
});

/* DELETE comment */
router.delete('/questions/:qid/comments/:cid', function (req, res) {
    req.models.q_comment.get( //fetch the comment in question
        req.params.cid,
        {}, // no options
        function (err, comment) { //Not found?
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
            if (comment.question_id !== parseInt(req.params.qid, 10)) { //Sanity check: Do we know which question this comment belongs to?
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + comment.question_id);
                if (req.accepts('html', 'json') === 'json') { //If we don't, that's a 404
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            comment.remove(function (err) { //Remove it!
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
                if (req.accepts('html', 'json') === false) { //Can't return confirmation in anything that's not json/html
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') { //JSON success confirmation
                    res.type('json');
                    res.send(JSON.stringify({message: "success"}));
                } else {
                    res.redirect(303, '/questions/' + req.params.qid); //In HTML go one level up
                }
            });
        }
    );
});

/* GET all comments to a question */
router.get('/questions/:id/comments', function (req, res) {
    req.models.question.get( //Fetch question from which to get comments
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
            question.getComments(function (err, comments) { //get all comments
                // send to the client what we found in the DB
                if (req.accepts('html', 'json') === false) { //json/html only
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') { //JSON representation
                    res.type('json');
                    res.send(JSON.stringify(comments));
                } else {
                    res.redirect(301, '/questions/' + req.params.id + "#comments"); //HTML has no business looking at this!
                }
            });
        }
    );
});

module.exports = router;
