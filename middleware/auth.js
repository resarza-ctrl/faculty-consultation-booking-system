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

module.exports = { requireAuth, requireGuest };
