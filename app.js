// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');  
var path = require('path');
var request = require('request');
var routes = require('./routes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Expose 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

// Register endpoints
app.get('/', routes.home);
app.get('/chat', routes.chat);
app.get('/fbwebhook', routes.fbSubscribeWebhook); // For webhook subscribe
app.post('/fbwebhook', routes.fbReceivedMsg) // For webhook posts


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('index', {
    title: err.message
  });
});


app.listen(process.env.PORT || 80, function() {
    console.log('Server running on port ' + (process.env.PORT || 80));
});