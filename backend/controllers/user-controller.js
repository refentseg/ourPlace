const uuid = require('uuid');
const { validationResult } = require('express-validator')

const HttpError= require('../models/http-error')

let DUMMY_Users=[{
id:'p1',
    userName:"John John",
    ImgUrl:"https://i.pinimg.com/originals/0f/ca/a1/0fcaa1dcca650f50648826da8300e46d.jpg",
    email:"ggggry@jfeif.com",
    password:"testing223"
}]

//Get All users
const getAllUsers =(req,res,next)=>{
  res.json({DUMMY_Users});
}

const signup=(req,res,next)=>{
  const errors = validationResult(res);
  if(errors.isEmpty){
    throw new HttpError("Invalid inputs please try again",422)
  }
  const {userName,email,password} =req.body
  const hasUserE = DUMMY_Users.find(u=>u.email==email);
  const hasUserNa = DUMMY_Users.find(u=>u.userName==userName);
  
   if(hasUserE && hasUserNa){
    throw new HttpError('Email already exsits',401)
   }
  const createdUser ={
    id:uuid(),
    userName,
    imgURl,
    email,
    password
  }
  DUMMY_Users.push(createdUser);
  res.stayus(201).json({user:createdUser})
}
//Login doesnt need a vaildator because it already checks

const login=(req,res,next)=>{
  const {email,password} = req.body
  const identifiedUser = DUMMY_Users.find(u=>u.email==email);
  if(!identifiedUser|| !identifiedUser.password==password){
    throw new HttpError('Could not identify user,401');
  }
  res.json({message:"Logged In"})
}

exports.getUsers=getAllUsers
exports.signup=signup;
exports.login=login;