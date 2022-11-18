const { Schema , model, Model  }  = require('mongoose');

const UserDataSchema = new Schema({
        Musician : { type: Schema.Types.ObjectId , ref: 'User' },
        instruments : {type:Array, required: false},
        TheoricalHabiliteis :{type: Array, required: false},
});

const UserData = model('UserData', UserDataSchema);

module.exports = UserData;