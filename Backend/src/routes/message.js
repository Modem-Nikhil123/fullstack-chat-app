const express = require('express');
const {protectRoute}=require('../controllers/auth.js');
const {getUsersForSidebar,getMessages,sendMessage}=require('../controllers/message.js');
const router=express.Router();

router.get('/users',protectRoute,getUsersForSidebar);
router.get('/:id',protectRoute,getMessages);
router.post('/send/:id',protectRoute,sendMessage);
module.exports=router;