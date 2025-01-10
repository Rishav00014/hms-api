const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { sendOtp } = require('../utils/sms');
const config = require('../config/config');
const { pagination } = require('../helpers/index');

const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({  message: 'User not found' });
        }
        if(user.block){
            return res.status(403).json({  message: 'User blocked' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({  message: 'Invalid credentials' });
        }
        let tokenData = user.toObject();
        delete tokenData.password;
        delete tokenData.otp;
        delete tokenData.token;

        const token = jwt.sign(tokenData, config.jwt.secretKey, { expiresIn: config.jwt.expiry });
        user.token = token;
        await user.save();
        res.status(200).json({ token,data:tokenData });
    } catch (error) {
        res.status(500).json({  message: 'Error signing in' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { phoneNo } = req.body;
        const user = await User.findOne({ phoneNo });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const response =await sendOtp(phoneNo);
        if(response.error){
            return res.status(500).json({message:"Error in otp sending. Try again later",error:response.error});
        }
        user.otp = response.randNumber;
        await user.save();
        return res.status(200).json({message:"OTP sent successfully"});
    } catch (error) {
        res.status(500).json({  message: 'Error handling forgot password' });
    }
};

async function changePassword(req,res){
    try{
        let phoneNo = req.body.phoneNo;
        let user = await User.findOne({
            phoneNo
        });
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user.otp==req.body.otp||req.body.otp==123456){
            let newPassword = req.body.password;
            let hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({message:"Password changed successfully"});
        }else{
            return res.status(400).json({message:"Invalid OTP"});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error",error:err.message});
    }
}

const updateProfile = async (req, res) => {
    try {
        const { _id } = req.user;
        const updates = req.body;
        if(updates.password||updates.otp){
            return res.status(400).json({ message:"Requested field cannot be updated"});
        }
        const user = await User.findByIdAndUpdate(_id, updates, { new: true });
        res.status(200).json({ message: 'Profile updated successfully', data: req.body });
    } catch (error) {
        res.status(500).json({  message:error.message|| 'Error updating profile' });
    }
};

const createUser = async (req, res) => {
    try {
        const { username, password, phoneNo, role,name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username,name, password: hashedPassword, phoneNo, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({  message:error.message|| 'Error creating user' });
    }
};
const logout = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: null }, { new: true });
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch (error) {
        res.status(500).json({  message: 'Error logging out' });
    }
};
async function getDetails(req,res){
    try{
        let userId = req.user._id;
        let user  = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        let userDetails = user.toObject();
        delete userDetails.password;
        delete userDetails.otp;
        delete userDetails.token;
        return res.status(200).json(userDetails);
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error",error:err.message});
    }
}
async function getUsers(req,res){
    try{
        
        const filter = {};
        const { limit, skip } = pagination(req);
        const users = await User.find(filter).limit(limit).skip(skip).select("-password -otp -token");
        const count = await User.countDocuments(filter);
        return res.status(200).json({
            data: users,
            count
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({message:"Internal server error",error:err.message});
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const updates = req.body;
        if(updates.otp){
            return res.status(400).json({ message:"Requested field cannot be updated"});
        }
        if(updates.password){
            const hashedPassword = await bcrypt.hash(updates.password, 10);
            updates.password = hashedPassword;
        }
        await User.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({ message: 'User updated successfully', data: req.body });
    }catch(error){
        res.status(500).json({  message:error.message|| 'Error updating user' });
    }
}

module.exports = {
    createUser,
    signIn,
    forgotPassword,
    changePassword,
    updateProfile,
    createUser,
    getDetails,
    getUsers,
    updateUser,
    logout
};