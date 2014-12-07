var express = require('express');
var bodyParser = require('body-parser');
var orm = require('orm');
var swig  = require('swig');
var methodOverride = require('method-override');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var database = require('./models/database');

var index = require('./routes/index');
var questions = require('./routes/questions');
var answers = require('./routes/answers');
var q_comments = require('./routes/q_comments');
var a_comments = require('./routes/a_comments');

var app = express();

// view engine setup
app.engine('html', swig.renderFile); // render html with swing
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

//app.enable('strict routing');
app.use(orm.express(database.connectionString));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(orm.express(database.connectionString, {
    define: function (db, models) {
        database.define(db, models);
        db.sync(function (err) {
            if (err) {
                console.log('Sync Error, err:', err);
            } else {
                console.log('Sync ok');
            }
        });
    }
}));

app.use('/', index);
app.use('/', questions);
app.use('/', answers);
app.use('/', q_comments);
app.use('/', a_comments);

module.exports = app;