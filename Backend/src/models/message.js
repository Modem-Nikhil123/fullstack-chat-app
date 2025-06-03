const mongoose = require('mongoose');
const schema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,//its used to reference to other documents
        ref:"users",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    text:{
        type:String
    },
    image:{
        type:String
    }
    },
    {timestamps:true}
)
const messageModel=mongoose.model('Message',schema);
module.exports=messageModel;