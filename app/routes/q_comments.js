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
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            console.log("Adding comment to question " + question.id);
            req.models.q_comment.create(
                [{ title: req.body.title, content: req.body.content, question_id: question.id }],
                function (err, comments_created) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Internal server error");
                        return;
                    }
                    if (req.accepts('html', 'json') === false) {
                        res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
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
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //Only display the comment if it's requested for the right question
            if (comment.question_id !== req.params.qid) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + comment.question_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            // send to the client what we found in the DB
            if (req.accepts('html', 'json') === false) {
                res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
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
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            if (comment.question_id !== req.params.qid) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + comment.question_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            comment.save({title: req.body.title, content: req.body.content}, function (err) {
                if (err) {
                    console.log('error!', err);
                    res.status(500).send("500: Internal Server Error\n\n");
                    return;
                }
            });
            if (req.accepts('html', 'json') === false) {
                res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
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
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            if (comment.question_id !== req.params.qid) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + comment.question_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            comment.remove(function (err) {
                if (err) {
                    console.log('error!', err);
                    return;
                }
                if (req.accepts('html', 'json') === false) {
                    res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
                    return;
                }
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.send(JSON.stringify({deleted: true}));
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
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            question.getComments(function (err, comments) {
                // send to the client what we found in the DB
                if (req.accepts('html', 'json') === false) {
                    res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
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
