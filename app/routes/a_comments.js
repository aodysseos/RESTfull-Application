var express = require('express');
var swig  = require('swig');
var router = express.Router();

/* POST new comment to answer */
router.post('/questions/:qid/answers/:aid/comments', function (req, res) {
    req.models.answer.get(
        req.params.aid,
        {}, // no options
        function (err, answer) {
            if (err) {
                console.log('error!', err);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //Only accept if it's requested for the right question
            if (answer.question_id !== 	parseInt(req.params.qid)) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            console.log("Adding comment to answer " + answer.id + " at question " + answer.question_id);
            req.models.a_comment.create(
                [{ title: req.body.title, content: req.body.content, answer_id: answer.id }],
                function (err, comments_created) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Internal server error");
                    }
                    if (req.accepts('html', 'json') === false) {
                        res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
                        return;
                    }
                    if (req.accepts('html', 'json') === 'json') {
                        res.type('json');
                        res.send(JSON.stringify(comments_created));
                    } else {
                        res.redirect(303, '/questions/' + answer.question_id + '/answers/' + answer.id);
                    }
                }
            );
        }
    );
});

/* GET comment */
router.get('/questions/:qid/answers/:aid/comments/:cid', function (req, res) {
    req.models.a_comment.get(
        req.params.cid,
        {}, // no options
        function (err, comment) {
            if (err) {
                console.log('error!', err);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //Only display the comment if it's requested for the right answer
            if (comment.answer_id !== parseInt(req.params.aid)) {
                console.log("Answer ID mismatch: requested " + req.params.aid + " but found " + comment.answer_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //But is the question right?
            req.models.answer.get(
                comment.answer_id,
                {},
                function (err, answer) {
                    if (err) {
                        console.log('error!', err);
                        res.status(404).send(req.url + " not found\n\n");
                        return;
                    }
                    if (answer.question_id !== parseInt(req.params.qid)) {
                        console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                        res.status(404).send(req.url + " not found\n\n");
                        return;
                    }
                }
            );
            // send to the client what we found in the DB
            if (req.accepts('html', 'json') === false) {
                res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
                return;
            }
            if (req.accepts('html', 'json') === 'json') {
                res.type('json');
                res.send(JSON.stringify(comment));
            } else {
                res.render('a_comment', {comment: comment});
            }
        }
    );
});

/* PUT edits a comment */
router.put('/questions/:qid/answers/:aid/comments/:cid', function (req, res) {
    req.models.a_comment.get(
        req.params.cid,
        {}, // no options
        function (err, comment) {
            if (err) {
                console.log('error!', err);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //Only display the comment if it's requested for the right answer
            if (comment.answer_id !== parseInt(req.params.aid)) {
                console.log("Answer ID mismatch: requested " + req.params.aid + " but found " + comment.answer_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //But is the question right?
            req.models.answer.get(
                comment.answer_id,
                {},
                function (err, answer) {
                    if (err) {
                        console.log('error!', err);
                        res.status(404).send(req.url + " not found\n\n");
                        return;
                    }
                    if (answer.question_id !== parseInt(req.params.qid)) {
                        console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                        res.status(404).send(req.url + " not found\n\n");
                        return;
                    }
                }
            );
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
                res.redirect(303, '/questions/' + req.params.qid + '/answers/' + req.params.aid + '/comments/' + req.params.cid);
            }
        }
    );
});

/* DELETE comment */
router.delete('/questions/:qid/answers/:aid/comments/:cid', function (req, res) {
    req.models.a_comment.get(
        req.params.cid,
        {}, // no options
        function (err, comment) {
            if (err) {
                console.log('error!', err);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //Only display the comment if it's requested for the right answer
            if (comment.answer_id !== parseInt(req.params.aid)) {
                console.log("Answer ID mismatch: requested " + req.params.aid + " but found " + comment.answer_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //But is the question right?
            req.models.answer.get(
                comment.answer_id,
                {},
                function (err, answer) {
                    if (err) {
                        console.log('error!', err);
                        res.status(404).send(req.url + " not found\n\n");
                        return;
                    }
                    if (answer.question_id !== parseInt(req.params.qid)) {
                        console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                        res.status(404).send(req.url + " not found\n\n");
                        return;
                    }
                }
            );
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
                    res.redirect(303, '/questions/' + req.params.qid + '/answers/' + req.params.aid);
                }
            });
        }
    );
});

/* GET all comments to an answer */
router.get('/questions/:qid/answers/:aid/comments', function (req, res) {
    req.models.answer.get(
        req.params.aid,
        {}, // no options
        function (err, answer) {
            if (err) {
                console.log('error!', err);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            //Check if we're looking at the right question for this answer
            if (answer.question_id !== parseInt(req.params.qid)) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                res.status(404).send(req.url + " not found\n\n");
                return;
            }
            answer.getComments(function (err, comments) {
                // send to the client what we found in the DB
                if (req.accepts('html', 'json') === false) {
                    res.status(406).send("Not Acceptable. This application supports text/html and application/json responses.\n\n");
                    return;
                }
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.send(JSON.stringify(comments));
                } else {
                    res.redirect(301, '/questions/' + req.params.qid + '/answers/' + req.params.aid);
                }
            });
        }
    );
});

module.exports = router;