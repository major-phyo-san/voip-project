const mongoose = require('mongoose');
const adminStatusSchema = require('../../database/migrations/adminStatusSchema');

var AdminStatus = mongoose.model('AdminStatus', adminStatusSchema);

module.exports = AdminStatus;