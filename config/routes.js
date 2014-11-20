var controllers=require('../app/controllers');

module.exports=function(app)
{
    app.get('/', controllers.home);
    app.get('/questions', controllers.questions.list);
    app.post('/questions', controllers.questions.create);
    //app.get('/questions/:id', controllers.get);
   // app.post('/questions/:questionId/comments', controllers.comments.create);
}