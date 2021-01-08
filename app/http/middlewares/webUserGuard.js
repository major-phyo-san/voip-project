module.exports.adminsOnly = function(req, res, next){
    if(req.user.role === 'admin'){
        next();
    }
    else{
        res.render('errorpages/error', {"errorCode": "403", "errorMessage": "not authorized"});
    }
}