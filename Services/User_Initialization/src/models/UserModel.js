const { Schema , model, Model  }  = require('mongoose');

const UserSchema  = new Schema({
        Userid : {type: Number, required: true },
        FirstName:{type: String, required:true},
        SecondName: {type: String, required:false},
        LastName :{type: String, required:true},
        SecondLastName : {type: String, required:false},
        email: {type: String, required: true},
        password: {type: String, required: true},
        phone :{type: String, required: true},
        bornDate : {type: Date, required: true},
        UserType :{type:String, required: true}
});

const User = model('User', UserSchema);

module.exports = User;