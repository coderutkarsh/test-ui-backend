const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
//this is done for object id comparision while find qury
const collectionName = "feedbackForms"

class Feedback {
      constructor(objectType,questions,description,subType,id){
          let operation = null
          if(id){
           this.id = id 
            operation = 'update'
          }
          else{
            operation = 'add'
          }
          if(objectType)
             this.objectType = objectType
          if(questions) 
             this.questions = questions
          if(description)
             this.description = description  
          if(subType)
             this.subType = subType    
          this.getOperation = function(){
            return operation
          }   
      }

      async getFeedbackFormById(feedbackFormId){
          let id = feedbackFormId?feedbackFormId:this.id
          let db = getDb();
          try{
            console.log("feedback form Id",id)
            let feedbackObject = await db.collection(collectionName).find({_id:new mongodb.ObjectId(id)}).toArray();
            //  console.log("feedbackObject",feedbackObject)
             if(feedbackObject && feedbackObject.length){
               return feedbackObject
             }

          }
          catch(err){
            throw new Error({found:false})
          }
  

      }


      parseQuestions(){
         if(this.questions && this.questions.length){
             let questions = this.questions.map((question)=>{
              let options = [] 
              question.questionId = new mongodb.ObjectId(question.questionId)
              if(question.options){
                   options = question.options.map((optionId)=>new mongodb.ObjectId(optionId))
                   question.options = options     
                } 
             })  
          }
        return this.questions
      }  
      async deleteFeedback(){
         let db = getDb();
         let id = this.id
         try{
         await db.collection("feedbackForms").deleteOne({_id:new mongodb.ObjectId(id)})  
          return {deleted:true} 
        }
         catch(err){
           throw new Error({deleted:false})
         }
       }
       async addUpdateFeedback(){
         let operation = this.getOperation();
         let dbOp
         let db = getDb();
         let objectToUpdate = {...this}
         delete objectToUpdate.getOperation
         switch(operation){
           case 'add':
             this.questions = this.parseQuestions() 
             try{
              await db.collection('feedbackForms').insertOne(this);
              return {feedbackFormInserted:true}
              }
             catch(error){
                  throw new Error({feedbackFormInserted:false})
             }
              // dbOp = 
           break;
           case 'update':
              try{
                 await db.collection('feedbackForms').updateOne({_id:new mongodb.ObjectId(this.id)},{$set:objectToUpdate});
                return {feedbackFormInserted:true}
    
              }
               catch(error){
                    throw new Error({feedbackFormInserted:false})
               }
            break;
         }   
      }

      static getAllFeedbacks(){
          let db = getDb();
          return db
      .collection('feedbackForms')
      .find()
      .toArray()
      .then(FeedbackForms => {
      //   console.log("FeedbackForms",FeedbackForms);
        return FeedbackForms;
      })
      .catch(err => {
        console.log(err);
      });



      }
      getFeedbackById(){

      }
    
       


}
 module.exports = Feedback;
