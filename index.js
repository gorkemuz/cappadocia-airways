var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var indexRouter = require('./routes/index');
var i18n = require('i18n-2')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://<username>:<password>@ds113443.mlab.com:13443/local_library')
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var supportedLocales = ['en', 'tr'];

i18n.expressBind(app, {
  locales: supportedLocales,
  cookie: 'locale',
  defaultLocale: supportedLocales[0],
  updateFiles: true,
  // set the cookie name
});
app.use(function(req, res, next) {
  req.i18n.setLocale('en')
  req.i18n.setLocaleFromQuery();
  req.i18n.setLocaleFromCookie();
  console.log(res.i18n);
  next();
});

app.use('/', indexRouter);
app.use('/faq', indexRouter);
app.use('/contact', indexRouter);
app.use('/gallery', indexRouter);
app.use('/services', indexRouter);
app.use('/prices', indexRouter);
app.use('/about', indexRouter);
app.use('/message', indexRouter)
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
