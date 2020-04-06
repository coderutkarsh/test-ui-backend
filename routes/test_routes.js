const express = require('express')
const Router = express.Router();
const TestController = require('../controllers/TestController')
const UserController = require('../controllers/UserController')

Router.get('/getTest',TestController.getTest)
Router.get('/getSubmissionsForUser',TestController.getSubmissionsForUser)
Router.post('/submitTest',TestController.submitTest)

Router.post('/signupUser',UserController.signupUser)
Router.post('/loginUser',UserController.loginUser)


module.exports=Router;