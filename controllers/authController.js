const { body, validationResult } = require('express-validator');

// Mock accounts
const mockAccounts = {
  student: { id: 1, username: 'student1', password: 'password123', role: 'student', name: 'Student One' },
  faculty: { id: 2, username: 'faculty1', password: 'password123', role: 'faculty', name: 'Faculty One' }
};

exports.getLogin = (req, res) => {
  res.render('login', { errors: [], formData: {} });
};

exports.postLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', { errors: errors.array(), formData: req.body });
    }

    const { username, password } = req.body;
    let user = null;

    if (username === mockAccounts.student.username && password === mockAccounts.student.password) {
      user = mockAccounts.student;
    } else if (username === mockAccounts.faculty.username && password === mockAccounts.faculty.password) {
      user = mockAccounts.faculty;
    }

    if (!user) {
      return res.render('login', { errors: [{ msg: 'Invalid username or password' }], formData: req.body });
    }

    req.session.user = user;
    res.redirect('/');
  }
];

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/auth/login');
  });
};
