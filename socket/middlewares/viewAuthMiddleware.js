module.exports = {
    isAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/views/login')
    },
    isNotAuthenticated: (req, res, next) => {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/views/room')
    },
  };
  