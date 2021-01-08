var database = require('../../../config/database');
var AdminStatus = require('../../models/AdminStatus');
var Event = require('events');

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

var adminStatusEvent = new Event();

module.exports.changeStatus = function(req, res){
    var data = {
        admin_id: req.body.admin_id,
        name: req.body.name,
        status: req.body.status
    };
    const query = {admin_id: data.admin_id};
    const options = {upsert: true, new: true, setDefaultsOnInsert: true};

    AdminStatus.findOneAndUpdate(query, data, options, function(err, data){
        if(err){
            res.status(500).send({"message": "fail to update or set admin status"});
        }
        if(data){
            res.status(200).send({"message": "successfully update or set admin status"});
            // fire admin-status-changed event
            adminStatusEvent.emit('updated');
        }
    });
}

module.exports.notifyMobileInitialAdminStatus = function(req, res){
    AdminStatus.find(function(err, adminStatuses){
        if(adminStatuses){
         var adminStatuses = adminStatuses.map(function(adminStatus){
             return {
                 admin_id: adminStatus.admin_id,
                 name: adminStatus.name,
                 status: adminStatus.status
             };
         });
         envelope = {
             "data" : adminStatuses
         };
         res.send(envelope);
        }
        if(err){
            res.send({"message": "error retrieving admin statuses"});
        }
    });  
}

module.exports.notifyMobileAdminStatus = function(req, res){
    let capsule = "data: ";

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    adminStatusEvent.on('updated', function(){
        AdminStatus.find(function(err, adminStatuses){
            if(adminStatuses){
             var adminStatuses = adminStatuses.map(function(adminStatus){
                 return {
                     admin_id: adminStatus.admin_id,
                     status: adminStatus.status
                 };
             });
             envelope = JSON.stringify({
                "data" : adminStatuses
            });
            capsule += envelope + '\n\n';
            res.write(capsule);
            }
            if(err){
                data = JSON.stringify({"message": "error retrieving admin statuses"});
                capsule += data + '\n\n';
                res.write(capsule);
            }
        });
    });  
}