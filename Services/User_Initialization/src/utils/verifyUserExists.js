const express = require('express');
const {UserSchema, UserDataSchema, User} = require('../models');

const verifyUserExists = async (req, res, next) =>{
    const UserCatched = req.body.data;
    const userExists = await UserSchema.findOne(UserCatched.Userid);
    if(userExists){
        res.status(409).json({error: "User Already Exists"});
    }
    else{
        next();
    }
};