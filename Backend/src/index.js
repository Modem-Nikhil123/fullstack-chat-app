const express = require('express');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const connectDB=require('./lib/db.js');
const dotenv=require('dotenv');
const authRoutes=require("./routes/auth.js");
const messageRoutes=require('./routes/message.js');
const {app,server} = require('./lib/socket.js');
const path = require('path');

dotenv.config();


const PORT=process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));

app.use('/auth',authRoutes);
app.use('/messages',messageRoutes);

if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname, '../../Frontend/dist')));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, '../../Frontend/dist/index.html'));
    })
}

server.listen(PORT,()=>{
    console.log("server is running on "+PORT);
    connectDB();
})  