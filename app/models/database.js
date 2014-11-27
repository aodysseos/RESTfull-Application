var orm = require('orm');

module.exports.connectionString = "sqlite://store.sqlite3";

module.exports.define = function(db, models) {
  	models.question = db.define('question', {
            title: String,
            content: String
        });

  	models.comment = db.define('answer', {
            title: String,
            content: String
        });

  	models.answer = db.define('comment', {
            title: String,
            content: String
        });

    models.question.hasOne("answer", db.models.answer, { reverse: 'question' });
    models.question.hasOne('comment',db.models.comment, {reverse: 'question'});
    models.answer.hasOne('comment',db.models.comment, {reverse: 'answer'});
};