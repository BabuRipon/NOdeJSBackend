const express=require('express');
const promoRouter=express.Router();
const Promo=require('../model/promotions');
var authenticate=require('../authenticate');
// var auth=require('../setup/authmod');

promoRouter.route('/')
.get((req,res,next)=>{
    Promo.find({})
    .then(promo=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    })
    .catch(err=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    Promo.create(req.body)
    .then(promo=>{
        console.log("promo :"+promo);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    })
    .catch(err=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /promotion');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    Promo.remove({})
    .then(promo=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json({success:"deleted all the promo"});
    })
    .catch(err=>next(err));
})

promoRouter.route('/:promoId')
.get(authenticate.verifyUser,(req,res,next)=>{
   Promo.findById(req.params.promoId)
   .then(promo=>{
       res.statusCode=200;
       res.setHeader('Content-Type','application/json');
       res.json(promo);
   })
   .catch(err=>next(err));
})
 .post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/'+ req.params.promoId);
  })
  .put(authenticate.verifyUser,(req, res, next) => {
      Promo.findByIdAndUpdate(req.params.promoId,{
          $set:req.body
      },{new:true})
      .then(promo=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(promo);
      })
      .catch(err=>next(err));
  })
  .delete(authenticate.verifyUser,(req, res, next) => {
      Promo.findByIdAndRemove(req.params.promoId)
      .then(promo=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json(promo);
      })
      .catch(err=>next(err));
  });

module.exports=promoRouter;