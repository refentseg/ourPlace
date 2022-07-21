const uuid = require('uuid/v4')

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
  const {userName,email,password} =req.body
  const hasUser = DUMMY_Users.find(u=>u.email==email);
  
   if(hasUser){
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