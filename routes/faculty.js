const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { requireAuth, requireFaculty } = require('../middleware/auth');

router.get('/dashboard', requireAuth, requireFaculty, facultyController.getDashboard);
router.post('/booking/:id/approve', requireAuth, requireFaculty, facultyController.approveBooking);
router.post('/booking/:id/reject', requireAuth, requireFaculty, facultyController.rejectBooking);

module.exports = router;
