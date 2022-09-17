const express = require('express');
const { check } = require('express-validator')

const placesContollers = require('../controllers/places-controller')

const router = express.Router();


router.get('/:pid',placesContollers.getPlaceByID )

router.get('/user/:uid',placesContollers.getPlacesByUserIdPlaces);

router.post('/',
[
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    check('address').not().isEmpty()
]
,placesContollers.createPlace);

router.patch('/:pid',[
    check('title').not().isEmpty(),
    check('description').isLength({min:5}),
    
],placesContollers.UpdatePlace);

router.delete('/:pid',placesContollers.DeletePlace);


module.exports = router;