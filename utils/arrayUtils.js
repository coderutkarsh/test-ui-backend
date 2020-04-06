//returns an array of objects in which field is found
exports.findFieldInObjArray = (arr,field,val,isObjId)=>{
    if(arr && arr.length){
        return arr.filter((el)=>{
            if(isObjId){
                return el && val && val.equals(el[field])
            }
            return el && el[field]===val
        })  



    }



}

exports.uniquifyObjectIds = (objectIds)=>{
    if(objectIds && objectIds.length){
         let uniqueIds = [];
         for(let objectId of objectIds){
            if(uniqueIds.length){
              let isFound = false
              for(let uniqueId of uniqueIds){
                 if(uniqueId.equals(objectId)){
                   isFound=true
                 }  
        
              }
              if(isFound===false){
                uniqueIds.push(objectId)
              } 
              
            } 
            else{uniqueIds.push(objectId)}   
        
        }

return uniqueIds
    }
return false

}

