var express = require('express');
var bodyParser = require('body-parser');
var orm = require('orm');
var swig = require('swig');
var methodOverride = require('method-override');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var database = require('./models/database');
var routes = require('./routes/index');
var questions = require('./routes/questions');

var app = express();

// view engine setup
app.engine('html', swig.renderFile); // render html with swing
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes);
app.use('/questions', questions);

//app.enable('strict routing');
app.use(orm.express(database.connectionString));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(orm.express(database.connectionString, {
    define: function (db, models, next) {
        database.define(db, models);
            next();
            db.cache = false;
            db.sync(function (err) {
            if (err) {
                console.log('Sync Error, err:', err);
            } else {
                console.log('Sync ok');
            }
        });
    }   
}));

module.exports = app;