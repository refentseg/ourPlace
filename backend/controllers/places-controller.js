const uuid = require('uuid')
const {validationResult} = require('express-validator')

const HttpError= require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const mongoose = require('mongoose')

const Place = require('../models/place');

const User = require('../models/user')

//Getting places
const getPlaceByID = async (req,res,next)=>{
    const placeID =req.params.pid //{pis:'pl}
 let place;
    try{
       place = await Place.findById(placeID);
    }
    catch(err){
        const error = new HttpError(
            'Something went wrong, could not find place.',500);
        return next(error)   
    }

    if(!place){
       const error = new HttpError('Could not find a place for the provided Id',404);
       return next(error)
    }
    res.json({place:place.toObject({getters:true})}); // => {place} =>{place:place}
};


//getting Places by user Id
const getPlacesByUserIdPlaces = async (req,res,next)=>{
    const userID = req.params.uid;
    let places;
    try{
       places = await Place.find({creator:userID}); //Mongoose find method
    }
    catch(err){
        const error = new HttpError(
            'Could not find places.',500);
        return next(error)   
    }

    if(!places|| places.length===0){
        return next(
            new HttpError('Could not find a user places for the provided Id',404)
        );
        
    }
    res.json({place:places.map(place => place.toObject({getters:true}))})
};

//Create Place

const createPlace = async (req,res,next) =>{
const errors = validationResult(req);

if(!errors.isEmpty()){
    return next(new HttpError('Invalid inputs passed,please try again',422)); 
}

 const {title,description,address,creator }= req.body;

let coordinates;
try{
    coordinates = await getCoordsForAddress(address);
}catch(error){
    return next(error);
}
 //const title = req.body.title;
 const createdPlace = new Place({
 title,
 description,
 address,
 location: coordinates,
 image: 'https://i.pinimg.com/originals/0f/ca/a1/0fcaa1dcca650f50648826da8300e46d.jpg',
 creator
});

let user;

try{
 user = await User.findById(creator,'-password');
 
}catch(err){
const error = new HttpError(
        'Creating place failed User , place try again.',500);
    return next(error)
}

if(!user){
    const error = new HttpError(
        'Could not find user.',404);
    return next(error)
}
console.log(user);

try{
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({session:sess});

    user.places.push(createdPlace);

    await user.save({session:sess});
    await sess.commitTransaction();

   }catch(err){
    const error = new HttpError(
        'Creating place failed, place try again.',500
    );
    return next(error);
   }

   res.status(201).json({place:createdPlace});
};
//Updating Place 

 const UpdatePlace =async (req,res,next)=>{

   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return next(new HttpError('Invalid inputs passed,please try again',422));
    }
   const {title,description}= req.body;
   const placeId =req.params.pid;

   let place;
   try{
    place = await Place.findById(placeId);
   }catch(err){
    const error = new HttpError('Something went wrong, could not update place.',500);
    return next(error)
   }
   
   place.title=title;
   place.description=description;

   try{
    await place.save();
   }catch(err){
    const error = new HttpError(
        'Something went wrong,could not update place',500
    );
    return next(error);
   }

//201 if created someting 
//200 successful
   res.status(200).json({place:place.toObject({getter:true})})
 }
//Deleting a Place

  const DeletePlace = async (req,res,next) =>{
  const placeId =req.params.pid;
  let place;
  try{
    place = await Place.findByIdAndDelete(placeId).populate('creator');
  }catch(err){
    const error = new HttpError('Something went wrong could not find place',500);
    return next(error)
  }

  if(!place){
    const error = new HttpError('Cant find place',404);
    return next(error)
  }
  try{
    const sess = await mongoose.startSession();
    sess.startTransaction();

   await place.remove({session:sess});

   place.creator.places.pull(place);

   await place.creator.save({session:sess});

   await sess.commitTransaction();

  }catch(err){
    const error = new HttpError(
        'Something went wrong,could not delete place',500
    );
    return next(error);
  }

  res.status(200).json({message:"Has been deleted"})
 }

exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserIdPlaces= getPlacesByUserIdPlaces;
exports.createPlace= createPlace;
exports.UpdatePlace=UpdatePlace;
exports.DeletePlace=DeletePlace;