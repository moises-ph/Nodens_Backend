const express = require('express');
const {UserSchema, UserDataSchema, User} = require('../models');
const bcrypt = require('bcrypt');

const CreateUser = async (req, res, next) => {
    try{
            const passCrypt = await bcrypt.hash(UserCatched.password, 10);
            UserCatched.password = passCrypt;
            const newUser = new UserSchema(UserCatched);
            await newUser.save();
            res.status(200).json({message: "User created Succesfully!"});
    }
    catch(err){
        res.send(400).json(err);
    }
};

const DeleteUser = async(req,res)=>{
    try{
        const UserId = req.params.id;
        const user = await UserSchema.findOne({_id: UserId});
        if(!user){
            res.status(409).json({error: "User doesn't exists"});
        }
        else{
            await UserDataSchema.findByIdAndDelete({_id : UserId});
            await UserSchema.findByIdAndDelete({_id: UserId});
            res.status(200).json({message : "User droped Succesfully!"});
        }
    }
    catch(err){
        res.send(400).json(err);
    }
};

const UpdateUser = async(req, res)=>{
    try{
        const UserCatched = req.body.data;
        const userid = req.params.id;
        const userExists = await UserSchema.findOne(UserCatched.Userid);
        if(!userExists){
            res.status(409).json({error: "User doesn't exists"});
        }
        else{
            const passCrypt = await bcrypt.hash(UserCatched.password, 10);
            UserCatched.password = passCrypt;
            await UserSchema.findByIdAndUpdate({_id : userid}, UserCatched);
            res.status(200).json({message: "User Updated Succesfully!"});
        }
    }
    catch(err){
        res.send(400).json(err);
    }
};

module.exports = {
    CreateUser
}