let UserMgr = require('../models/UserMgr')

exports.signupUser = (req,res,next)=>{
    if(req.body.email && req.body.userName && req.body.password ){
        let user = req.body
        let UserObj = new UserMgr(user);
        UserObj.signupUser().then((resp)=>{
            res.status(200).json(resp)
        }).catch(err=>{
            res.status(500).json(err)
            // console.log("===dev===err",err)
        })
        
    }
    else{
        res.status(400).json({error:"mandatory input is missiong"})
    }
    

} 

exports.loginUser = (req,res,next)=>{
    if(req.body.email && req.body.password ){
        let user = req.body
        let UserObj = new UserMgr(user);
        UserObj.loginUser().then((resp)=>{
            if(resp.error){
                res.status(500).json(resp)
            }
            else{
                res.status(200).json(resp)
            }
            }).catch(err=>{
            res.status(500).json(err)
            // console.log("===dev===err",err)
        })
        
    }
    else{
        res.status(400).json({error:"mandatory input is missiong"})
    }
 


}