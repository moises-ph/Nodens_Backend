const mongoose = require('mongoose');

const URL = 'mongodb://127.0.0.1:27017/Nodens_Users?directConnection=true&serverSelectionTimeoutMS=2000&appName=Nodens_User_Initialization_Service';


mongoose.connect(URL,{
  useNewUrlParser: true
}).then(db=>{
  console.log("Db connect successful");
}).catch(err=>{
  new Error(err);
});
  
module.exports=mongoose;