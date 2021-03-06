var database = require('../../../config/database');
var Event = require('events');
var stringGenerator = require('../../../utilities/stringGenerators');

var envs = require('../../../config/server-env');

const agoraAppId = envs.AGORA_APP_ID;

const superagent = require('superagent');

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

var adminAnswerEvent = new Event();

module.exports.answerCall = function(req, res){
    if(req.body.answer === 'accept'){
        // fire accept call event with channel credentials
        uid = 0;
        channel = stringGenerator.generateRandomString(10);
        superagent.get('https://pks-test-token.herokuapp.com/access_token')
        .query({"channel": channel, "uid": uid})
        .end(function(err, superres){
            var channelCredentials = {};
            if(err){
                channelCredentials = {
                    "agora_id": agoraAppId,
                    "channel_name": "",
                    "channel_token": ""                    
                };
            }
            else{
                channelCredentials = {
                    "agora_id": agoraAppId,
                    "channel_name": channel,
                    "channel_token": superres.body.token                   
                };
            }

            envelope = {
                "data": {
                    "agora_id": agoraAppId,
                    "channel_name": channelCredentials.channel_name,
                    "channel_token": channelCredentials.channel_token                    
                }
            };
            adminAnswerEvent.emit('answer', 'accept', channelCredentials);
            res.send(envelope);
        });
        // const channelToken = RtcTokenBuilder.buildTokenWithUid(agoraAppId, agoraAppCertificate, channelName, uId, role, privilegeExpireTime);
        // const channelCredentials = {
        //     'channel_name': channelName,
        //     'channel_token': channelToken
        // };
        // envelope = {
        //     "data" : {
        //         "agora_id": agoraAppId,
        //         "channel_name": channelCredentials.channel_name,
        //         "channel_token": channelCredentials.channel_token
        //     }
        // };
        // adminAnswerEvent.emit('answer', 'accept', channelCredentials);
        // res.send(envelope);
    }
    if(req.body.answer === 'reject'){
        // fire reject call event with null channel
        adminAnswerEvent.emit('answer', 'reject', null);
        res.send({"message": "call rejected"});
    }
}

module.exports.notifyMobileAdminsAnswer = function(req, res){
    let capsule = 'data: ';

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    adminAnswerEvent.on('answer', function(message, channelCredentials){
        if(message === 'accept'){
            data = JSON.stringify({
                "message" : "call accepted",
                "data" : channelCredentials
            });
            capsule += data + '\n\n';
            res.write(capsule);
        }
        if(message === 'reject'){
            data = JSON.stringify({
                "message": "call rejected",
                "data" : {
                    channel_name: null,
                    channel_token: null
                }
            });
            capsule += data + '\n\n';
            res.write(capsule);
        }
    });
}