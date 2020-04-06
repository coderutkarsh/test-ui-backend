const express = require('express')
const Router = express.Router();
const FeedbackCtrl = require('../controllers/Feedback.js')
const FbSubmissionCtrl = require('../controllers/FbSubmission.js')
Router.get('/getFeedback',FeedbackCtrl.getFeedback)
Router.post('/addFeedback',FeedbackCtrl.addFeeback)
Router.get('/getFeedbackById/:id',FeedbackCtrl.getFeedbackById)
Router.post('/addUpdateOption',FeedbackCtrl.addOrUpdateOption)
Router.get('/getOptions',FeedbackCtrl.getOptions)
Router.post('/deleteOption',FeedbackCtrl.deleteOption)

/*question routes.*/
Router.post('/addUpdateQuestion',FeedbackCtrl.addUpdateQuestion)
// Router.get('/getQuestions',FeedbackCtrl.getQuestions)
// Router.post('/deleteQuestion',FeedbackCtrl.deleteQuestion)



Router.get('/getAllFeedbacks',FeedbackCtrl.getAllFeedbacks)

Router.post('/addUpdateFeedback',FeedbackCtrl.addUpdateFeedback)
Router.post('/deleteFeedbackForm',FeedbackCtrl.deleteFeedback)


//feedback submission routes.


// console.log("FbSubmissionCtrl",FbSubmissionCtrl)

Router.get("/fetchFeedbackForm",FbSubmissionCtrl.fetchFeedbackForm)

Router.post("/submitFeedback",FbSubmissionCtrl.submitFeedback)


Router.post('/fetchAdminFeedback',FbSubmissionCtrl.fetchAdminFeedback)




module.exports = Router;