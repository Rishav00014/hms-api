const express = require('express');

const { authenticateToken } = require('../middlewares/authMiddleware');
const AuthController = require('../controllers/AuthController');  

const router = express.Router();

//router.post('/register', AuthController.createUser);
router.post('/login', AuthController.signIn);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/change-password', AuthController.changePassword);


router.post('/logout',authenticateToken, AuthController.logout);
router.put('/profile',authenticateToken, AuthController.updateProfile);
router.get('/profile',authenticateToken, AuthController.getDetails);

module.exports = router;