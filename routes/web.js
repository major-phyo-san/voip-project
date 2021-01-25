var express = require('express');
var router = express.Router();

var authValidator = require('../app/http/middlewares/authValidator');
var webUserGuard = require('../app/http/middlewares/webUserGuard');

var LoginController = require('../app/http/controllers/auth/LoginController');
var RegisterController = require('../app/http/controllers/auth/RegisterController');

var AdminScreenController = require('../app/http/controllers/AdminScreenController');
var AdminCRUDController = require('../app/http/controllers/AdminCRUDController');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index');
});

/* protected route to test auth validator */
router.get('/protected', authValidator.validateWebUser, function(req, res){
    res.send('authenticated user');
});

/* admin panel */
router.get('/admins/communication/calls', authValidator.validateWebUser, webUserGuard.adminsOnly, AdminScreenController.callScreen);
router.get('/admins/management/admin-users', authValidator.validateWebUser, webUserGuard.adminsOnly, AdminScreenController.adminUserManagementScreen);

/* admin CRUD routes */
router.post('/admins', authValidator.validateWebUser, webUserGuard.adminsOnly, AdminCRUDController.addNewUser);
router.delete('/admins/:userId', authValidator.validateWebUser, webUserGuard.adminsOnly, AdminCRUDController.deleteUser);
router.put('/admins/:userId', authValidator.validateWebUser, webUserGuard.adminsOnly, AdminCRUDController.updateUser);

/* Web authentication routes */
router.get('/login', LoginController.showLoginForm);
router.post('/login', LoginController.login);
router.get('/logout', LoginController.logout);

/* registration route */
router.get('/register', RegisterController.showRegisterForm);
router.post('/register', RegisterController.registerUser);

module.exports = router;