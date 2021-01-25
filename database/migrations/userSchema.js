const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: String, required: true, unique: true},
    verified: {type: Boolean, required: true},
    password: {type: String, required: true, minlength: 8},
    role: {type: String, required: true}
});

module.exports = userSchema;