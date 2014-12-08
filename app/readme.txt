COMP6218 Assignment, group 9
fmd2g11, mjg2c10, yx3n13, ao5g14

Setup:
The following libraries are required (as indicated in package.json):
    "body-parser": "~1.8.1",
    "debug": "~2.0.0",
    "express": "~4.9.0",
    "method-override": "^2.3.0",
    "morgan": "~1.3.0",
    "orm": "^2.1.20",
    "sqlite3": "^3.0.4",
    "swig": "~1.4.2"

Once those are installed using npm, the application can be initiated using "npm start"

The application will listen on port 3000. Currently, it does not attempt to recover if this port is in use. This can be edited in ./bin/www

The following URLs and methods are supported. Any valid GET request will also respond to HEAD.
All POST and PUT requests must provide two strings, named "title" and "content". If not provided, they will be assumed to be empty strings.

GET / - if HTML, returns a generic homepage, if JSON, returns the online status

GET /questions - returns a listing of all questions
POST /questions - creates a new question

GET /questions/:question_id - returns a single question specified by :question_id
PUT /questions/:question_id - edits the question
DELETE /questions/:question_id - removes the question

GET /questions/:question_id/answers - in case of JSON, returns the listing of answers. In HTML, directs the user to /questions/:question_id which already includes the listing of answers
POST /questions/:question_id/answers - post a new answer

GET /questions/:question_id/answers/:answer_id - returns a single answer specified by :question_id and :answer_id. It will only be returned if the requested answer belongs to the question specified (i.e. if answer 1 belongs to question 1, requesting /questions/2/answers/1 will return a 404 error). This trend will continue for all requests where mutliple levels of IDs are specified
PUT /questions/:question_id/answers/:answer_id - edits the answer
DELETE /questions/:question_id/answers/:answer_id - removes the answer

GET /questions/:question_id/comments - in case of JSON, returns the listing of comments. In HTML, directs the user to /questions/:question_id which already includes the listing of comments
POST /questions/:question_id/comments - post a new comment

GET /questions/:question_id/comments/:comment_id - returns a single comment specified by :question_id and :comment_id
PUT /questions/:question_id/comments/:comment_id - edits the comment
DELETE /questions/:question_id/comments/:comment_id - removes the comment

GET /questions/:question_id/answers/:answer_id/comments - in case of JSON, returns the listing of comments. In HTML, directs the user to /questions/:question_id/answers/:answer_id which already includes the listing of comments
POST /questions/:question_id/answers/:answer_id/comments - post a new comment

GET /questions/:question_id/answers/:answer_id/comments/:comment_id - returns a single comment specified by :question_id, :answer_id and :comment_id
PUT /questions/:question_id/answers/:answer_id/comments/:comment_id - edits the comment
DELETE /questions/:question_id/answers/:answer_id/comments/:comment_id - removes the comment
