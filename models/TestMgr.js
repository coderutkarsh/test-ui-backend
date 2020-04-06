const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
const COLLECTION_NAME_TEST = 'tests'
const COLLECTION_NAME_QUESTIONS = 'questions'
const COLLECTION_NAME_SUBMISSION='submissions'

class TestMgr{
     constructor(testId){
        this.id = testId
     }   
     async getTestById(testId){
         let db = getDb();
         let tests = await db.collection(COLLECTION_NAME_TEST).find({_id:mongodb.ObjectId(this.id)}).toArray();          
         if(tests && tests.length){
            let test = tests[0]
            let questionsIds = test.questions ? test.questions.map((qId)=>mongodb.ObjectId(qId)) :[]
            if(questionsIds){
                let questions = await db.collection(COLLECTION_NAME_QUESTIONS).find({ _id: { $in: questionsIds }}).toArray(); 
                if(questions && questions.length){
                    test['questions']=questions
                }
            }
             return test
         }          
    }
    
    async getSubmissionsForUser(userId){
        let db = getDb();
        try{
            let submissions = await db.collection(COLLECTION_NAME_SUBMISSION).find({userId:userId}).toArray();          
            return submissions
        }
        catch(err){
            console.log("error while fetching submissions from db",err)
        }
        
    }

    
     async submitTestAttempt(submission){
        let db = getDb();
        try{
        let submissionResult = await db.collection(COLLECTION_NAME_SUBMISSION).insertOne(submission)          
         return submissionResult;     
       }
       catch(err){
            console.log("error while updating submission collection.")
       }
    }

 }

module.exports = TestMgr;