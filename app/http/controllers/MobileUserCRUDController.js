var database = require('../../../config/database');
var cryptography = require('../../../utilities/cryptography');
var stringGenerator = require('../../../utilities/stringGenerators');

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
            email: stringGenerator.generateRandomString(11),
            phone: req.body.phone,
            role: "mobile",
            verified: true,
            password: hashed
        };

        var user = new User(createData);
        user.save(function(err, data){
            res.redirect('/admins/management/mobile-users');
        });
    });    
}

module.exports.deleteUser = function(req, res){
    userId = req.params.userId;
    User.findByIdAndDelete(userId, function(err){
        res.redirect('/admins/management/mobile-users');
    });
}

module.exports.updateUser = function(req, res){
    userId = req.params.userId;
    if(req.body.password){
        cryptography.bcrypt(req.body.password, 10, function(hashed){
            var updateData = {
                name: req.body.name,
                email: stringGenerator.generateRandomString(10),
                phone: req.body.phone,
                role: "mobile",
                password: hashed
            };
            User.findByIdAndUpdate(userId, updateData, function(err){
                res.redirect('/admins/management/mobile-users');
            });
        });
    }
    else{
        updateData = {
            name: req.body.name,
            email: stringGenerator.generateRandomString(10),
            phone: req.body.phone,
            role: "mobile",
        };

        User.findByIdAndUpdate(userId, updateData, function(err){
            res.redirect('/admins/management/mobile-users');
        });
    }
}