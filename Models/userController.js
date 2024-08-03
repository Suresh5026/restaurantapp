const express = require('express');
const userModel = require('./userModel');
const userRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateToken = require('../middleWares/validateToken');


userRouter.post("/register",async(req,res)=>{
    try{
        const userExists = await userModel.findOne({ email : req.body.email });
        if(userExists){
            return res.status(401).json({ message : "User Already Exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        req.body.role = 'user'; 

        await userModel.create(req.body);

        return res.status(201).json({ message: "User Registered Successfully" });

    }catch (err){
        return res.status(500).json({ message: err.message });
    }
})

userRouter.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }
        
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }
        
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        console.log(token);
        return res.status(200).json({ token, role: user.role, message: "Login Successful" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});



userRouter.get('/current-user',validateToken, async(req,res)=>{
    try{
        
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        
        return res.status(200).json({ data: user, message: "User Fetched Successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


module.exports = userRouter;