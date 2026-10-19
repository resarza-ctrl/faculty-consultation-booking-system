function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

function requireGuest(req, res, next) {
  if (req.session && req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

function requireFaculty(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'faculty') {
    next();
  } else {
    res.redirect('/');
  }
}

function requireStudent(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'student') {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = { requireAuth, requireGuest, requireFaculty, requireStudent };
