const express = require('express');
const router = express.Router();
const { authenticateToken,authoriseRole } = require('../middlewares/authMiddleware');

const AuthController = require('../controllers/AuthController');
const AttendanceController = require('../controllers/AttendanceController');
router.use(authenticateToken);
router.use(authoriseRole);

// user routes
router.get('/users', AuthController.getUsers);
router.get('/users/role/:role', AuthController.getAllUsers);
router.post('/users', AuthController.createUser);
router.put('/users/:id', AuthController.updateUser);

// designation route 
router.get('/designations', AttendanceController.getDesignations);
router.post('/designations', AttendanceController.createDesignation);
router.put('/designations/:id',AttendanceController.updateDesignation);
router.delete('/designations/:id', AttendanceController.deleteDesignation);

// event routes
router.get('/events', AttendanceController.getEvents);
router.post('/events', AttendanceController.createEvent);
router.put('/events/:id', AttendanceController.updateEvent);
router.delete('/events/:id', AttendanceController.deleteEvent);
router.get('/events/all', AttendanceController.getAllEvents);

// hall routes
router.get('/events/:id/halls', AttendanceController.getHalls);
router.post('/halls', AttendanceController.createHall);
router.put('/halls/:id', AttendanceController.updateHall);
router.delete('/halls/:id', AttendanceController.deleteHall);

// attendance routes
router.get('/attendance', AttendanceController.getAttendances);
router.post('/attendance', AttendanceController.createAttendance);
router.put('/attendance/:id', AttendanceController.updateAttendance);
router.delete('/attendance/:id', AttendanceController.deleteAttendance);

// vender code routes
router.get('/vender-codes', AttendanceController.getVendorCodes);
router.post('/vender-codes', AttendanceController.createVendorCode);
router.put('/vender-codes/:id', AttendanceController.updateVendorCode);
router.delete('/vender-codes/:id', AttendanceController.deleteVendorCode);

//report routes
router.get('/reports/:id', AttendanceController.generateEventReport);
router.get('/attendance/reports/:id', AttendanceController.generateAttendanceSheet);

module.exports = router;