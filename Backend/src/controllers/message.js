const express = require('express');
const cloudinary = require('../lib/cloudinary.js');
const userModel=require('../models/user.js');
const messageModel=require('../models/message.js');
const { getReceiverSocketId, io } = require('../lib/socket.js');

const getUsersForSidebar=async(req,res)=>{
    try{
    const loggedInUserId=req.user._id;
    const filteredUsers=await userModel.find({_id:{$ne:loggedInUserId}}).select("-password");
    res.status(201).json(filteredUsers);
    }
    catch(err)
    {
        res.status(500).json({message:"internal server error"})
    }
}
const getMessages=async(req,res)=>{
    try{
        const userToChatId=req.params.id;
        const myId=req.user._id;
        const messages=await messageModel.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
    res.status(201).json(messages);
    }
    catch(err){
        res.status(500).json({message:"internal server error"})
    }
}
const sendMessage=async(req,res)=>{
    try{
    const {text,image}=req.body;
    userToChatId=req.params.id;
    myId=req.user._id;
    let imageURL;
    if(image)
    {
       const uploadResponse=await cloudinary.uploader.upload(image);
       imageURL=uploadResponse.secure_url;
    }
    const newMessage=await messageModel.create({senderId:myId,receiverId:userToChatId,text,image:imageURL});

    const receiverSocketId = getReceiverSocketId(userToChatId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    res.status(201).json(newMessage);
}
catch(err)
{
    console.log(err);
    res.status(500).json({message:"internal server error"})
}
}
module.exports={getUsersForSidebar,getMessages,sendMessage}
