const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
const collectionName = 'admins'

class AdminMgr{
     constructor(adminId=null){
      if(adminId){
         this.adminId = adminId
        }  
     }
     async getAdminById(adminId){
        let id = adminId?adminId:this.adminId
        if(!adminId){
           let db = getDb();
           try{
            let adminObj = await db.collection(collectionName).find({_id:new mongodb.ObjectId(id)}).toArray();
            return adminObj; 
           }
           catch(e){
               throw new Error({objectFound:false})
           }
        }
     } 
     async getAdminByEmail(email){
       if(email){
          let db = getDb();
          try{
            let adminObj = await db.collection(collectionName).find({"email":email}).toArray() 
            // console.log("adminObj",adminObj)
            return adminObj
          }
          catch(err){
              throw new Error({objectFound:false})   
          } 
        }   
     }  
     async addUpdateAdmin(admin){
      let mode = 'create'    
      let db = getDb();
      if(this.adminId){
           mode = 'update'   
        }

      switch(mode){
         case 'create':
         try{
            await db.collection(collectionName).insertOne(admin)   
            return {objectInserted:true}
         }
        catch(err){
         // console.log("err while querying",err)   
         throw new Error({error:err})
        }
         break; 
           case 'update':
           try{
              await db.collection(collectionName).updateOne({_id: new mongodb.ObjectId(this.adminId)},{$set:admin})
              return {objectUpdated:true}
            }  
           catch(err){
              throw new Error({addUpdateError:err})
           } 
       break;
         }
     }

}

module.exports = AdminMgr;