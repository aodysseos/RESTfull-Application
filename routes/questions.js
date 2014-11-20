var express = require('express');
var router = express.Router();

/* 
 * GET questions. 
 */
 var questions = 
 		[
		  { title : 'Name', text : "What is your name?"},
		  { title : 'Age', text : "How old are you?"},
		  { title : 'Location', text : "Where do you live?"},
		  { title : 'Likes', text : "What do you like?"}
		];

router.get('/questions/:id', function(req, res) {
	if(questions.length <= req.params.id || req.params.id < 0) {
    	res.statusCode = 404;
    return res.send('Error 404: No questions found'); // should use vews error
 	}  
	
	var q = questions[req.params.id];
  	res.render('/questions', { 
	  	title: q.title ,
	  	content: q.text
    });
});

module.exports = router;
