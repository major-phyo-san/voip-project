const jwt = require('jsonwebtoken');
const envs = require('../../../config/server-env');

module.exports.adminsOnly = function(req, res, next){
    const [type, token] = req.headers["authorization"].split(" ");
    jwt.verify(token, envs.NODE_KEY, function(err, user){
        if(user.role === "admin"){
            next();
        }
        else{
            res.status(403).send({ "message": "not authorized", "reason": "not allowed to request"});
        }
    });
}