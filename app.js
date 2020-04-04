var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hike = require('./routes/hike');

var app = express();
app.get('/hikes', hike.index);
app.post('/add_hike', hike.add_hike);

var mysql      = require('mysql');
const DBConnection = require('./DBConnection.json');
var connection = mysql.createConnection(DBConnection);
 
connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });

app.get("/test", (req, res) => {
    let {idtest} = req.query; // this gets the parameter idtest from the url query as a string
    let query = `SELECT * FROM Earl.test WHERE idtest=${idtest};`;
    connection.query(query, function (error, results, fields) {
        if (error) //error from db query
            res.status(500).json(error);
        else //it worked
            res.json({"data": results}); // wrap array in object to be parsed by unity
    });
})

app.get("/getCard", (req, res) => {
    let {cardName} = req.query; // this gets the parameter idtest from the url query as a string
    let query = `CALL Earl.get_card('${cardName}');`;
    connection.query(query, function (error, results, fields) {
        if (error) //error from db query
            res.status(500).json(error);
        else //it worked
            res.json({"data": results[0]}); // wrap array in object to be parsed by unity
    });
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
