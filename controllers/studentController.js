const { body, validationResult } = require('express-validator');

// Mock faculty data
const facultyList = [
  { id: 1, name: 'Dr. John Smith', department: 'Computer Science' },
  { id: 2, name: 'Prof. Sarah Johnson', department: 'Mathematics' },
  { id: 3, name: 'Dr. Michael Brown', department: 'Physics' },
  { id: 4, name: 'Prof. Emily Davis', department: 'English' }
];

// In-memory booking storage (shared across controllers for demo)
let bookings = [];

function getBookings() {
  return bookings;
}

function addBooking(booking) {
  booking.id = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
  booking.createdAt = new Date();
  booking.status = 'Pending';
  bookings.push(booking);
  return booking;
}

exports.getBookings = getBookings;
exports.bookings = bookings;

exports.getDashboard = (req, res) => {
  const userBookings = bookings.filter(b => b.studentId === req.session.user.id);
  const now = new Date();
  
  const upcomingBookings = userBookings.filter(b => {
    const bookingDateTime = new Date(b.date + 'T' + b.time);
    return bookingDateTime >= now;
  }).sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateA - dateB;
  });
  
  const pastBookings = userBookings.filter(b => {
    const bookingDateTime = new Date(b.date + 'T' + b.time);
    return bookingDateTime < now;
  }).sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateB - dateA;
  });
  
  res.render('student/dashboard', {
    user: req.session.user,
    upcomingBookings,
    pastBookings,
    success: req.session.success,
    facultyList
  });
  delete req.session.success;
};

exports.getBookingForm = (req, res) => {
  res.render('student/book', {
    user: req.session.user,
    facultyList,
    errors: [],
    formData: {}
  });
};

exports.postBooking = [
  body('facultyId')
    .notEmpty()
    .withMessage('Faculty member is required')
    .isInt({ min: 1 })
    .withMessage('Invalid faculty selection'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isDate()
    .withMessage('Invalid date format'),
  body('time')
    .notEmpty()
    .withMessage('Time slot is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (HH:MM)'),
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Reason/Subject is required')
    .isLength({ min: 5, max: 500 })
    .withMessage('Subject must be between 5 and 500 characters'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('student/book', {
        user: req.session.user,
        facultyList,
        errors: errors.array(),
        formData: req.body
      });
    }

    const { facultyId, date, time, subject } = req.body;
    const bookingDateTime = new Date(date + 'T' + time);
    const now = new Date();
    
    // Check if date is in the past
    if (bookingDateTime < now) {
      return res.render('student/book', {
        user: req.session.user,
        facultyList,
        errors: [{ msg: 'Cannot book consultation for past dates or times' }],
        formData: req.body
      });
    }
    
    // Check for valid time slot (between 9 AM and 5 PM on weekdays for simplicity)
    const hour = bookingDateTime.getHours();
    if (hour < 9 || hour >= 17) {
      return res.render('student/book', {
        user: req.session.user,
        facultyList,
        errors: [{ msg: 'Consultation hours are between 9:00 AM and 5:00 PM' }],
        formData: req.body
      });
    }
    
    const selectedFaculty = facultyList.find(f => f.id === parseInt(facultyId));
    
    const booking = addBooking({
      studentId: req.session.user.id,
      studentName: req.session.user.name,
      facultyId: parseInt(facultyId),
      facultyName: selectedFaculty ? selectedFaculty.name : '',
      facultyDept: selectedFaculty ? selectedFaculty.department : '',
      date,
      time,
      subject
    });
    
    req.session.success = `Booking with ${booking.facultyName} on ${booking.date} at ${booking.time} has been successfully created!`;
    res.redirect('/student/dashboard');
  }
];
