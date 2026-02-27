const alumniOnly = (req, res, next) => {
  if (req.user && req.user.role === 'alumni') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Alumni access required.' });
};

module.exports = alumniOnly;
