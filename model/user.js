const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const schema=mongoose.Schema;

const userSchema=new schema({
    admin:{
        type:Boolean,
        default:false
    },
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:'',
    }
},{
    timestamps:true,
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model('User',userSchema);

module.exports=User;