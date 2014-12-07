var orm = require('orm');

module.exports.connectionString = "sqlite://store.sqlite3";

module.exports.define = function (db, models) {
    models.question = db.define('question', {
        title: String,
        content: String
    });

    models.answer = db.define('answer', {
        title: String,
        content: String
    });

    models.q_comment = db.define('q_comment', {
        title: String,
        content: String
    });

    models.a_comment = db.define('a_comment', {
        title: String,
        content: String
    });

    models.answer.hasOne('question', db.models.question, {reverse: 'answers', autoFetch: false, cache: false});
    models.q_comment.hasOne('question', db.models.question, {reverse: 'comments', autoFetch: false, cache: false});
    models.a_comment.hasOne('answer', db.models.answer, {reverse: 'comments', autoFetch: false, cache: false});
    models.question.sync();
    models.answer.sync();
    models.q_comment.sync();
    models.a_comment.sync();
};
