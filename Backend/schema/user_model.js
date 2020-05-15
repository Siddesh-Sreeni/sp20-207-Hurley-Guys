
const mongoose=require('mongoose');

const user_schema=mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    password:String,
    isTyping:String,
    created:Date
    

});

module.exports=mongoose.model('user_model',user_schema);