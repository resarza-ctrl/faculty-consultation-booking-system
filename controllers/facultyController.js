const studentController = require('./studentController');
const bookings = studentController.bookings || studentController.getBookings();

exports.getDashboard = (req, res) => {
  const facultyBookings = bookings.filter(b => b.facultyId === req.session.user.id);
  
  facultyBookings.sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.time);
    const dateB = new Date(b.date + 'T' + b.time);
    return dateA - dateB;
  });
  
  res.render('faculty/dashboard', {
    user: req.session.user,
    bookings: facultyBookings,
    success: req.session.success,
    error: req.session.error
  });
  delete req.session.success;
  delete req.session.error;
};

exports.approveBooking = (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === bookingId && b.facultyId === req.session.user.id);
  
  if (!booking) {
    req.session.error = 'Booking not found or unauthorized';
    return res.redirect('/faculty/dashboard');
  }
  
  booking.status = 'Approved';
  req.session.success = `Booking request from ${booking.studentName} has been approved.`;
  res.redirect('/faculty/dashboard');
};

exports.rejectBooking = (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = bookings.find(b => b.id === bookingId && b.facultyId === req.session.user.id);
  
  if (!booking) {
    req.session.error = 'Booking not found or unauthorized';
    return res.redirect('/faculty/dashboard');
  }
  
  booking.status = 'Rejected';
  req.session.success = `Booking request from ${booking.studentName} has been rejected.`;
  res.redirect('/faculty/dashboard');
};
