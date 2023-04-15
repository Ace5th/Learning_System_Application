const express = require("express");
const router = express.Router({ mergeParams: true });

const students = require("../controllers/students");

const multer = require("multer");
const { storage } = require("../../utilities/cloudinary");
const upload = multer({ storage });

const { studentIsLoggedIn, isStudent } = require("../../utilities/middleware");
const catchAsync = require("../../utilities/catchAsync");

router
  .route("/")
  .get(studentIsLoggedIn, isStudent, catchAsync(students.dashboard));

router
  .route("/download-assignment/:fileId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderDownloadAssignment)
  );

router
  .route("/download-review/:fileId")
  .get(studentIsLoggedIn, isStudent, catchAsync(students.renderDownloadReview));

router
  .route("/download-loa/:fileId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderDownloadLetterOfApproval)
  );

router
  .route("/download-history/:fileId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderDownloadHistory)
  );

router
  .route("/download-loa-history/:fileId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderDownloadLetterOfApprovalHistory)
  );

router
  .route("/setting")
  .get(studentIsLoggedIn, isStudent, catchAsync(students.setting));

router
  .route("/setting/profile")
  .get(studentIsLoggedIn, isStudent, catchAsync(students.renderEditProfile))
  .put(studentIsLoggedIn, isStudent, catchAsync(students.editProfile));

router
  .route("/setting/profile/edit-password")
  .get(studentIsLoggedIn, isStudent, catchAsync(students.renderEditPassword))
  .put(studentIsLoggedIn, isStudent, catchAsync(students.editPassword));

router
  .route("/assignment/phases")
  .get(studentIsLoggedIn, isStudent, catchAsync(students.renderSelectPhase));

router
  .route("/assignment/phase1/add-assignment")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAddAssignmentPhase1)
  )
  .post(
    studentIsLoggedIn,
    isStudent,
    upload.single("content"),
    catchAsync(students.addAssignmentPhase1)
  );

router
  .route("/assignment/phase2/add-assignment")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAddAssignmentPhase2)
  )
  .post(
    studentIsLoggedIn,
    isStudent,
    upload.single("content"),
    catchAsync(students.addAssignmentPhase2)
  );

router
  .route("/assignment/:assignmentId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAssignmentDetail)
  );

router
  .route("/assignment/:assignmentId/edit-assignment")
  .get(studentIsLoggedIn, isStudent, catchAsync(students.renderEditAssignment))
  .put(
    studentIsLoggedIn,
    isStudent,
    upload.single("content"),
    catchAsync(students.editAssignment)
  );

router
  .route("/assignment/:assignmentId/delete-assignment")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderDeleteAssignment)
  )
  .delete(studentIsLoggedIn, isStudent, catchAsync(students.deleteAssignment));

router
  .route("/assignment/:assignmentId/reviews")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAssignmentReviews)
  );

router
  .route("/assignment/:assignmentId/review/:reviewId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAssignmentReviewDetail)
  );

router
  .route("/assignment/:assignmentId/history")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAssignmentHistories)
  );

router
  .route("/assignment/:assignmentId/history/:historyId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAssignmentHistoryDetail)
  );

router
  .route("/loa")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderAddLetterOfApproval)
  )
  .post(
    studentIsLoggedIn,
    isStudent,
    upload.single("file"),
    catchAsync(students.addLetterOfApproval)
  );

router
  .route("/loa/:loaId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderLetterOfApprovalDetail)
  );

router
  .route("/loa/:loaId/delete-loa")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderDeleteLetterOfApproval)
  )
  .delete(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.deleteLetterOfApproval)
  );

router
  .route("/loa/:loaId/history")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderLetterOfApprovalHistories)
  );

router
  .route("/loa/:loaId/history/:historyId")
  .get(
    studentIsLoggedIn,
    isStudent,
    catchAsync(students.renderLetterOfApprovalHistoryDetail)
  );

module.exports = router;
