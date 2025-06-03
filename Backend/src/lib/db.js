const mongoose = require('mongoose');

const connectDB=()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then((res)=>{
        console.log("mongoDB connected",res.connection.host);
    })
    .catch((err)=>{
        console.log("mongoDb connection error:",err);
    })
};
module.exports=connectDB;