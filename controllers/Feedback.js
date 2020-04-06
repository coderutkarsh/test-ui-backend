const Feedback = require('../models/Feedback.js')
const Option = require('../models/Option')
const Question = require('../models/Question')

exports.getFeedback = (req,res,next)=>{
     const feebackObj = new Feedback();
     res.send(feebackObj.getFeedback());
}


exports.addFeeback = (req,res,next)=>{
     const feebackObj = new Feedback();
     res.send(feebackObj.addFeeback(req));
}


exports.getFeedbackById = (req,res,next)=>{
     const feebackObj = new Feedback();
     res.send(feebackObj.getFeedbackById(req.params.id))
}
exports.getOptions = (req,res,next)=>{
     Option.getAllOptions()
     .then((resp)=>{
          res.send(resp);
        })
        .catch((err)=>{
          res.send(err)
        })

}
exports.deleteOption = (req,res,next)=>{
    const id = req.body.id
    const optionObj = new Option(null,null,null,id) 
    optionObj.deleteOption().then(res=>{
          res.send({res:res})
    }).catch(err=>{
     res.send({res:err})
    })
}
exports.addOrUpdateOption = (req,res,next)=>{
     const displayText = req.body.displayText
     const weight = req.body.weight
     const subQuestionId = req.body.subQuestionId
     const optionId = req.body.optionId

     console.log("req.body",req.body)
     const optionObj = new Option(displayText,weight,subQuestionId,optionId);
     
     // console.log("optionObj.addOrUpdateOption()",optionObj.addOrUpdateOption())
     optionObj.addOrUpdateOption().then((resp)=>{
          res.send(resp)
     }).catch((err)=>{
          res.send(err)
     })
}





//Question controllers
exports.getQuestion = (req,res,next)=>{
     Option.getAllQuestions()
     .then((resp)=>{
       res.send(resp);
     })
     .catch((err)=>{
       res.send(err)
     })

}

exports.addUpdateQuestion=(req,res,next)=>{
     let displayText = req.body.displayText
     let options = req.body.options?req.body.options:[]
     let priority = req.body.priority
     let id = req.body.id
     if(!id && !displayText){
          res.send({errorMessage:"No display text sent in add request."})
          return;


     }
     else{
         let questionObj = new Question(displayText,options,priority,id)   
         questionObj.addOrUpdateQuestion()
         .then((resp)=>{
              res.send(resp)
         })
         .catch((err)=>{
              res.send(err)
         })   
     }
   }





 //Feedback form controllers
 exports.addUpdateFeedback = (req,res,next)=>{
      let objectType = req.body.objectType
      let questions = req.body.questions
      let description = req.body.description
      let id = req.body.id
      let subType = req.body.subType
     //  console.log("feedback object",Feedback)

     //   console.log("ctrl here")


      let feedbackObj = new Feedback(objectType,questions,description,subType,id)
      feedbackObj.addUpdateFeedback().then((res)=>{
           res.send(res)

      }).catch((err)=>res.send(err))
}


exports.deleteFeedback = (req,res,next)=>{
     let feedbackFormId = req.body.feedbackFormId
     if(feedbackFormId){
         let feebackObj = new Feedback(null,null,null,feedbackFormId)
         feebackObj.deleteFeedback().then((resp)=>{
            res.send(resp)              
         }).catch((err)=>{
              res.send(resp)
         })  

     }  


}



exports.getAllFeedbacks = (req,res,next)=>{
       Feedback.getAllFeedbacks().then(res=>{
            console.log("result of feedbacks",res)
       })

}

   


     
     





