const uuid = require('uuid');
const { validationResult } = require('express-validator')

const HttpError= require('../models/http-error')
const mongoose = require('mongoose')

const User= require('../models/user')

//Get All users
const getAllUsers =async(req,res,next)=>{
let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  console.log(users);
  res.json({users: users.map(user => user.toObject({ getters: true }))});
  
}

//SIGN UP
const signup= async (req,res,next)=>{
  const errors = validationResult(res);
  if(!errors.isEmpty()){
    return next(new HttpError("Invalid inputs please try again",422));
  }
  const {name,email,password} =req.body
 

  let existingUser 
  try{
      existingUser = await User.findOne({email:email})
  }catch(err){
  const error = new HttpError('Signing up failed,please try again',500);
  return next(error)
  }
  
  if(existingUser){
    const error = new HttpError('Email already existis please try another one',422);
    return next(error)
  }
  const createdUser = new User({
  name,
  email,
  password,
  image:'https://i.pinimg.com/originals/0f/ca/a1/0fcaa1dcca650f50648826da8300e46d.jpg',
  places:[]
  });

  try{
  await createdUser.save();
  }catch(err){
  const error = new HttpError(
     'Sign Up failed, place try again.',500
   );
    return next(error);
   }
  
  res.status(201).json({user:createdUser.toObject({getter:true})})
}

//Login doesnt need a vaildator because it already checks

//LOGIN
const login=async(req,res,next)=>{
  const {email,password} = req.body
 
    let existingUser 
  try{
      existingUser = await User.findOne({email:email})
  }catch(err){
  const error = new HttpError('Logging in failed, please try again',500);
  return next(error)
  }

  if(!existingUser || existingUser.password !==password){
 const error = new HttpError('Incorrect email or password',401);
 return next(error);
  }


  res.json({message:"Logged In"})
}

exports.getUsers=getAllUsers
exports.signup=signup;
exports.login=login;