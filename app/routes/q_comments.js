var express = require('express');
var swig  = require('swig');
var router = express.Router();

/* POST new comment to question */
router.post('/questions/:id/comments', function (req, res) {
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
            console.log("Adding comment to question " + question.id);
            req.models.q_comment.create(
                [{ title: req.body.title, content: req.body.content, question_id: question.id }],
                function (err, comments_created) {
                    if (err) {
                        console.log(err);
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
                        res.send(JSON.stringify(comments_created));
                    } else {
                        res.redirect(303, '/questions/' + question.id);
                    }
                }
            );
        }
    );
});

/* GET comment */
router.get('/questions/:qid/comments/:cid', function (req, res) {
    req.models.q_comment.get(
        req.params.cid,
        {}, // no options
        function (err, comment) {
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
            //Only display the comment if it's requested for the right question
            if (comment.question_id !== parseInt(req.params.qid)) {
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
            if (req.accepts('html', 'json') === false) {
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.stringify(comment));
            } else {
                res.render('q_comment', {comment: comment});
            }
        }
    );
});

/* PUT edits a comment */
router.put('/questions/:qid/comments/:cid', function (req, res) {
    req.models.q_comment.get(
        req.params.cid,
        {}, // no options
        function (err, comment) {
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
            if (comment.question_id !== parseInt(req.params.qid)) {
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
            });
            if (req.accepts('html', 'json') === false) {
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.stringify(comment));
            } else {
                res.redirect(303, '/questions/' + req.params.qid + '/comments/' + req.params.cid);
            }
        }
    );
});

/* DELETE comment */
router.delete('/questions/:qid/comments/:cid', function (req, res) {
    req.models.q_comment.get(
        req.params.cid,
        {}, // no options
        function (err, comment) {
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
            if (comment.question_id !== parseInt(req.params.qid)) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + comment.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            comment.remove(function (err) {
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
                    res.redirect(303, '/questions/' + req.params.qid);
                }
            });
        }
    );
});

/* GET all comments to a question */
router.get('/questions/:id/comments', function (req, res) {
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
            question.getComments(function (err, comments) {
                // send to the client what we found in the DB
                if (req.accepts('html', 'json') === false) {
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.send(JSON.stringify(comments));
                } else {
                    res.redirect(301, '/questions/' + req.params.id);
                }
            });
        }
    );
});

module.exports = router;
