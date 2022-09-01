//third party libires
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose =require('mongoose');

const connectUrl =process.env.MOGO_URI;
 
const connectConfig = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}

const placesRoutes = require('./routes/places');

const usersRoutes = require('./routes/users');

const HttpError =require('./models/http-error')

const app = express();

app.use(bodyParser.json());

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
}

app.use(allowCrossDomain);

app.use('/api/places',placesRoutes); //=>/api/places/....
app.use('/api/users',usersRoutes);

app.use((req,res,next)=>{
  const error = new HttpError('Could not find this route',404);
  throw error;
})

//Middlewear for error
app.use((error,req,res,next)=>{
   if(res.headerSent){
    return next(error);
   }
   res.status(error.code|| 500); //500 something went wrong in server
   res.json({message:error.message|| 'AN unkwon error occured'});
})


mongoose.connect(connectUrl,connectConfig)
.then(()=>{
  console.log("Mongoose is running")
app.listen(5000);
})
.catch(err =>{
  console.log(err);
});
