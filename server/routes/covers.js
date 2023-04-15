const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");

const covers = require("../controllers/covers");

const multer = require("multer");
const { storage } = require("../../utilities/cloudinary");
const upload = multer({ storage });

const { cleanSlate } = require("../../utilities/middleware");
const catchAsync = require("../../utilities/catchAsync");

router.route("/").get(cleanSlate, covers.home);

router.route("/howto").get(cleanSlate, catchAsync(covers.howTo));

router.route("/faqs").get(cleanSlate, catchAsync(covers.faqs));

router.route("/about").get(cleanSlate, covers.about);

router
  .route("/register-student")
  .get(covers.renderRegisterStudent)
  .post(catchAsync(covers.registerStudent));

router
  .route("/login-student")
  .get(cleanSlate, covers.renderLoginStudent)
  .post(
    passport.authenticate("local-student-login", {
      failureFlash: true,
      failureRedirect: "/login-student",
      keepSessionInfo: true,
    }),
    covers.loginStudent
  );

router.route("/logout-student").get(covers.logoutStudent);

router
  .route("/login-lecturer")
  .get(cleanSlate, covers.renderLoginLecturer)
  .post(
    passport.authenticate("local-lecturer-login", {
      failureFlash: true,
      failureRedirect: "/login-lecturer",
      keepSessionInfo: true,
    }),
    covers.loginLecturer
  );

router.route("/logout-lecturer").get(covers.logoutLecturer);

router
  .route("/login-admin")
  .get(cleanSlate, covers.renderLoginAdmin)
  .post(
    passport.authenticate("local-admin-login", {
      failureFlash: true,
      failureRedirect: "/login-admin",
      keepSessionInfo: true,
    }),
    covers.loginAdmin
  );

router.route("/logout-admin").get(covers.logoutAdmin);

module.exports = router;
