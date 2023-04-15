const express = require("express");
const router = express.Router({ mergeParams: true });

const lecturers = require("../controllers/lecturers");

const multer = require("multer");
const { storage } = require("../../utilities/cloudinary");
const upload = multer({ storage });

const {
  lecturerIsLoggedIn,
  isLecturer,
} = require("../../utilities/middleware");
const catchAsync = require("../../utilities/catchAsync");

router
  .route("/")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.dashboard));

router
  .route("/howto")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.howTo));

router
  .route("/faqs")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.faqs));

router
  .route("/download-assignment/:fileId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderDownloadAssignment)
  );

router
  .route("/download-review/:fileId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderDownloadReview)
  );

router
  .route("/download-loa/:fileId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderDownloadLetterOfApproval)
  );

router
  .route("/download-history/:fileId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderDownloadHistory)
  );

router
  .route("/download-loa-history/:fileId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderDownloadLetterOfApprovalHistory)
  );

router
  .route("/setting")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.setting));

router
  .route("/setting/profile")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.renderEditProfile))
  .put(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.editProfile));

router
  .route("/setting/profile/edit-password")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.renderEditPassword))
  .put(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.editPassword));

router
  .route("/inbox")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.renderInbox));

router
  .route("/inbox/student/:studentId/assignment/:assignmentId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderInboxAssignmentDetail)
  );

router
  .route("/inbox/student/:studentId/assignment/:assignmentId/reviews")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderInboxAssignmentReviews)
  );

router
  .route("/inbox/student/:studentId/assignment/:assignmentId/review/:reviewId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderInboxAssignmentReviewDetail)
  );

router
  .route("/inbox/student/:studentId/assignment/:assignmentId/history")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderInboxAssignmentHistories)
  );

router
  .route("/students")
  .get(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.renderStudents));

router
  .route("/student/:studentId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderStudentDetail)
  );

router
  .route("/student/:studentId/assignment/:assignmentId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderAssignmentDetail)
  );

router
  .route("/student/:studentId/assignment/:assignmentId/accept-assignment")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderAcceptAssignment)
  )
  .put(lecturerIsLoggedIn, isLecturer, catchAsync(lecturers.acceptAssignment));

router
  .route("/student/:studentId/assignment/:assignmentId/reviews")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderAssignmentReviews)
  );

router
  .route("/student/:studentId/assignment/:assignmentId/review/add-review")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderAddAssignmentReview)
  )
  .post(
    lecturerIsLoggedIn,
    isLecturer,
    upload.single("file"),
    catchAsync(lecturers.addAssignmentReview)
  );

router
  .route(
    "/student/:studentId/assignment/:assignmentId/review/:reviewId/edit-review"
  )
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderEditAssignmentReview)
  )
  .put(
    lecturerIsLoggedIn,
    isLecturer,
    upload.single("file"),
    catchAsync(lecturers.editAssignmentReview)
  );

router
  .route("/student/:studentId/assignment/:assignmentId/review/:reviewId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderAssignmentReviewDetail)
  );

router
  .route("/student/:studentId/assignment/:assignmentId/history")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderAssignmentHistories)
  );

router
  .route("/student/:studentId/assignment/:assignmentId/history/:historyId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderAssignmentHistoryDetail)
  );

router
  .route("/inbox-loa")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderInboxLettersOfApproval)
  );

router
  .route("/inbox-loa/student/:studentId/loa/:loaId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderInboxLetterOfApprovalDetail)
  );

router
  .route("/inbox-loa/student/:studentId/loa/:loaId/history")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderInboxLetterOfApprovalHistories)
  );

router
  .route("/student/:studentId/loa/:loaId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderLetterOfApprovalDetail)
  );

router
  .route("/student/:studentId/loa/:loaId/sign-loa")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderSignLetterOfApproval)
  )
  .put(
    lecturerIsLoggedIn,
    isLecturer,
    upload.single("file"),
    catchAsync(lecturers.signLetterOfApproval)
  );

router
  .route("/student/:studentId/loa/:loaId/history")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderLetterOfApprovalHistories)
  );

router
  .route("/student/:studentId/loa/:loaId/history/:historyId")
  .get(
    lecturerIsLoggedIn,
    isLecturer,
    catchAsync(lecturers.renderLetterOfApprovalHistoryDetail)
  );

module.exports = router;
