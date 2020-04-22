let TestMgr = require('../models/TestMgr')

exports.getTest = (req,res,next)=>{
    let testId = req.query.testId
    let TestMgrObj = new TestMgr(testId); 
    let params = req.query
    TestMgrObj.getTest(params).then((resp)=>{
        res.status(200).json(resp)
    }).catch((err)=>{
        res.status(500).json(err)
    })
}

exports.submitTest = (req,res,next)=>{
    let submission = req.body.submission
    let testId = submission.testId
    let TestMgrObj = new TestMgr(testId); 
    TestMgrObj.submitTestAttempt(submission).then((resp)=>{
        res.status(200).json(resp)
    }).catch((err)=>{
        res.status(500).json(err)
    })
}


exports.getSubmissionsForUser = (req,res,next)=>{
    let userId = req.query.userId
    let TestMgrObj = new TestMgr(); 
    TestMgrObj.getSubmissionsForUser(userId).then((resp)=>{
        res.status(200).json(resp)
    }).catch((err)=>{
        res.status(500).json(err)
    })

}


exports.createTest = (req,res,next)=>{
    let testBody = req.body
    let TestMgrObj = new TestMgr(); 
    TestMgrObj.createTest(testBody).then((resp)=>{
        res.status(200).json(resp)
    }).catch((err)=>{
        res.status(500).json(err)
    })

}