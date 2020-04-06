//import Mgr objects
const AdminMgr = require('./AdminMgr')
const FeedbackForm = require('./Feedback')
const QuestionAnswersMgr = require('./QuestionAnswersMgr')
const constants = require('./constants')

class ObjectFactory {
       constructor(){

       }
       getObject(type,id){
         switch(type){
           case constants.MGR_TYPE_ADMIN:
               return new AdminMgr(id);               
           case constants.OBJ_TYPE_FEEDBACK:
               return new FeedbackForm();

           case constants.MGR_TYPE_QUESTION_ANSWERS:
             return new QuestionAnswersMgr();    

         }    
         

       }


}
module.exports = ObjectFactory;