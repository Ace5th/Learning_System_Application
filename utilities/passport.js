const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Student = require("../models/student");
const Lecturer = require("../models/lecturer");
const Admin = require("../models/admin");

function SessionConstructor(userId, userType, details) {
  this.userId = userId;
  this.userType = userType;
  this.details = details;
}

module.exports = function (passport) {
  passport.use(
    "local-student-login",
    new LocalStrategy(Student.authenticate())
  );

  passport.use(
    "local-lecturer-login",
    new LocalStrategy(Lecturer.authenticate())
  );

  passport.use("local-admin-login", new LocalStrategy(Admin.authenticate()));

  passport.serializeUser(function (userObject, done) {
    let userType = "student";
    let userPrototype = Object.getPrototypeOf(userObject);

    if (userPrototype === Student.prototype) {
      userType = "student";
    } else if (userPrototype === Lecturer.prototype) {
      userType = "lecturer";
    } else if (userPrototype === Admin.prototype) {
      userType = "admin";
    }

    let sessionConstructor = new SessionConstructor(
      userObject.id,
      userType,
      ""
    );
    done(null, sessionConstructor);
  });

  passport.deserializeUser(function (sessionConstructor, done) {
    if (sessionConstructor.userType == "student") {
      Student.findOne(
        {
          _id: sessionConstructor.userId,
        },
        "-localStrategy.password",
        function (err, user) {
          done(err, user);
        }
      );
    } else if (sessionConstructor.userType == "lecturer") {
      Lecturer.findOne(
        {
          _id: sessionConstructor.userId,
        },
        "-localStrategy.password",
        function (err, user) {
          done(err, user);
        }
      );
    } else if (sessionConstructor.userType == "admin") {
      Admin.findOne(
        {
          _id: sessionConstructor.userId,
        },
        "-localStrategy.password",
        function (err, user) {
          done(err, user);
        }
      );
    }
  });
};
