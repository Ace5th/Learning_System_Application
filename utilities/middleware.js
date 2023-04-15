const { assignmentSchema, reviewSchema } = require("./jois");

const ExpressError = require("./ExpressError");

module.exports.cleanSlate = (req, res, next) => {
  req.session.destroy();
  next();
};

module.exports.studentIsLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login-student");
  }
  next();
};

module.exports.isStudent = (req, res, next) => {
  if (req.user.role !== "Student") {
    req.flash("error", "Access not allowed");
    return res.redirect("/login-student");
  }
  next();
};

module.exports.lecturerIsLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login-lecturer");
  }
  next();
};

module.exports.isLecturer = (req, res, next) => {
  if (req.user.role !== "Lecturer") {
    req.flash("error", "Access not allowed");
    return res.redirect("/login-lecturer");
  }
  next();
};

module.exports.adminIsLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login-admin");
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    req.flash("error", "Access not allowed");
    return res.redirect("/login-admin");
  }
  next();
};

module.exports.validateAssignment = (req, res, next) => {
  const { error } = assignmentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
