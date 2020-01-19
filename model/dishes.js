const mongoose=require('mongoose');
const Schema=mongoose.Schema;


var commentSchema=new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",  
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    
},{
    timestamps:true
});


const dishSchema=new Schema({
    name:{
        type:String,
        reuired:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
       type:String
    },
    category:{
        type:String,
        required:true
     },
     label:{
        type:String,
        default:''
     },
     price:{
        type:String,
        required:true,
     },
     featured:{
        type:Boolean,
         default:false
     },
    comments:[commentSchema]
},
{
    timestamps:true,
});

var Dishes=mongoose.model('Dish',dishSchema);

module.exports=Dishes;

