const express = require('express');
const {signup,login,logout,protectRoute,updateProfile,checkAuth} =require('../controllers/auth');
const router=express.Router();

router.post('/signup',signup)
router.post('/login',login)
router.get('/logout',logout)
router.put('/profile',protectRoute,updateProfile);
router.get('/check',protectRoute,checkAuth)
module.exports=router;