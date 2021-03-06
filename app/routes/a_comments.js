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
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //Only accept if it's requested for the right question
            if (answer.question_id !== parseInt(req.params.qid, 10)) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            console.log("Adding comment to answer " + answer.id + " at question " + answer.question_id);
            req.models.a_comment.create(
                [{ title: req.body.title, content: req.body.content, answer_id: answer.id }],
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
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //Only display the comment if it's requested for the right answer
            if (comment.answer_id !== parseInt(req.params.aid, 10)) {
                console.log("Answer ID mismatch: requested " + req.params.aid + " but found " + comment.answer_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //But is the question right?
            req.models.answer.get(
                comment.answer_id,
                {},
                function (err, answer) {
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
                    if (answer.question_id !== parseInt(req.params.qid, 10)) {
                        console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                        if (req.accepts('html', 'json') === 'json') {
                            res.type('json');
                            res.status(404).send(JSON.stringify({message: "Not found"}));
                            return;
                        }
                        res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                        return;
                    }
                }
            );
            // send to the client what we found in the DB
            if (req.accepts('html', 'json') === false) {
                res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
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
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //Only display the comment if it's requested for the right answer
            if (comment.answer_id !== parseInt(req.params.aid, 10)) {
                console.log("Answer ID mismatch: requested " + req.params.aid + " but found " + comment.answer_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //But is the question right?
            req.models.answer.get(
                comment.answer_id,
                {},
                function (err, answer) {
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
                    if (answer.question_id !== parseInt(req.params.qid, 10)) {
                        console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                        if (req.accepts('html', 'json') === 'json') {
                            res.type('json');
                            res.status(404).send(JSON.stringify({message: "Not found"}));
                            return;
                        }
                        res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                        return;
                    }
                }
            );
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
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //Only display the comment if it's requested for the right answer
            if (comment.answer_id !== parseInt(req.params.aid, 10)) {
                console.log("Answer ID mismatch: requested " + req.params.aid + " but found " + comment.answer_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //But is the question right?
            req.models.answer.get(
                comment.answer_id,
                {},
                function (err, answer) {
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
                    if (answer.question_id !== parseInt(req.params.qid, 10)) {
                        console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                        if (req.accepts('html', 'json') === 'json') {
                            res.type('json');
                            res.status(404).send(JSON.stringify({message: "Not found"}));
                            return;
                        }
                        res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
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
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
                    return;
                }
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.send(JSON.stringify({message: "success"}));
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
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify(err));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            //Check if we're looking at the right question for this answer
            if (answer.question_id !== parseInt(req.params.qid, 10)) {
                console.log("Question ID mismatch: requested " + req.params.qid + " but found " + answer.question_id);
                if (req.accepts('html', 'json') === 'json') {
                    res.type('json');
                    res.status(404).send(JSON.stringify({message: "Not found"}));
                    return;
                }
                res.status(404).render('error', {error: "404: Not Found", message: req.url + " not found"});
                return;
            }
            answer.getComments(function (err, comments) {
                // send to the client what we found in the DB
                if (req.accepts('html', 'json') === false) {
                    res.status(406).render('error', {error: "406: Not Acceptable", message: "This application supports text/html and application/json responses."});
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
