const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')
const COLLECTION_NAME_USER = 'users'

class User{
    constructor(userData){
        this.userData = userData
    }
    async signupUser(){
        let db = getDb();
        let userEmail = this.userData.email
        let existingUser
        try{
         existingUser = await db.collection(COLLECTION_NAME_USER).find({email:userEmail}).toArray()
         if(existingUser && existingUser.length){
          return {error:true,errorMessage:"User already exists"} 
        }
       }
       catch(err){
         throw err    
       }  
       try{
            let userInfo = await db.collection(COLLECTION_NAME_USER).insertOne(this.userData) 
            if(userInfo && userInfo.insertedCount && userInfo.ops && userInfo.ops[0]){
               return userInfo.ops[0]
            }
        }
        catch(err){
           throw err  
        }
     }

     async loginUser(){
      let db = getDb();
        let userEmail = this.userData.email
        let password = this.userData.password
        let existingUser
        try{
            existingUser = await db.collection(COLLECTION_NAME_USER).find({email:userEmail,password:password}).toArray()
           if(existingUser && existingUser.length){
             return existingUser[0] 
           }
           else{
             return {error:true,errorMessage:"Invalid credentials"}
           }
          }
          catch(err){
            throw err    
          }


     }
}

module.exports = User