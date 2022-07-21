const uuid = require('uuid/v4');
const { vaildationResult } = require('express-validator')

const HttpError= require('../models/http-error')

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


const createPlace = (req,res,next) =>{
 const {title,description,coordinates,address,creator }= req.body;
 //const title = req.body.title;
 const createdPlace = {
    id: uuid(),
    title,
    description, 
    location:coordinates,
    address,
    creator};

   DUMMY_Places.push(createPlace);

   res.status(201).json({place:createPlace})
}
 const UpdatePlace =(req,res,res)=>{
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
  DUMMY_Places=DUMMY_Places.filter(p=>p.id ===placeId);
  res.staus(200).json({message:"HAS been deleted"})
 }

exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserIdPlaces= getPlacesByUserIdPlaces;
exports.createPlace= createPlace;

exports.UpdatePlace=UpdatePlace;
exports.DeletePlace=DeletePlace;