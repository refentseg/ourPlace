const HttpError = require("../models/http-error");
require('dotenv').config();
const axios = require('axios');


async function getCoordsForAddress(address){
 //return{
 //   lat:
 //   lng:
// }
axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.API_KEY}`);

const data = response.data;

if(!data || data.status==='ZERO_RESULTS'){
  const error = HttpError('Could not find the specified location',422);

  throw error;
}
 const coordinates=data.results[0].geometry.location

 return coordinates
};


module.exports = getCoordsForAddress;