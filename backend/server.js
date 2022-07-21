//third party libires
const express = require('express');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places');

const usersRoutes = require('./routes/users');

const HttpError =require('./models/http-error')

const app = express();

app.use(bodyParser.json());

app.use('/api/places',placesRoutes); //=>/api/places/....
app.use('/api/users',usersRoutes);

app.use((req,rs,next)=>{
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



app.listen(5000);