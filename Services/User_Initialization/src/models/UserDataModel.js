const { Schema , model, Model  }  = require('mongoose');

const UserData = new Schema({
        Musician : { type: Schema.Types.ObjectId , ref: 'User' },
        instruments : {type:Array, required: false},
        TheoricalHabiliteis :{type: Array, required: false},
});

const UserDataSchema = model('UserData', UserDataSchema);

module.exports = UserData;