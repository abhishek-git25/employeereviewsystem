const express = require('express');
const router = express.Router();
const passport = require('passport')

const userController = require('../controller/user_controller');

router.get('/login', userController.login);
router.get('/register' , userController.register)
router.post('/createUser', userController.createUser);
router.post('/createSession', passport.authenticate(
    'local',
    { failureRedirect: '/login' }
), userController.createSession)
router.get('/logout' , userController.logout)

module.exports = router;