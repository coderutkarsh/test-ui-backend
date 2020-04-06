const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
const collectionName = 'questionAnswers'

class questionAnswersMgr {
     constructor(){
         }
    async submitQuestionAnswer(feedbackId,questionId,optionId,id){
        let db = getDb();
         if(feedbackId)
         this.feedbackId = new mongodb.ObjectId(feedbackId) 
         if(questionId)
         this.questionId= new mongodb.ObjectId(questionId)
         if(optionId)
         this.optionId= new mongodb.ObjectId(optionId)
         if(id)
         this.id=new mongodb.ObjectId(id)
         if(this.id){
            //update case
             try{
                 db.collection(collectionName).updateOne({_id:id},this)
                }
             catch(e){

             }
        
        
        }
        else{
            //create case
            try{
                db.collection(collectionName).insertOne(this)
                return {answerInserted:true}
            }
            catch(e){
                 return {answerInserted:false}
            }
        }
         
    }

    async processFeedbackQuestions(feedbackId,questions){
        if(feedbackId && questions && questions.length){
            let db = getDb();
            //inserting all the questions and subquestions in single db operation.
            let questionsToInsert = [];
            for(let question of questions){
                // console.log("question",question)  
                
                let questionDoc = {}
                //   console.log("type of feedback id ", typeof feedbackId)
                  questionDoc['feedbackId'] = feedbackId
                  questionDoc['questionId'] = question.id ? new mongodb.ObjectId(question.id):undefined
                //   console.log("selectedOptions",question.selectedOptions)
                
                    if(question.selectedOptions && question.selectedOptions.length){
                    let selectedOptionIds = [];
                    for(let selectedOption of question.selectedOptions){
                       selectedOptionIds.push(new mongodb.ObjectId(selectedOption.id))  
                       //pushing sub question                        
                       if(selectedOption.subQuestion){
                        let subQuestionData =  selectedOption.subQuestion
                        console.log("sub question data",selectedOption.subQuestion)
                        let subQuestionDoc = {}
                        subQuestionDoc['feedbackId'] = new mongodb.ObjectId(feedbackId)
                        subQuestionDoc['questionId'] = new mongodb.ObjectId(selectedOption.subQuestion.id)     
                        if(subQuestionData.selectedOptions && subQuestionData.selectedOptions.length){
                            let optionsOfSubquestion=[]  
                            for(let optionId  of subQuestionData.selectedOptions){
                                  optionsOfSubquestion.push(new mongodb.ObjectId(optionId))
                              }
                         subQuestionDoc['selectedOption'] = optionsOfSubquestion

                        }
                        questionsToInsert.push(subQuestionDoc)
                        // questionsToInsert.push()

                       }


                    
                    }
                    questionDoc['selectedOption'] = selectedOptionIds
                    
                    // console.log("selectedOptionId",selectedOptionIds)                       
                  }
                  questionsToInsert.push(questionDoc) 
                  //   questionDoc['selectedOptions'] = 
                //   console.log("question.subQuestion",question.subQuestion)
                  //   questionDoc['selectedOption'] = question
                      



            }  

            // insert questionsToInsert into db
            if(questionsToInsert.length){
               try{
                  await db.collection(collectionName).insertMany(questionsToInsert)
                  return{answersInserted:true}   
               }
               catch(e){
                  throw new Error({answerInserted:false}) 
               }




            }


            
         


        }



    }






}
module.exports=questionAnswersMgr