const FeedBackMgr = require('../models/FeedbackMgr')
exports.fetchFeedbackForm = (req,res,next)=>{
    //way of getting query parameters.
    let objectType = req.query.objectType
    let subType = req.query.subType   
    let feedbackObj = new FeedBackMgr(objectType,subType)
    feedbackObj.getFeedbackForm().then((resp)=>{
        res.status(200)
        .json(resp);
    }).catch((err)=>{
        res.status(500).json(err)
    }) 
}

exports.submitFeedback = (req,res,next)=>{
     let adminId = req.body.adminId
     let formId = req.body.formId
     let questions = req.body.questions
     let feedbackMgrObj = new FeedBackMgr()
     //in case of update.
     let feedbackId = req.body.id
     //TODO: refactor use factory pattern here.
     feedbackMgrObj.submitFeedback(adminId,formId,questions,feedbackId)
}

exports.fetchAdminFeedback = (req,res,next)=>{
      let adminId = req.body.adminId
      let objectType = req.body.objectType
      let subType = req.body.subType
      let feedbackMgrObj = new FeedBackMgr(objectType,subType)
      feedbackMgrObj.fetchAdminFeedback(adminId)
      .then((resp)=>{res.status(200).json(resp)})
      .catch((err)=>{res.status(500).json(err)})

}