const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var adminStatusSchema = new Schema({
    admin_id: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    status: {type: String, required: true}
});

module.exports = adminStatusSchema;