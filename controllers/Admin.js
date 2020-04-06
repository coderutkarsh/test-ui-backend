const AdminMgr = require('../models/AdminMgr')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const saltRounds = 10

exports.addUpdateAdmin = (req,res,next)=>{
//  console.log("ctrl2",req.body)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(422).send({validationErrors:errors.array()})
    }
    else{
        let adminMgrObj = new AdminMgr(req.body.id);
        bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
            req.body.password = hash 
            adminMgrObj.addUpdateAdmin(req.body).then((resp)=>{
                console.log("Resp of adding admin",resp)
            })
            .catch((err)=>{
                console.log("error while adding admin",err)
            })   
        
        });
        
    }
    // console.log("errors",errors)
}

exports.loginAdmin = (req,res,next) =>{
    const errors = validationResult(req).errors
    console.log("errors temp",errors)
    
    if(errors.length){
        // console.log("errors temp",errors)
        res.status(422).send({validationErrors:errors})
    } 
    else{
        //logging in and set session etc.
        // console.log("req session",req.session)
        if(req.session.isLogged){
             console.log("session is found set",req.session.isLogged)
        }
        else{
            console.log("setting the session")
            req.session.isLogged = true
            req.session.save(()=>{
                console.log(req.session);
                // res.redirect('/');
                res.status(200).json({ loggedIn:true });
                
            });

            // console.log("session is set") 
        
        }
        }
}