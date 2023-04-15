const express = require("express");
const router = express.Router({ mergeParams: true });

const admins = require("../controllers/admins");

const multer = require("multer");
const { storage } = require("../../utilities/cloudinary");
const upload = multer({ storage });

const { adminIsLoggedIn, isAdmin } = require("../../utilities/middleware");
const catchAsync = require("../../utilities/catchAsync");

router.route("/").get(adminIsLoggedIn, isAdmin, catchAsync(admins.dashboard));

router
  .route("/download-assignment/:fileId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDownloadAssignment));

router
  .route("/download-review/:fileId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDownloadHistory));

router
  .route("/download-loa/:fileId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDownloadLetterOfApproval)
  );

router
  .route("/download-history/:fileId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDownloadHistory));

router
  .route("/download-loa-history/:fileId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDownloadLetterOfApprovalHistory)
  );

router
  .route("/setting")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.setting));

router
  .route("/setting/profile")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderEditProfile))
  .put(adminIsLoggedIn, isAdmin, catchAsync(admins.editProfile));

router
  .route("/setting/profile/edit-password")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderEditPassword))
  .put(adminIsLoggedIn, isAdmin, catchAsync(admins.editPassword));
//////////This is Info How Tos Routes
router
  .route("/info-howtos")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.viewInfoHowTos));

router
  .route("/info-howtos/add-howto")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderAddInfoHowTo))
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.array("file"),
    catchAsync(admins.addInfoHowTo)
  );

router
  .route("/info-howtos/:howtoId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderInfoHowTo));

router
  .route("/info-howtos/:howtoId/edit-howto")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderEditInfoHowTo))
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.array("file"),
    catchAsync(admins.editInfoHowTo)
  );

router
  .route("/info-howtos/:howtoId/delete-howto")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDeleteInfoHowTo))
  .delete(adminIsLoggedIn, isAdmin, catchAsync(admins.deleteInfoHowTo));
//////////This is Info How Tos Routes

//////////This is Info Faqs Routes
router
  .route("/info-faqs")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.viewInfoFaqs));

router
  .route("/info-faqs/add-faq")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderAddInfoFaqs))
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.array("file"),
    catchAsync(admins.addInfoFaq)
  );

router
  .route("/info-faqs/:faqId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderInfoFaq));

router
  .route("/info-faqs/:faqId/edit-faq")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderEditInfoFaq))
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.array("file"),
    catchAsync(admins.editInfoFaq)
  );

router
  .route("/info-faqs/:faqId/delete-faq")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDeleteInfoFaq))
  .delete(adminIsLoggedIn, isAdmin, catchAsync(admins.deleteInfoFaq));
//////////This is Info Faqs Routes

//////////This is User Students Routes
router
  .route("/user-students")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.viewUserStudents));

router
  .route("/user-students/add-student")
  .get(adminIsLoggedIn, isAdmin, admins.renderAddUserStudent)
  .post(adminIsLoggedIn, isAdmin, catchAsync(admins.addUserStudent));

router
  .route("/user-students/unassigned-students")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentsUnassigned)
  );

router
  .route("/user-students/accepted-students")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentsAccepted)
  );

router
  .route("/user-students/:studentId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderUserStudent));

router
  .route("/user-students/:studentId/edit-student")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderEditUserStudentProfile)
  )
  .put(adminIsLoggedIn, isAdmin, catchAsync(admins.editUserStudentProfile));

router
  .route("/user-students/:studentId/delete-student")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDeleteUserStudent))
  .delete(adminIsLoggedIn, isAdmin, catchAsync(admins.deleteUserStudent));

router
  .route("/user-students/:studentId/add-lecturer")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderAddUserStudentLecturer)
  )
  .post(adminIsLoggedIn, isAdmin, catchAsync(admins.addUserStudentLecturer));

router
  .route("/user-students/:studentId/lecturer/:lecturerId/delete-lecturer")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDeleteUserStudentLecturer)
  )
  .delete(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.deleteUserStudentLecturer)
  );

router
  .route("/user-students/:studentId/assignment")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderAddUserStudentAssignment)
  )
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.single("content"),
    catchAsync(admins.addUserStudentAssignment)
  );

router
  .route("/user-students/:studentId/assignment/:assignmentId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentAssignmentDetail)
  );

router
  .route("/user-students/:studentId/assignment/:assignmentId/accept-assignment")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderAcceptUserStudentAssignment)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.acceptUserStudentAssignment)
  );

router
  .route("/user-students/:studentId/assignment/:assignmentId/edit-assignment")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderEditUserStudentAssignment)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.single("content"),
    catchAsync(admins.editUserStudentAssignment)
  );

router
  .route(
    "/user-students/:studentId/assignment/:assignmentId/override-assignment"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderOverrideUserStudentAssignment)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.overrideUserStudentAssignment)
  );

router
  .route("/user-students/:studentId/assignment/:assignmentId/delete-assignment")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDeleteUserStudentAssignment)
  )
  .delete(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.deleteUserStudentAssignment)
  );

router
  .route("/user-students/:studentId/assignment/:assignmentId/reviews")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderUserStudentReviews));

router
  .route("/user-students/:studentId/assignment/:assignmentId/review")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderAddUserStudentReview))
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.addUserStudentReview)
  );

router
  .route("/user-students/:studentId/assignment/:assignmentId/review/:reviewId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentReviewDetail)
  );

router
  .route(
    "/user-students/:studentId/assignment/:assignmentId/review/:reviewId/edit-review"
  )
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderEditUserStudentReview))
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.editUserStudentReview)
  );

router
  .route(
    "/user-students/:studentId/assignment/:assignmentId/review/:reviewId/delete-review"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDeleteUserStudentReview)
  )
  .delete(adminIsLoggedIn, isAdmin, catchAsync(admins.deleteUserStudentReview));

router
  .route("/user-students/:studentId/assignment/:assignmentId/history")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentAssignmentHistories)
  );

router
  .route(
    "/user-students/:studentId/assignment/:assignmentId/history/:historyId"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentAssignmentHistoryDetail)
  );

router
  .route("/user-students/:studentId/loa")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentAddLetterOfApproval)
  )
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.addUserStudentLetterOfApproval)
  );

router
  .route("/user-students/:studentId/loa/:loaId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentLetterOfApprovalDetail)
  );

router
  .route("/user-students/:studentId/loa/:loaId/sign-loa")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentSignLetterOfApproval)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.signUserStudentLetterOfApproval)
  );

router
  .route("/user-students/:studentId/loa/:loaId/delete-loa")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentDeleteLetterOfApproval)
  )
  .delete(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.deleteUserStudentLetterOfApproval)
  );

router
  .route("/user-students/:studentId/loa/:loaId/history")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentLetterOfApprovalHistories)
  );

router
  .route("/user-students/:studentId/loa/:loaId/history/:historyId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserStudentLetterOfApprovalHistoryDetail)
  );
//////////This is User Students Routes

//////////This is User Lecturers Routes
router
  .route("/user-lecturers")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.viewUserLecturers));

router
  .route("/user-lecturers/add-lecturer")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderAddUserLecturer))
  .post(adminIsLoggedIn, isAdmin, catchAsync(admins.addUserLecturer));

router
  .route("/user-lecturers/:lecturerId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderUserLecturer));

router
  .route("/user-lecturers/:lecturerId/edit-lecturer")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderEditUserLecturerProfile)
  )
  .put(adminIsLoggedIn, isAdmin, catchAsync(admins.editUserLecturerProfile));

router
  .route("/user-lecturers/:lecturerId/delete-lecturer")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDeleteUserLecturer))
  .delete(adminIsLoggedIn, isAdmin, catchAsync(admins.deleteUserLecturer));

router
  .route("/user-lecturers/:lecturerId/add-student")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderAddUserLecturerStudent)
  )
  .post(adminIsLoggedIn, isAdmin, catchAsync(admins.addUserLecturerStudent));

router
  .route("/user-lecturers/:lecturerId/student/:studentId/delete-student")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDeleteUserLecturerStudent)
  )
  .delete(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.deleteUserLecturerStudent)
  );

router
  .route("/user-lecturers/:lecturerId/assignment")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderAddUserLecturerAssignment)
  )
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.single("content"),
    catchAsync(admins.addUserLecturerAssignment)
  );

router
  .route("/user-lecturers/:lecturerId/assignment/:assignmentId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerAssignmentDetail)
  );

router
  .route(
    "/user-lecturers/:lecturerId/assignment/:assignmentId/accept-assignment"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderAcceptUserLecturerAssignment)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.acceptUserLecturerAssignment)
  );

router
  .route("/user-lecturers/:lecturerId/assignment/:assignmentId/edit-assignment")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderEditUserLecturerAssignment)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.single("content"),
    catchAsync(admins.editUserLecturerAssignment)
  );

router
  .route(
    "/user-lecturers/:lecturerId/assignment/:assignmentId/override-assignment"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderOverrideUserLecturerAssignment)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.overrideUserLecturerAssignment)
  );

router
  .route(
    "/user-lecturers/:lecturerId/assignment/:assignmentId/delete-assignment"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDeleteUserLecturerAssignment)
  )
  .delete(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.deleteUserLecturerAssignment)
  );

router
  .route("/user-lecturers/:lecturerId/assignment/:assignmentId/reviews")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderUserLecturerReviews));

router
  .route("/user-lecturers/:lecturerId/assignment/:assignmentId/review")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderAddUserLecturerReview))
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.addUserLecturerReview)
  );

router
  .route(
    "/user-lecturers/:lecturerId/assignment/:assignmentId/review/:reviewId"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerReviewDetail)
  );

router
  .route(
    "/user-lecturers/:lecturerId/assignment/:assignmentId/review/:reviewId/edit-review"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderEditUserLecturerReview)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.editUserLecturerReview)
  );

router
  .route(
    "/user-lecturers/:lecturerId/assignment/:assignmentId/review/:reviewId/delete-review"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderDeleteUserLecturerReview)
  )
  .delete(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.deleteUserLecturerReview)
  );

router
  .route("/user-lecturers/:lecturerId/assignment/:assignmentId/history")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerAssignmentHistories)
  );

router
  .route(
    "/user-lecturers/:lecturerId/assignment/:assignmentId/history/:historyId"
  )
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerAssignmentHistoryDetail)
  );

router
  .route("/user-lecturers/:lecturerId/loa")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerAddLetterOfApproval)
  )
  .post(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.addUserLecturerLetterOfApproval)
  );

router
  .route("/user-lecturers/:lecturerId/loa/:loaId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerLetterOfApprovalDetail)
  );

router
  .route("/user-lecturers/:lecturerId/loa/:loaId/sign-loa")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerSignLetterOfApproval)
  )
  .put(
    adminIsLoggedIn,
    isAdmin,
    upload.single("file"),
    catchAsync(admins.signUserLecturerLetterOfApproval)
  );

router
  .route("/user-lecturers/:lecturerId/loa/:loaId/delete-loa")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerDeleteLetterOfApproval)
  )
  .delete(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.deleteUserLecturerLetterOfApproval)
  );

router
  .route("/user-lecturers/:lecturerId/loa/:loaId/history")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerLetterOfApprovalHistories)
  );

router
  .route("/user-lecturers/:lecturerId/loa/:loaId/history/:historyId")
  .get(
    adminIsLoggedIn,
    isAdmin,
    catchAsync(admins.renderUserLecturerLetterOfApprovalHistoryDetail)
  );
//////////This is User Lecturers Routes

//////////This is User Admins Routes
router
  .route("/user-admins")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.viewUserAdmins));

router
  .route("/user-admins/add-admin")
  .get(adminIsLoggedIn, isAdmin, admins.renderAddUserAdmin)
  .post(adminIsLoggedIn, isAdmin, catchAsync(admins.addUserAdmin));

router
  .route("/user-admins/:adminId/delete-admin")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderDeleteUserAdmin))
  .delete(adminIsLoggedIn, isAdmin, catchAsync(admins.deleteUserAdmin));

router
  .route("/user-admins/:adminId")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderUserAdmin));

router
  .route("/user-admins/:adminId/edit-admin")
  .get(adminIsLoggedIn, isAdmin, catchAsync(admins.renderEditUserAdminProfile))
  .put(adminIsLoggedIn, isAdmin, catchAsync(admins.editUserAdminProfile));
//////////This is User Admins Routes

module.exports = router;
