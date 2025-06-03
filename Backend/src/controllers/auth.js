const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel=require('../models/user.js')
const createToken=require('../lib/token.js')
const cloudinary=require('../lib/cloudinary.js');
const signup=async(req,res)=>{
    try{
        const {email,fullName,password}=req.body;
        if(!email || !fullName || !password)
            return res.status(400).json({message:"all fields are required"});
        if(password.length<6)
            return res.status(400).json({message:"password must be atleast 6 characters"});
        const user=await userModel.findOne({email});

        if(user)
           return res.status(400).json({message:"email already exists"});

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await userModel.create({email,fullName,password:hashedPassword});
        if(newUser)
        {
            createToken(newUser._id,res);
           return res.status(201).json({message:"successfully registered"});
        }
        res.status(400).json({message:"invalid user data"});
    }
    catch(err)
    {
        res.status(500).json({message:"internal server error"});
    }
}
const login=async(req,res)=>{
    try{
    const {fullName,email,password}=req.body;
    if(!email || !password)
        return res.status(400).json({message:"all fields are required"});
    const user=await userModel.findOne({email});
    if(!user)
        return res.status(400).json({message:"email not found"});
    const match=await bcrypt.compare(password,user.password);
    if(match)
    {
        createToken(user._id,res);
        return res.status(201).json({message:"login successfull"});
    }
    else
        return res.status(400).json({message:"incorrect password"});
    }
    catch(err){
    res.status(500).json({message:"internal error"});
    }
}
const logout=async(req,res)=>{
    try{
        res.clearCookie('jwt');
        res.status(201).json({message:"logged out successfully"})
    }
    catch(err){
        res.status(500).json({message:"internal error"});
    }
}
const protectRoute=async(req,res,next)=>{
    try{
    const token=req.cookies.jwt;
    if(!token)
    {
       return res.status(400).json({message:"unauthorized-token not found"})
    }
    const decoded=jwt.verify(token,process.env.SECRET_KEY);
    if(!decoded)
        return res.status(400).json({message:"unauthorized-token not found"})
    const user=await userModel.findById(decoded.userId).select('-password');
    if(!user)
       return res.status(400).json({message:"user not found"});
    req.user=user;
    next();
    }
    catch(err)
    {
       return res.status(500).json({message:"internal server error"})
    }
}
const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        timeout: 60000 // 60 seconds
      });
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
const checkAuth=(req,res)=>{
    try{
    res.status(201).json(req.user);}
    catch(err){
        res.status(500).json({message:"internal server error"});
    }
}
module.exports={signup,login,logout,protectRoute,updateProfile,checkAuth};
