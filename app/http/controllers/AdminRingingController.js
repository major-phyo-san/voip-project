var database = require('../../../config/database');
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

var adminRingEvent = new Event();

module.exports.ringAdmin = function(req, res){
    adminRingEvent.emit('ringing');
    res.send({"message" : "ringing to admins"});
}

module.exports.notifyAdminRinging = function(req, res){
    let capsule = "data: ";

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    adminRingEvent.on('ringing', function(){
        data = JSON.stringify({"message" : "ringing"});
        capsule += data + '\n\n';
        res.write(capsule);
    });
}