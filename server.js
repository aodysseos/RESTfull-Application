var express    = require('express');
var swig       = require('swig');
var	orm        = require('orm');
var http       = require('http');
var path       = require('path');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var routes = require('./routes/questions');
//var users  = require('./routes/users/');

var app = express();

app.engine('html', swig.renderFile); // render html with swing
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/questions', routes);
//app.use('/users', users);

app.use(function(req,res, next){
    models(function(err,db){
        if(err){
            console.log(err);
            return next(err);
        }
        req.models=db.models;
        req.db=db;
        return next();
    });
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        //console.log(err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.listen(3000);