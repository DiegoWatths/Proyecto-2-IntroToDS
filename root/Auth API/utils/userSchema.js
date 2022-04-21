const mongoose = require('mongoose')
const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
    {
        username: {type: String,  required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, required: true},
    }
)

UserSchema.methods.encryptPassword = async function (password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

module.exports = model('User', UserSchema);