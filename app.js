var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var session=require('express-session');
var morgan = require('morgan');
var mongoose=require('mongoose');
var key=require('./setup/setUrl').secret;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter=require('./routes/dishRouter');
var promoRouter=require('./routes/promoRouter');
var leaderRouter=require('./routes/leaderRouter');

var app = express();

//mongodb confiiguration
const db=require('./setup/setUrl').url;
mongoose.connect(db)
.then(()=>{console.log('mongodb connected succesfully.....')})
.catch(err=>console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser(key));
app.use(session({
  name:'session-id',
  secret:key,
  saveUninitialized:false,
  resave:false
}))

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req,res,next){

  console.log(req.session);
      if(!req.session.user){
          var err=new Error('you should login with your account');
          err.status=401;
          next(err);
       }
      else{
       
        if(req.session.user==='authenticated'){
          next();
        }
        else{
            var err=new Error('you are not authenticated');
            err.status=403;
            next(err);
        }
    }
    
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

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
