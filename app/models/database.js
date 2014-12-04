var orm = require('orm');

module.exports.connectionString = "sqlite://store.sqlite3";

module.exports.define = function(db, models) {
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

		models.answer.hasOne('Question', db.models.question, {reverse: 'Answers'});
		models.q_comment.hasOne('Question', db.models.question, {reverse: 'Comments'});
		models.a_comment.hasOne('Answer', db.models.answer, {reverse: 'Comments'});
};