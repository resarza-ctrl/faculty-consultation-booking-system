require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const facultyRoutes = require('./routes/faculty');
const { requireAuth } = require('./middleware/auth');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/student', studentRoutes);
app.use('/faculty', facultyRoutes);

app.get('/', requireAuth, (req, res) => {
  if (req.session.user.role === 'student') {
    res.redirect('/student/dashboard');
  } else if (req.session.user.role === 'faculty') {
    res.redirect('/faculty/dashboard');
  } else {
    res.render('dashboard', { user: req.session.user });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
