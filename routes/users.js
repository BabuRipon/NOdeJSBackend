var express = require('express');
var router = express.Router();

var User=require('../model/user');


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/signup',(req,res,next)=>{
    User.findOne({username:req.body.username})
    .then(user=>{
    
      if(user !==null){
        var err=new Error('User '+req.body.username+' already exists ! ');
        err.status=403;
        next(err);
      }
      else{
          return User.create({
            username:req.body.username,
            password:req.body.password
          })
      }
    })
    .then(user=>{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({
        status:'registered successfully ! ',
        user:user,
      })
      .catch(err=>next(err));
    })
})


router.post('/login',(req,res,next)=>{
    if(!req.session.user){
       var authHeader=req.headers.authorization;
       if(!authHeader){
         var err=new Error('you are not authenticated!');
         err.status=401;
         res.setHeader("WWW-Authenticate",'Basic');
         return next(err);
       }
       
      var auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
      var username=auth[0];
      var password=auth[1];
      User.findOne({username:username})
      .then(user=>{
        if(!user){
          var err=Error('User'+username+'does not exist!');
          err.status=403;
          return next(err);
        }
        else if(user.password!==password){
          var err=Error('password of user '+username+' is incorrect !');
          err.status=403;
          return next(err);
        }
        else if(user.username===username&&user.password===password){
          req.session.user='authenticated';
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json({status:'You are authenticated ! '});
        }
      })
      .catch(err=>next(err));
    }
    else{
      res.statusCode=200;
      res.setHeader('Content-Type','application/json');
      res.json({status:'already logged in !'});
    }
})

router.get('/logout',(req,res)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err=new Error('You are not logged in ! ');
    err.status=403;
    next(err);

  }
})

module.exports = router;
