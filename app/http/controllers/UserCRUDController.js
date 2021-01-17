var database = require('../../../config/database');
var cryptography = require('../../../utilities/cryptography');
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

module.exports.addNewUser = function(req, res){
    cryptography.bcrypt(req.body.password, 10, function(hashed){
        var createData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
            password: hashed
        };

        var user = new User(createData);
        user.save(function(err, data){
            res.redirect('/admins/management/users');
        });
    });    
}

module.exports.deleteUser = function(req, res){
    userId = req.params.userId;
    User.findByIdAndDelete(userId, function(err){
        res.redirect('/admins/management/users');
    });
}

module.exports.updateUser = function(req, res){
    userId = req.params.userId;
    if(req.body.password){
        cryptography.bcrypt(req.body.password, 10, function(hashed){
            var updateData = {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role,
                password: hashed
            };
            User.findByIdAndUpdate(userId, updateData, function(err){
                res.redirect('/admins/management/users');
            });
        });
    }
    else{
        updateData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        };

        User.findByIdAndUpdate(userId, updateData, function(err){
            res.redirect('/admins/management/users');
        });
    }
}