//We need node-orm2
var orm = require('orm');

//Specify db connection
module.exports.connectionString = "sqlite://store.sqlite3";

//Define models
module.exports.define = function (db, models) {
    models.question = db.define('question', { //Questions have titles and contents
        title: String,
        content: String
    });

    models.answer = db.define('answer', { //Answers have titles and contents
        title: String,
        content: String
    });

    models.q_comment = db.define('q_comment', { //Comments have titles and contents
        title: String,
        content: String
    });

    models.a_comment = db.define('a_comment', { //Comments have titles and contents
        title: String,
        content: String
    });

    //Specify relations
    models.answer.hasOne('question', db.models.question, {reverse: 'answers', autoFetch: false, cache: false}); //Each answer belongs to a question
    models.q_comment.hasOne('question', db.models.question, {reverse: 'comments', autoFetch: false, cache: false}); //Each question comment belongs to a question
    models.a_comment.hasOne('answer', db.models.answer, {reverse: 'comments', autoFetch: false, cache: false}); //Each answer comment belongs to an answer
};
