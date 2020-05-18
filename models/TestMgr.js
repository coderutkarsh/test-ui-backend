const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
const COLLECTION_NAME_TEST = 'tests'
const COLLECTION_NAME_QUESTIONS = 'questions'
const COLLECTION_NAME_SUBMISSION='submissions'
const COLLECTION_NAME_FEEDBACK='feedbacks'
const OBJECT_TYPE_TEST='test'

class TestMgr{
     constructor(testId){
        this.id = testId
     }   
     async getTest(params){
        if(!Object.keys(params).length){
            throw {error:"empty request!"}
        } 
        let db = getDb();
         let queryObj = {} 
         if(params.testId){
             queryObj['_id']=mongodb.ObjectId(this.id)
         }
         else{
            let otherFields = ['grade','subject','target']
            for(let field of otherFields){
                if(params[field]){
                   queryObj[field]=field==='grade'?parseInt(params[field]):params[field]
                }
            }
         }
         let tests = await db.collection(COLLECTION_NAME_TEST).find(queryObj).toArray();          
         console.log("====debug====tests",tests)
         
         if(tests && tests.length){
            let testsToReturn = tests.filter((test)=>{
                return test.isPublic || (test.studentEmails && test.studentEmails.includes(params.userEmail)) 
            })
            for(let test of testsToReturn){
                let questionsIds = test.questions ? test.questions.map((qId)=>mongodb.ObjectId(qId)) :[]
                if(questionsIds){
                    let questions = await db.collection(COLLECTION_NAME_QUESTIONS).find({ _id: { $in: questionsIds }}).toArray(); 
                    if(questions && questions.length){
                        test['questions']=questions
                    }
                }
            }
            if(this.id){
               return tests[0] 
            }
            return testsToReturn
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
    
    async submitFeddback(feedbackBody){
        let db = getDb();
        try{
        let feedbackSubmissionResult = await db.collection(COLLECTION_NAME_FEEDBACK).insertOne(feedbackBody)          
        if(feedbackSubmissionResult && feedbackSubmissionResult.ops && feedbackSubmissionResult.ops.length){
            return feedbackSubmissionResult.ops
        }
        return feedbackSubmissionResult;     
       }
       catch(err){
            console.log("error while updating submission collection.")
       }
    }

    async createTest(testObj){
      let db = getDb();
      let questions = testObj.questions?testObj.questions:[]
      if(questions && questions.length){
          let questionsToAdd = [] 
          let testQuestions=[]
          questions.map((question)=>{
              if(typeof question==='object'){
                  questionsToAdd.push(question)
              }
              else {
                  testQuestions.push(mongodb.ObjectId(question))
              }
          })
          if(questionsToAdd && questionsToAdd.length){
             try{
                 let insetedResp=await db.collection(COLLECTION_NAME_QUESTIONS).insertMany(questionsToAdd)
                 if(insetedResp && insetedResp.ops && insetedResp.ops.length){
                    for(let op of insetedResp.ops){
                        testQuestions.push(op._id)
                    }  
                   }
                 } 
             catch(err){
                throw err

             }
        }
        testObj['questions'] = testQuestions
        try{
            let testObjResp=await db.collection(COLLECTION_NAME_TEST).insertOne(testObj)
            if(testObjResp && testObjResp.insertedCount && testObjResp.ops && testObjResp.ops[0]){
                return testObjResp.ops[0]
             } 
           } 
        catch(err){
            throw err

        }
      }
      
    }


    async getFeedBackForObject(params){
        if(!Object.keys(params).length){
            throw {error:"empty request!"}
        } 
        try{
        let db = getDb();
        if(params.objectType===OBJECT_TYPE_TEST){
            let feedbacks = await db.collection(COLLECTION_NAME_FEEDBACK).find({objectType:params.objectType,userId:params.userId,objectId: { $in: params.objectIds }}).toArray(); 
            if(feedbacks && feedbacks.length){
                return feedbacks
            }
            else{
                return {}
             }
            }
        }
        catch(err){
            console.log("====debug====err",err)
            throw err

         }

    }

 }

module.exports = TestMgr;