const uuid = require('uuid')
const {validationResult} = require('express-validator')

const HttpError= require('../models/http-error');
const getCoordsForAddress = require('../util/location');


const Place = require('../models/place');


//Data
let DUMMY_Places=[{
id:'p1',
    title:'FNB Stadium',
    description:'Ove of the best matches of the Year',
    imageURL:'https://i.pinimg.com/originals/0f/ca/a1/0fcaa1dcca650f50648826da8300e46d.jpg',
    address:'Soccer City Ave, Nasrec, Johannesburg, 2147',
    location:{
        lat:-26.2347569 ,
        lng:27.9804667
    },
    creator:'u1'
}]

//Getting places
const getPlaceByID = (req,res,next)=>{
    const placeID =req.params.pid //{pis:'pl}
    const place = DUMMY_Places.find(p=>{
        return p.id === placeID;
    });

    if(!place){
       throw new HttpError('Could not find a place for the provided Id',404);
    }
    res.json({place:place}); // => {place} =>{place:place}
};


//getting Places by user Id
const getPlacesByUserIdPlaces = (req,res,next)=>{
    const userID = req.params.uid;
    const places= DUMMY_Places.filter(p=>{
        return p.creator === userID;
    });
    if(!places){
        throw new HttpError('Could not find a user places for the provided Id',404)
        
    }
    res.json({places})
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

   try{
    await createdPlace.save();
   }catch(err){
    const error = new HttpError(
        'Creating place failed, place try again.',500
    );
    return next(error);
   }

   res.status(201).json({place:createdPlace});
};
//Updating Place 

 const UpdatePlace =(req,res,next)=>{

   const errors = validationResult(res);
   if(errors.isEmpty()){
    throw new HttpError('Invalid inputs passed,please try again',422)
    }
   const {title,description}= req.body;
   const placeId =req.params.pid;

   const updatedPlace = {...DUMMY_Places.find(p=>p.id === placeId)};
   const placeIndex = DUMMY_Places.findIndex(p=>p.id !== placeId);
   updatedPlace.title=title;
   updatedPlace.description=description;


   DUMMY_Places[placeIndex] = updatedPlace;
//201 if created someting 
//200 seccessful
   res.statis(200).json({place:updatedPlace})
 }

  const DeletePlace = (req,res,next) =>{
  const placeId =req.params.pid;
  if(!DUMMY_Places.find(p=>p.id ===placeId)){
 throw new HttpError("Could not find place for that ID",404);
  }
  DUMMY_Places=DUMMY_Places.filter(p=>p.id ===placeId);
  res.staus(200).json({message:"Has been deleted"})
 }

exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserIdPlaces= getPlacesByUserIdPlaces;
exports.createPlace= createPlace;
exports.UpdatePlace=UpdatePlace;
exports.DeletePlace=DeletePlace;