const express = require('express')
const Router = express.Router();
const TestController = require('../controllers/TestController')
const UserController = require('../controllers/UserController')
/* Tests routes */
Router.get('/getTest',TestController.getTest)
Router.get('/getSubmissionsForUser',TestController.getSubmissionsForUser)
Router.post('/createTest',TestController.createTest)
Router.post('/submitTest',TestController.submitTest)
Router.post('/submitFeedback_v2',TestController.submitFeedback)
Router.post('/getFeedBackForObject',TestController.getFeedBackForObject)

/* Users' routes */
Router.post('/signupUser',UserController.signupUser)
Router.post('/loginUser',UserController.loginUser)




module.exports=Router;