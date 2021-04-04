const { Schema, model } = require('mongoose');


const UserSchema = new Schema({
    UserID: {
        type: String
    },
});

module.exports = model("UserSchema", UserSchema);