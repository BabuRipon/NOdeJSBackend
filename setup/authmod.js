module.exports=function (req,res,next){
  
    // console.log(req.user);
  
    // console.log(req.session);
   
       console.log(req.user);
        if(!req.user){
            var err=new Error('you should login with your account');
            err.status=401;
            next(err);
         }
        else{
            next();
          }
  
  }