const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { requireAuth } = require('../middleware/auth');

router.get('/dashboard', requireAuth, studentController.getDashboard);
router.get('/book', requireAuth, studentController.getBookingForm);
router.post('/book', requireAuth, studentController.postBooking);

module.exports = router;
