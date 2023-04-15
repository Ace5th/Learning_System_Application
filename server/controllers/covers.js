const Student = require("../../models/student.js");
const { Question, Instruction } = require("../../models/info.js");

module.exports.home = (req, res) => {
  res.render("covers/home");
};

module.exports.howTo = async (req, res) => {
  const howtos = await Instruction.find({ audience: "Student" });
  res.render("covers/howTo", { howtos });
};

module.exports.faqs = async (req, res) => {
  const faqs = await Question.find({ audience: "Student" });
  res.render("covers/faqs", { faqs });
};

module.exports.about = (req, res) => {
  res.render("covers/about");
};

module.exports.renderRegisterStudent = (req, res) => {
  const departments = ["Accounting", "Economics", "Management"];
  res.render("covers/registerStudent", { departments });
};

module.exports.registerStudent = async (req, res) => {
  try {
    const { name, email, phoneNumber, department, username, password } =
      req.body.student;
    const student = new Student({
      name,
      email,
      phoneNumber,
      department,
      username,
    });
    const registeredStudent = await Student.register(student, password);
    req.login(registeredStudent, (e) => {
      if (e) return next(e);
      req.flash("success", "Welcome to SISTA!");
      res.redirect("/student");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register-student");
  }
};

module.exports.renderLoginStudent = (req, res) => {
  res.render("covers/loginStudent");
};

module.exports.loginStudent = async (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/student";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutStudent = (req, res) => {
  req.logout(function (e) {
    if (e) {
      return next(e);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};

module.exports.renderLoginLecturer = (req, res) => {
  res.render("covers/loginLecturer");
};

module.exports.loginLecturer = async (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/lecturer";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutLecturer = (req, res) => {
  req.logout(function (e) {
    if (e) {
      return next(e);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};

module.exports.renderLoginAdmin = (req, res) => {
  res.render("covers/loginAdmin");
};

module.exports.loginAdmin = async (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/admin";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutAdmin = (req, res) => {
  req.logout(function (e) {
    if (e) {
      return next(e);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
};
