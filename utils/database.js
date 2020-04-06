const mondgodb = require('mongodb')


const MongoClient = mondgodb.MongoClient;

let db_;

let srvAddress = `mongodb+srv://coderutkarsh:Sample12@sample12-lc412.mongodb.net/test?retryWrites=true&w=majority`
let srvAddressLocal = `mongodb://localhost/mern_stack_project`
exports.mongoConnect = callback =>{
MongoClient.connect(srvAddressLocal).then(client=>{
   if(client){
        db_ = client.db();
        callback(client);
    }
    // db_=

}).catch(err=>{
    console.log("err",err)
})



}


exports.getDb = () =>{
    if(db_){
        return db_
    }
    else{
        return null
    }

}

