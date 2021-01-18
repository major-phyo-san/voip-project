var express = require('express');
var router = express.Router();

var auth = require('../config/auth');

var authValidator = require('../app/http/middlewares/authValidator');
var apiUserGuard = require('../app/http/middlewares/apiUserGuard');
var AdminStatusController = require('../app/http/controllers/AdminStatusController');
var AdminRingingController = require('../app/http/controllers/AdminRingingController');
var AdminAnswersCallController = require('../app/http/controllers/AdminAnswersCallController');

/* GET api index page. */
router.get('/api', function(req, res) {
    res.set({
        'Content-Type': 'application/json'
    }).send({"message": 'welcome'});
});

/* protected route to test auth validator */
router.get('/api/protected', authValidator.validateAPIUser, function(req, res){
    res.send({"message": "authenticated user"});
});

/* API authentication route */
router.post('/api/login', auth.makeJWTAuth);

/* internal api calls from admins */
router.put('/api/admins/change-online-status', AdminStatusController.changeStatus);
router.get('/api/admins/subscribe/incoming-call', AdminRingingController.notifyAdminRinging);
router.post('/api/admins/answer-call', AdminAnswersCallController.answerCall);

/* mobile api calls */
router.get('/api/mobile/subscribe/online-status', authValidator.validateAPIUser, AdminStatusController.notifyMobileAdminStatus);
router.get('/api/mobile/subscribe/online-status/initial', authValidator.validateAPIUser, AdminStatusController.notifyMobileInitialAdminStatus);
router.post('/api/mobile/call-admin', authValidator.validateAPIUser, AdminRingingController.ringAdmin);
router.get('/api/mobile/subscribe/call-answer', authValidator.validateAPIUser, AdminAnswersCallController.notifyMobileAdminsAnswer);

module.exports = router;