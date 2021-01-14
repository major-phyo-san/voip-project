var envs = require('../../../config/server-env');
var database = require('../../../config/database');
var auth = require('../../../config/auth');

var renderContext = {};

module.exports.callScreen = function(req, res){
    renderContext['user'] = req.user;
    res.render('admins/call-screen', renderContext);
}

module.exports.userManagementScreen = function(req, res){
    renderContext['user'] = req.user;
    renderContext['csrfToken'] = req.csrfToken();
    res.render('admins/user-management', renderContext);
}