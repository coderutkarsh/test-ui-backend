const getDb = require("../utils/database.js").getDb;
const mongoDb = require("mongodb");
const Question = require("./Question");
const arrayUtils = require("../utils/arrayUtils");
const constants = require('./constants')
const ObjectFactory = require('./ObjectFactory')
const collectionName = "feedbacks"

class FeedbackManager {
  constructor(objectType, subType) {
    this.objectType = objectType;
    this.subType = subType;
  }
  async parseFeedbackForm(feedbackForm) {
    //   console.log("feedbackForm",feedbackForm)
    //TODO: get adminId and fetch detail of submitted feedbacks if any. 
    if (feedbackForm) {
      let questions = feedbackForm.questions;

      if (questions && questions.length) {
        let optionIds = [];
        let withOptions = [];
        let questionIds = questions.map(question => {
          if (question.options && question.options.length) {
            // console.log("type1", typeof question.questionId)
            withOptions.push(question.questionId.toString());
            optionIds = optionIds.concat(
              question.options.map(option => new mongoDb.ObjectId(option))
            );
          }
          return new mongoDb.ObjectId(question.questionId);
        });
        let db = getDb();
        if (questionIds.length) {
          let questionObjs = await db
            .collection("questionDefs")
            .find({ _id: { $in: questionIds } })
            .toArray();
          //  console.log("withOptions",withOptions)

          if (questionObjs && questionObjs.length) {
            optionIds = optionIds.concat(
              questionObjs
                .map(questionObj => {
                  // console.log("temp",questionObj._id.valueOf())
                  // console.log("temp temp",typeof questionObj._id.toString())

                  if (!withOptions.includes(questionObj._id.toString())) {
                    if (questionObj.options && questionObj.options.length) {
                      return questionObj.options.map(
                        option => new mongoDb.ObjectId(option)
                      );
                    }
                  } else {
                    //if options are already given in feedback form then, replace db stored options with those options
                    // console.log("questions",questions)
                    let questionInFeedback = arrayUtils.findFieldInObjArray(
                      questions,
                      "questionId",
                      questionObj._id,
                      true
                    );
                  
                    // console.log("questionInFeedback",questionInFeedback)
                    if(questionInFeedback && questionInFeedback.length){
                      questionObj.options = questionInFeedback[0].options;
                       
                     }
                    }
                })
                .filter(optionId => optionId)
            );
          }
          //TODO fetch options, and collect subquestionIds and subquestionData
          if (optionIds && optionIds.length) {
            let optionObjs = await db
              .collection("optionDefs")
              .find({ _id: { $in: optionIds } })
              .toArray();
            //TODO: collect subquestion ids and their options, fetch subquestions and options
            //TODO: set them in option's subquestion detail only.
            if (optionObjs && optionObjs.length) {
              let subquestionOptions = [];
              let subQuestionIds = optionObjs
                .map(optionObj => {
                  if (optionObj.subQuestionId) {
                    return optionObj.subQuestionId;
                  }
                })
                .filter((subQuestionId, index, self) => {
                  return subQuestionId;
                });
              subQuestionIds = arrayUtils.uniquifyObjectIds(subQuestionIds);
              //making call to static function to fetch subquestion data
              if (subQuestionIds && subQuestionIds.length) {
                let subQuestionData = await Question.getSubquestionData(
                  subQuestionIds
                );
                this.setSubquestionDataInOptions(optionObjs, subQuestionData);
              }
              // console.log("questionsObjs",questionObjs)
              this.setOptionDataInQuestion(questionObjs, optionObjs);
              
            
            }

            // console.log("optionObjs",optionObjs)
          }
          feedbackForm.questions = questionObjs
          return feedbackForm
          // console.log("feedbackForm",feedbackForm)
        }
      }
    }
  }

 //model handling function for feedback 
 async addAdminFeedback(feedbackForm,adminId){
         //TODO add feedback into the feedbacks table and then add question answers
         //keeping in mind the subquestions.
  }

setSubquestionDataInOptions(optionObjs, subQuestionData) {
    if (optionObjs && optionObjs.length) {
      for (let optionObj of optionObjs) {
        //subquestion corresponding to objectId
        let subQuestion = arrayUtils.findFieldInObjArray(
          subQuestionData,
          "_id",
          optionObj.subQuestionId,
          true
        );
        //  console.log("subQuestion",subQuestion)
        if (subQuestion && subQuestion.length) {
          optionObj.subQuestion = subQuestion[0];
        }
      }
    }
  }

  setOptionDataInQuestion(questions, optionObjs) {
   if (questions && questions.length) {
      for (let question of questions) {
        if(question.options && question.options.length){
          let optionDetails = [] 
          for(let optionId of question.options){
              if(optionObjs && optionObjs.length){
                
                let optionDetail = arrayUtils.findFieldInObjArray(optionObjs,'_id',optionId,true) 
                if(optionDetail && optionDetail.length){
                  optionDetails.push(optionDetail[0])
                }
              }
            }
            question.options = optionDetails 
         }
      }
    }
  }

  async getFeedbackForm(feedbackId) {
    let db = getDb();
    try {
      let feedbackForm = await db
        .collection("feedbackForms")
        .findOne({ objectType: this.objectType, subType: this.subType });
      let feedbackFormParsed = await this.parseFeedbackForm(feedbackForm);
      return feedbackFormParsed  
    } catch (error) {
      throw new Error({ feedbackFound: false });
    }
  }
  
  //function for submitting the feedback
  async submitFeedback(adminId,formId,questions,feedbackId){
     //TODO check if admin exists.
     //could create a validator utility class, which 
     let db = getDb(); 
     let Factory = new ObjectFactory()
     if(adminId && formId){
         let adminMgr = Factory.getObject(constants.MGR_TYPE_ADMIN,adminId)
         let adminObj = await adminMgr.getAdminById();
         
         let FeedbackFormMgr = Factory.getObject(constants.OBJ_TYPE_FEEDBACK)
         let feedbackFormObj =await FeedbackFormMgr.getFeedbackFormById(formId)
         
        //  console.log("adminObj",adminObj)/

         
         if(adminObj && feedbackFormObj){
          let objectToSet = { feedbackFormId:new mongoDb.ObjectId(formId), adminId: new mongoDb.ObjectId(adminId)}

          if(feedbackId){
             //code for update 
             //use of last updated
             try{
               await db.collection(collectionName).updateOne({_id:new mongoDb.ObjectId(feedbackId)},
             { $currentDate: {
              "lastModified": { $type: "timestamp" }
           },
           $set:objectToSet
          })
        }
        catch(e)
        {
          throw new Error({updated:false})
        }  
          }
          else{
             objectToSet['lastUpdated'] = null
             try{
             let insertResp = await db.collection(collectionName).insertOne(objectToSet)
             if(insertResp.ops[0]){
               let insertedObj = insertResp.ops[0]
               let feedbackId = insertedObj._id
               let QuestionAnswersMgr = Factory.getObject(constants.MGR_TYPE_QUESTION_ANSWERS)
               QuestionAnswersMgr.processFeedbackQuestions(feedbackId,questions)

             }
             return {inserted:true} 
              }
              catch(e){
                  // console.log("error found",e)
                  
                  throw new Error({inserted:false})
              }
             
          }
             
          //  await db.collection(collectionName).
              
 

             

         }
      } 

  }

  

 async getOptionsDetails(optionIds,questionAnswers){
  let db = getDb();     
  optionIds = optionIds.map((optionId)=> new mongoDb.ObjectId(optionId))
      try{
      let optionObjects = await db.collection('optionDefs').find({_id:{$in:optionIds}}).toArray();
      if(optionObjects.length){
         optionObjects.map((optionObject)=>{
             if(optionObject.subQuestionId){
               //if this subQuestionAnswer is in feedback questionAnswers then only populate, else no need
               let subQuestionObj = {}
               subQuestionObj['questionId'] = optionObject.subQuestionId
               //searching in questionAnsers
               questionAnswers.map((questionAnswer)=>{
                    if(questionAnswer.questionId.toString()===optionObject.subQuestionId.toString()){
                         subQuestionObj['selectedOption'] = questionAnswer['selectedOption'] 
                     }

               }) 
               optionObject.subQuestionObj = subQuestionObj 

            
              }   
          

         })
            


        return optionObjects

      }  
    
    
    
    
    }
      catch(e){
        console.log("Error while fetching options",e)
      }
      // console.log("optionObjects",optionObjects) 
      

 }




 populateSelectedOptions(questionAnswers,selectedOptionObjs){
  if(questionAnswers && questionAnswers.length){
    questionAnswers.map((questionAnswer)=>{
          //  console.log("questionAnswer",questionAnswer)
         if(questionAnswer.selectedOption){
              let selectedOptions= []
              // console.log("questionAnswer selectedOption", questionAnswer.selectedOption)

              questionAnswer.selectedOption.map((selectedOption)=>{
                    selectedOptionObjs.map((selectedOptionObj)=>{
                          //  if(selectedOption.toString()===)
                           if(selectedOption.equals(selectedOptionObj._id)){
                            selectedOptions.push(selectedOptionObj)
                            //  console.log("yeah yeah equals")
                           }  
                          //  


                    })     

                 
              })    

           questionAnswer.selectedOption = selectedOptions


         }


    })  
   }
   }



  async fetchAdminFeedback(adminId){
    
    
    if(adminId && this.objectType && this.subType){
      //fetching feedback form Id   
      let db = getDb();
      try{
         let feedbackForm =  await db.collection("feedbackForms").find({objectType:this.objectType,subType:this.subType}).toArray();
        //  console.log("feedback form",feedbackForm)
        if(feedbackForm && feedbackForm.length){
            let feedbackFormId = feedbackForm[0]._id
            // console.log("feedbackFormId",feedbackFormId)
            let adminFeedback = {}
            if(feedbackFormId){
             adminFeedback['feedbackFormId']=feedbackFormId
              try{         
              let submittedFeedbacks = await db.collection("feedbacks").find({feedbackFormId:new mongoDb.ObjectId(feedbackFormId),adminId:new mongoDb.ObjectId(adminId)}).toArray();
              if(submittedFeedbacks && submittedFeedbacks.length){
                let feedbackIds = []
                for(let submittedFeedback of submittedFeedbacks){
                    feedbackIds.push(new mongoDb.ObjectId(submittedFeedback._id))
                 }
                 if(feedbackIds && feedbackIds.length){
                 adminFeedback['feedackIds'] = feedbackIds
                 let questionAnswers = await db.collection("questionAnswers").find({feedbackId:{$in:feedbackIds}}).toArray();
                  if(questionAnswers && questionAnswers.length){
                     let selectedOptions = []
                     questionAnswers.map((questionAnswer)=>{
                     if(questionAnswer.selectedOption && questionAnswer.selectedOption.length)  
                     selectedOptions = selectedOptions.concat(questionAnswer.selectedOption)  
                     })
                     if(selectedOptions && selectedOptions.length){
                      let selectedOptionObjs = await this.getOptionsDetails(selectedOptions,questionAnswers)
                      //now populating selectedOption of questionAnswers from selectedOptionObjs array
                      if(selectedOptionObjs && selectedOptionObjs.length){
                          this.populateSelectedOptions(questionAnswers,selectedOptionObjs)                   
                          }
                        } 
                       }
                     adminFeedback['questionAnswers'] = questionAnswers 
                    }
                  }
                } 
               catch(e){
                 console.log("error while fetching submitted feedbacks or question anwers",e)
               }

            }


          return adminFeedback
        }        
      
      }
      catch(e){


      }


     } 
  }
}
module.exports = FeedbackManager;
