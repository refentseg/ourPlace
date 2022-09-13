const express = require('express');
const { check } = require('express-validator')

const usersContollers = require('../controllers/user-controller')

const router = express.Router();
 
router.get('/',usersContollers.getUsers);

router.post('/signup',[
    check('email').not().normalizeEmail().isEmail(),
    check('password').isLength({max: 8}),
    check('name').not().isEmpty()
],usersContollers.signup)

router.post('/login',[
],usersContollers.login)

module.exports = router