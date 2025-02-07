const express = require('express');
const multer = require('multer');

const router = express.Router();
const { authenticateToken,authoriseRole } = require('../middlewares/authMiddleware');

const AttendanceController = require('../controllers/AttendanceController');
const imageController = require("../controllers/ImageController");

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where you want to store uploaded files
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Generate unique filename
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.use(authenticateToken);
router.use(authoriseRole);



router.get('/hall', AttendanceController.getHalls);

router.get('/designation', AttendanceController.getDesignations);
router.get('/vender-code', AttendanceController.getVendorCodes);

router.get('/hall/:id/attendance', AttendanceController.getAttendances);
router.post('/attendance', AttendanceController.createAttendance);
router.put('/attendance/:id', AttendanceController.updateAttendance);
router.delete('/attendance/:id', AttendanceController.deleteAttendance);


router.post('/upload',authenticateToken, upload.single('file'), imageController.uploadeImage);
router.delete('/upload/:id',authenticateToken, imageController.deleteformCloudnamry);


module.exports = router;