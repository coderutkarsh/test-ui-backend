const AdminMgr = require('../models/AdminMgr')
const bcrypt = require('bcrypt')


exports.validateAdminByEmail = (email,{req})=>{
    // console.log("validator called",email)
    
    if(email){
       let adminMgrObj = new AdminMgr();  
       return adminMgrObj.getAdminByEmail(email).then((resp)=>{ 
        if(resp.length){
            if(req.body.id){
                return true
            }
            return Promise.reject("User Already Exists")
        }
        else{
            return true
        }
        })

    }
}


exports.validateAdminLoginEmail = async function(email,{req}){
    if(email){
        if(email){
            let adminMgrObj = new AdminMgr();  
            return adminMgrObj.getAdminByEmail(email).then(async(resp)=>{ 
               if(resp.length){
                 let admin = resp[0]
                 let password = req.body.password
                 let match = await bcrypt.compare(password, admin.password)
                 if(match===true){
                     return true
                 }
                 else{
                     return Promise.reject("Password Didn't match")
                 }
             }      
             else{
                return Promise.reject("User Doesn't exist")
             }
             })
     
         }
        



    }

}