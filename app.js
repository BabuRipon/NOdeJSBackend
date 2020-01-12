var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var mongoose=require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var promoRouter=require('./routes/promoRouter');
var leaderRouter=require('./routes/leaderRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req,res,next){
    console.log(req.headers);
    var authHeader=req.headers.authorization;
    console.log(authHeader);
    if(!authHeader){
      var err=new Error('you are not authenticated');
      res.setHeader('WWW-Authenticate','Basic')
      err.status=401;
      next(err);
      return;
    }

    var auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
    console.log(auth);
    var user=auth[0];
    var pass=auth[1];
    if(user==='ripon'&&pass==='ripon123'){
      next();//authorized
    }
    else{
      var err=new Error('you are not authenticated');
      res.setHeader('WWW-Authenticate','Basic')
      err.status=401;
      next(err);
    }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

const db=require('./setup/setUrl').url;
mongoose.connect(db)
.then(()=>{console.log('mongodb connected succesfully.....')})
.catch(err=>console.log(err));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);

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
