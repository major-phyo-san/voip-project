var database = require('../../../config/database');
var User = require('../../models/User');

var optionalConnectionString = {
    authSource: 'admin',
    compressors: 'zlib',
    gssapiServiceName: 'mongodb'
}

var serverOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

database.makeMongoDBConnection(optionalConnectionString, serverOptions);

var renderContext = {};

module.exports.callScreen = function(req, res){
    renderContext['user'] = req.user;
    res.render('admins/call-screen', renderContext);
}

module.exports.adminUserManagementScreen = function(req, res){
    renderContext['user'] = req.user;
    renderContext['csrfToken'] = req.csrfToken();
    
    User.find({role: "admin"}, function(err, users){
        var users = users.map(function(user){
            return{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        renderContext['users'] = users;
        res.render('admins/admin-management', renderContext);
    });
}