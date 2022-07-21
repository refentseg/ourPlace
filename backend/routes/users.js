const express = require('express');

const usersContollers = require('../controllers/user-controller')

const router = express.Router();

router.get('/',usersContollers.getUsers);

router.post('/signup',usersContollers.signup)

router.post('login',usersContollers.login)

module.exports = router