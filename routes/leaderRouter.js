const express=require('express');
const leaderRouter=express.Router();
// var auth=require('../setup/authmod');
var authenticate = require('../authenticate');

const Leaders=require('../model/leaders');

leaderRouter.route('/')
.get((req,res,next)=>{
     Leaders.find({})
     .then(leader=>{
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(leader);
     })
     .catch(err=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
     Leaders.create(req.body)
     .then(leader=>{
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(leader);
     })
     .catch(err=>next(err))
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Leaders.remove({})
    .then(leader=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    })
    .catch(err=>next(err));
})

leaderRouter.route('/:leaderId')
.get(authenticate.verifyUser,(req,res,next)=>{
     Leaders.findById(req.params.leaderId)
     .then(leader=>{
         res.statusCode=200;
         res.setHeader('Content-Type','application/json');
         res.json(leader);
     })
})
 .post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
  })
  .put(authenticate.verifyUser,(req, res, next) => {
       Leaders.findByIdAndUpdate(req.params.leaderId,{
           $set:req.body
       },{new:true})
       .then(leader=>{
           res.statusCode=200;
           res.setHeader('Content-Type','application/json');
           res.json(leader);
       })
       .catch(err=>next(err));
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
       Leaders.findByIdAndRemove(req.params.leaderId)
       .then(leader=>{
           res.statusCode=200;
           res.setHeader('Content-Type','application/json');
           res.json(leader);
       })
       .catch(err=>next(err));
  });

module.exports=leaderRouter;