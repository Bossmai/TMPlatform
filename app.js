var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    monk = require('monk'),
    db = monk('localhost:27017/test'),
    routes = require('./routes/index'),
    task = require('./routes/task'),
	slaver = require('./routes/slaver'),
    phoneType = require('./routes/phoneType');
	application = require('./routes/application');
	job = require('./routes/job');
    mockingjay = require('./routes/mockingjay');
    moment = require('moment'),
    report = require('./routes/report');

var app = express();
db.options.multi = true;
//DEBUG="monk:*";

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/task', task);
app.use('/slaver', slaver);
app.use('/phoneType', phoneType);
app.use('/app', application);
app.use('/job', job);
app.use('/mockingjay', mockingjay);
app.use('/report', report);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
var j = schedule.scheduleJob(rule, function(){
    var yesterday = moment().add(-1,'d').format('YYYY/MM/DD');

    db.get('task').find({
        'status': {$nin: ["SUCCESS"]},
        'planExecDate' : yesterday
    }, { stream: true})
        .each(function(doc){
            if(doc.referId !== undefined){
                db.get('task').remove({
                    'referId' : doc.referId
                })
            }

        })
        .error(function(err){
            //do nothing
        });
});

module.exports = app;
