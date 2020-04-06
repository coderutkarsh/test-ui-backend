const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
class Option {
      constructor(displayText,weight,subQuestionId,id){
        this.operation = null 
        if(displayText)
        this.displayText = displayText  
        if(weight)
        this.weight = weight
        if(subQuestionId){
          this.subQuestionId = new mongodb.ObjectId(subQuestionId)
        }    
        if(id){
          this.id = id
          this.operation = 'update'
        }
        else{
          this.operation = 'add'
        }
     }

     static getAllOptions(){
  
      let db = getDb();
      let dbOp = db.collection('optionDefs').find({}).toArray();
      if(dbOp){
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


     static getOptionsByNames(names){
       if(names && Array.isArray(names)){
          let db = getDb();
           

           return new Promise((resolve,reject)=>{
               db.collection("optionDefs").find({displayText:{$in:names}}).toArray()
               .then((optionDefs)=>{
                    resolve(optionDefs)  
                })
                .catch((err)=>{
                  reject(err)
                })
             }) 
           }  
       }
   deleteOption(){
         let db = getDb();
         return new Promise((resolve,reject)=>{
          db.collection("optionDefs").deleteOne({_id:mongodb.ObjectId(this.id)})
          .then((resp)=>{
            resolve({resp})
          }).catch((err)=>{
            reject({resp:err})
          })
        }) 
    }

    addOrUpdateOption(){
         let db = getDb();
        //  console.log("db",db)
         let dbOp = null
         let objectToUpdate = {...this}
         switch(this.operation){
              case 'update':
                // delete this.operation
               
                objectToUpdate = {...this}
               delete objectToUpdate.id
                delete objectToUpdate.operation  
              dbOp = db.collection('optionDefs').updateOne({_id:new mongodb.ObjectId(this.id)},{$set:objectToUpdate})                    
              break;
              case 'add':
                // console.log("this",this)
                
                objectToUpdate = {...this}
                delete objectToUpdate.operation
                dbOp = db.collection('optionDefs').insertOne(objectToUpdate) 
               break;
         }  
      
         if(dbOp){
          return new Promise((resolve,reject)=>{
            dbOp.then((resp)=>{
               resolve({resp:resp})  
            }).catch((err)=>{
              reject({err:err})
             })
          }) 
         }
        }

      
      




      
      addOption(params){
        const db = getDb();
        let feedback = null
        if(params){
          feedback = params.body
        }
        db.collection('Feedback').insertOne(feedback).then(res=>{
          return {feedbackAdded:true}
        }).catch((err)=>{
        return {feedbackAdded:false}
        }) 
       }


}

module.exports = Option