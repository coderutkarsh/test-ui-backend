const getDb = require('../utils/database').getDb
const Option = require('./Option')
const mongodb = require('mongodb')
const arrayUtils = require('../utils/arrayUtils')


class Question {
    constructor(displayText,options,priority,id){
        var action
        if(id){
             this.id=id
             action = 'update' 
        }else{
              action = 'add'
        }
        this.getOperation = function() { return action }    
        this.displayText = displayText
        this.options = options
        this.priority = priority
    }
    static getAllQuestions(){
        let db = getDb();
        let dbOp = db.collection('questionDefs').find({}).toArray();
        if(dbOp){
            /* 
            No need to return separate promise we could also return the same as we did with controller function: getAllFeedbacks
            */
       
            return new Promise((resolve,reject)=>{
            dbOp.then((resp)=>{
                resolve(resp)  
            }).catch((err)=>{
                reject(err)
            })
          }
         )
      }
    } 

    static parseOptionObjs(subQuestions,optionObjs){
        if(subQuestions && subQuestions.length){
            // let options = 
            for(let subQuestion of subQuestions){
                let optionIds = subQuestion.options
                if(optionIds && optionIds.length){
                    let options = [];
                    for(let optionId of optionIds){
                        // console.log("optionObjs",optionObjs)
                        let optionData = optionObjs.filter((optionObj)=>{
                            // console.log("optionObj",typeof optionId)
                              return optionObj && optionObj._id.equals(optionId)

                        })
                        if(optionData && optionData.length){
                            options.push(optionData[0])
                        }

                        // console.log("optionData",optionData)

                    //    let optionObj = arrayUtils.findFieldInObjArray(optionObjs,)



                    }
                 subQuestion.options = options
                //    console.log("options",options)
              

                }
 


            }



        }  


    }




    
     static async getSubquestionData(subQuestionIds){
       if(subQuestionIds && subQuestionIds.length){
            let db = getDb();
            let subQuestions = await db.collection("questionDefs").find({_id:{$in:subQuestionIds}}).toArray();
            if(subQuestions && subQuestions.length){
                //fetcing options and putting in options in subquestion object.
                let optionIds = []
                subQuestions.map(subQuestion=>{
                 if(subQuestion.options && subQuestion.options.length){
                     optionIds = optionIds.concat(subQuestion.options)           
                   }  
                })
                if(optionIds && optionIds.length){
                    let optionObjs = await db.collection("optionDefs").find({_id:{$in:optionIds}}).toArray();                 
                    if(optionObjs && optionObjs.length){
                    //    console.log("optionObjs",optionObjs) /
                     Question.parseOptionObjs(subQuestions,optionObjs)
                     return subQuestions
                    } 
               
                }
                else{
                    return subQuestions
                }
           } 
        }
    }





    convertOptionNamesToOptionIds(){
        if(this.options && Array.isArray(this.options)){
            return new Promise((resolve,reject)=>{
                Option.getOptionsByNames(this.options)
                .then((optionDefs)=>{
                    if(optionDefs && optionDefs.length){
                        let optionIdsNotFound=[];
                        for(let option of this.options){
                            let found=false 
                            for(let optionDef of optionDefs){
                                  if(optionDef.displayText===option){
                                      found=true
                                      break;
                                  }
                             }
                             if(!found){
                                optionIdsNotFound.push(option)
                             }
                       }
                       if(optionIdsNotFound.length){
                           reject({idsNotFound:optionIdsNotFound})
                       }
                       let optionIds = optionDefs.map(optionDef => 
                        {  
                           return new mongodb.ObjectId(optionDef._id)
                        });
                       resolve(optionIds)
                      }
                   })
                .catch((err)=>{
               reject(err)
                })
            })
         }   
     }


    addOrUpdateQuestion(){
        var operation = this.getOperation();
        // console.log("operation",operation)
        return new Promise((resolve,reject)=>{
            let db = getDb();
            this.convertOptionNamesToOptionIds().then((optionIds)=>{
                this.options=optionIds
                let dbOp
                switch(operation){
                    case 'add':  
                    delete this.id
                    console.log("this",this)
                    dbOp = db.collection("questionDefs").insertOne(this)
                    break;    
                    case 'update':
                    dbOp = db.collection('questionDefs').updateOne({_id:new mongodb.ObjectId(this.id)},{$set:this})                    
                    break;
                }
                 if(dbOp){
                    dbOp.then((resp)=>{
                       resolve({questionInserted:true})
                    })
                    .catch((err)=>{
                        reject({questionInserted:false,error:err})
                    })
                }
                
                })
                 .catch(err=>{
                    reject(err)
                })
                
          })
    }
}

module.exports = Question