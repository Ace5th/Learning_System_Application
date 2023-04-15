const Student = require("../../models/student.js");
const Lecturer = require("../../models/lecturer.js");
const Assignment = require("../../models/assignment.js");
const Review = require("../../models/review.js");
const LetterOfApproval = require("../../models/letterOfApproval.js");
const History = require("../../models/history.js");
const LetterOfApprovalHistory = require("../../models/letterOfApprovalHistory.js");
const { Question, Instruction } = require("../../models/info.js");

const {
  historyCreationReview,
  historyCreationLetterOfApproval,
} = require("../../utilities/historyCreation.js");
const sendEmail = require("../../utilities/sendEmail.js");

const reviewTitles = [
  "Chapter 1",
  "Chapter 2",
  "Chapter 3",
  "Chapter 4",
  "Chapter 5",
];

module.exports.dashboard = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id).populate({
    path: "students",
    populate: {
      path: "letterOfApproval",
      populate: [
        { path: "statusOfFirstLecturer" },
        { path: "statusOfSecondLecturer" },
      ],
    },
  });
  const assignments = await Assignment.find({
    author: { $in: lecturer.students },
  })
    .populate("reviews")
    .populate("author")
    .populate("histories")
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    });
  const lettersOfApproval = await LetterOfApproval.find({
    author: { $in: lecturer.students },
  })
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    });
  let totalAssignments = 0;
  let pendingAssignments = 0;
  let reviewedAssignments = 0;
  let acceptedAssignments = 0;
  let pendingLettersOfApproval = 0;
  let acceptedLettersOfApproval = 0;
  for (let student of lecturer.students) {
    totalAssignments += student.assignments.length;
  }
  for (let assignment of assignments) {
    if (
      (assignment.statusOfFirstLecturer &&
        assignment.statusOfFirstLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        assignment.statusOfFirstLecturer.code == "Pending") ||
      (assignment.statusOfSecondLecturer &&
        assignment.statusOfSecondLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        assignment.statusOfSecondLecturer.code == "Pending")
    ) {
      pendingAssignments += 1;
    }
    if (assignment.status == "Under Editing by Student") {
      reviewedAssignments += 1;
    }
    if (
      (assignment.statusOfFirstLecturer &&
        assignment.statusOfFirstLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        assignment.statusOfFirstLecturer.code == "Accepted") ||
      (assignment.statusOfSecondLecturer &&
        assignment.statusOfSecondLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        assignment.statusOfSecondLecturer.code == "Accepted")
    ) {
      acceptedAssignments += 1;
    }
  }
  for (let letterOfApproval of lettersOfApproval) {
    if (
      (letterOfApproval.statusOfFirstLecturer &&
        letterOfApproval.statusOfFirstLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        letterOfApproval.statusOfFirstLecturer.code == "Pending") ||
      (letterOfApproval.statusOfSecondLecturer &&
        letterOfApproval.statusOfSecondLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        letterOfApproval.statusOfSecondLecturer.code == "Pending")
    ) {
      pendingLettersOfApproval += 1;
    }
    if (
      (letterOfApproval.statusOfFirstLecturer &&
        letterOfApproval.statusOfFirstLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        letterOfApproval.statusOfFirstLecturer.code == "Approved") ||
      (letterOfApproval.statusOfSecondLecturer &&
        letterOfApproval.statusOfSecondLecturer.lecturer._id.toHexString() ==
          lecturer._id.toHexString() &&
        letterOfApproval.statusOfSecondLecturer.code == "Approved")
    ) {
      acceptedLettersOfApproval += 1;
    }
  }
  res.render("lecturers/dashboard", {
    lecturer,
    assignments,
    totalAssignments,
    pendingAssignments,
    reviewedAssignments,
    acceptedAssignments,
    pendingLettersOfApproval,
    acceptedLettersOfApproval,
  });
};

module.exports.howTo = async (req, res) => {
  const howtos = await Instruction.find({ audience: "Lecturer" });
  res.render("lecturers/howTo", { howtos });
};

module.exports.faqs = async (req, res) => {
  const faqs = await Question.find({ audience: "Lecturer" });
  res.render("lecturers/faqs", { faqs });
};

module.exports.renderDownloadAssignment = async (req, res) => {
  const { fileId } = req.params;
  const assignment = await Assignment.findById(fileId);
  const downloadUrl = assignment.content.url;
  res.render("lecturers/download", { downloadUrl });
};

module.exports.renderDownloadReview = async (req, res) => {
  const { fileId } = req.params;
  const review = await Review.findById(fileId);
  const downloadUrl = review.file.url;
  res.render("lecturers/download", { downloadUrl });
};

module.exports.renderDownloadLetterOfApproval = async (req, res) => {
  const { fileId } = req.params;
  const letterOfApproval = await LetterOfApproval.findById(fileId);
  const downloadUrl = letterOfApproval.file.url;
  res.render("lecturers/download", { downloadUrl });
};

module.exports.renderDownloadHistory = async (req, res) => {
  const { fileId } = req.params;
  const history = await History.findById(fileId);
  const downloadUrl = history.content.url;
  res.render("lecturers/download", { downloadUrl });
};

module.exports.renderDownloadLetterOfApprovalHistory = async (req, res) => {
  const { fileId } = req.params;
  const letterOfApprovalHistory = await LetterOfApprovalHistory.findById(
    fileId
  );
  const downloadUrl = letterOfApprovalHistory.file.url;
  res.render("lecturers/download", { downloadUrl });
};

module.exports.setting = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id);
  res.render("lecturers/setting", { lecturer });
};

module.exports.renderEditProfile = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id);
  const departments = ["Accounting", "Economics", "Management"];
  res.render("lecturers/settingEditProfile", { lecturer, departments });
};

module.exports.editProfile = async (req, res) => {
  const { username, name, email, department } = req.body.lecturer;
  const lecturer = await Lecturer.findById(req.user._id);
  // const updatedLecturer = await Lecturer.findOneAndUpdate(
  //   req.params.lecturerId,
  //   {
  //     $set: { username, name, email, department },
  //   }
  // );
  lecturer.username = username;
  lecturer.name = name;
  lecturer.email = email;
  lecturer.department = department;
  await lecturer.save();
  req.flash("success", "Successfully edited your profile");
  res.redirect("/lecturer");
};

module.exports.renderEditPassword = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id);
  res.render("lecturers/settingChangePassword", { lecturer });
};

module.exports.editPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body.lecturer;
  const lecturer = await Lecturer.findById(req.user._id);
  const updatedPassword = await lecturer.changePassword(
    oldPassword,
    newPassword
  );
  req.flash("success", "Successfully changed your password");
  res.redirect("/lecturer");
};

module.exports.renderInbox = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id).populate("students");
  const assignments = await Assignment.find({
    author: { $in: lecturer.students },
  })
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "author",
      populate: [{ path: "firstLecturer" }, { path: "secondLecturer" }],
    })
    .populate("reviews");
  let pendingAssignmentsMe = [];
  let pendingAssignmentsOthers = [];
  let reviewedAssignments = [];
  for (let assignment of assignments) {
    if (assignment.status == "Under Review by Lecturers") {
      if (
        (assignment.statusOfFirstLecturer &&
          assignment.statusOfFirstLecturer.lecturer._id.toHexString() ==
            lecturer._id.toHexString() &&
          assignment.statusOfFirstLecturer.code == "Pending") ||
        (assignment.statusOfSecondLecturer &&
          assignment.statusOfSecondLecturer.lecturer._id.toHexString() ==
            lecturer._id.toHexString() &&
          assignment.statusOfSecondLecturer.code == "Pending")
      ) {
        pendingAssignmentsMe.push(assignment);
      } else {
        pendingAssignmentsOthers.push(assignment);
      }
    } else if (assignment.status == "Under Editing by Student") {
      reviewedAssignments.push(assignment);
    }
  }
  res.render("lecturers/inbox", {
    lecturer,
    assignments,
    pendingAssignmentsMe,
    pendingAssignmentsOthers,
    reviewedAssignments,
  });
};

module.exports.renderInboxAssignmentDetail = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId).populate("author");
  res.render("lecturers/inboxAssignmentRenderDetail", {
    student,
    assignment,
    review,
  });
};

module.exports.renderInboxAssignmentReviews = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const lecturer = await Lecturer.findById(req.user._id);
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId).populate({
    path: "reviews",
    populate: { path: "author" },
  });
  res.render("lecturers/inboxReviews", {
    lecturer,
    student,
    assignment,
  });
};

module.exports.renderInboxAssignmentReviewDetail = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId)
    .populate("data")
    .populate("author");
  res.render("lecturers/reviewRenderDetail", {
    student,
    assignment,
    review,
  });
};

module.exports.renderInboxAssignmentHistories = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(assignmentId).populate(
    "histories"
  );
  res.render("lecturers/inboxHistories", {
    student,
    assignment,
  });
};

module.exports.renderStudents = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id);
  const students = await Student.find({ _id: { $in: lecturer.students } })
    .populate("assignments")
    .populate("firstLecturer")
    .populate("secondLecturer");
  res.render("lecturers/students", { students });
};

module.exports.renderStudentDetail = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id);
  const student = await Student.findById(req.params.studentId)
    .populate({
      path: "assignments",
      populate: {
        path: "statusOfFirstLecturer",
        populate: { path: "lecturer" },
      },
      populate: {
        path: "statusOfSecondLecturer",
        populate: { path: "lecturer" },
      },
    })
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate({
      path: "letterOfApproval",
      populate: {
        path: "statusOfFirstLecturer",
        populate: { path: "lecturer" },
      },
      populate: {
        path: "statusOfSecondLecturer",
        populate: { path: "lecturer" },
      },
    });
  res.render("lecturers/studentDetail", { lecturer, student });
};

module.exports.renderAssignmentDetail = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  res.render("lecturers/assignmentRenderDetail", {
    student,
    assignment,
  });
};

module.exports.renderAcceptAssignment = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  res.render("lecturers/assignmentAccept", {
    student,
    assignment,
  });
};

module.exports.acceptAssignment = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId)
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    })
    .populate("author");
  const lecturer = await Lecturer.findById(req.user._id);
  if (
    assignment.statusOfFirstLecturer &&
    assignment.statusOfFirstLecturer.lecturer._id.toHexString() ==
      lecturer._id.toHexString()
  ) {
    assignment.statusOfFirstLecturer.code = "Accepted";
  } else if (
    assignment.statusOfSecondLecturer &&
    assignment.statusOfSecondLecturer.lecturer._id.toHexString() ==
      lecturer._id.toHexString()
  ) {
    assignment.statusOfSecondLecturer.code = "Accepted";
  }
  assignment.status = assignment.realStatus;
  assignment.time.updatedOn = Date.now();
  if (assignment.status == "Under Editing by Student") {
    assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 3;
  } else if (assignment.status == "Accepted") {
    assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 4 * 12;
  }
  const history = await historyCreationAssignment(
    assignment,
    `Lecturer (${lecturer.username} | ${lecturer.name}) has accepted the assignment`
  );
  assignment.histories.push(history);
  await assignment.save();
  res.redirect(`/lecturer/student/${student._id}`);
};

module.exports.renderAssignmentReviews = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const lecturer = await Lecturer.findById(req.user._id);
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId).populate({
    path: "reviews",
    populate: { path: "author" },
  });
  res.render("lecturers/reviews", {
    lecturer,
    student,
    assignment,
  });
};

module.exports.renderAddAssignmentReview = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  res.render("lecturers/assignmentReviewAdd", {
    student,
    assignment,
    reviewTitles,
  });
};

module.exports.addAssignmentReview = async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId)
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    })
    .populate("author");
  const lecturer = await Lecturer.findById(req.user._id);
  const review = new Review();
  if (assignment.phase == "Phase 1") {
    for (let i = 0; i < 3; i++) {
      const title = req.body.review.title[i];
      const content = req.body.review.content[i];
      const data = { title, content };
      review.data.push(data);
    }
    if (req.file) {
      const { originalname, path: url, filename } = req.file;
      const file = { originalname, url, filename };
      review.file = file;
    }
    review.createdOn = new Date();
    review.author = lecturer;
    assignment.reviews.push(review);
    await review.save();
  } else if (assignment.phase == "Phase 2 ") {
    for (let i = 0; i < 5; i++) {
      const title = req.body.review.title[i];
      const content = req.body.review.content[i];
      const data = { title, content };
      review.data.push(data);
    }
    if (req.file) {
      const { originalname, path: url, filename } = req.file;
      const file = { originalname, url, filename };
      review.file = file;
    }
    review.createdOn = new Date();
    review.author = lecturer;
    assignment.reviews.push(review);
    await review.save();
  }
  if (
    assignment.statusOfFirstLecturer &&
    assignment.statusOfFirstLecturer.lecturer._id.toHexString() ==
      lecturer._id.toHexString()
  ) {
    assignment.statusOfFirstLecturer.code = "Reviewed";
  } else if (
    assignment.statusOfSecondLecturer &&
    assignment.statusOfSecondLecturer.lecturer._id.toHexString() ==
      lecturer._id.toHexString()
  ) {
    assignment.statusOfSecondLecturer.code = "Reviewed";
  }
  assignment.status = assignment.realStatus;
  assignment.time.updatedOn = Date.now();
  if (assignment.status == "Under Editing by Student") {
    assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 3;
  }
  if (assignment.phase == "Phase 1") {
    const history = await historyCreationReview(
      assignment,
      review,
      `Lecturer (${lecturer.username} | ${lecturer.name}) has sent a review`
    );
    assignment.histories.push(history);
  } else if (assignment.phase == "Phase 2") {
    const history = await historyCreationReview(
      assignment,
      review,
      `Lecturer (${lecturer.username} | ${lecturer.name}) has sent a review`
    );
    assignment.histories.push(history);
  }
  await assignment.save();
  req.flash("success", "Successfully sent a review");
  res.redirect(
    `/lecturer/student/${assignment.author._id}/assignment/${assignment._id}/reviews`
  );
};

module.exports.renderAssignmentReviewDetail = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId)
    .populate("data")
    .populate("author");
  res.render("lecturers/reviewRenderDetail", {
    student,
    assignment,
    review,
  });
};

module.exports.renderEditAssignmentReview = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId).populate("data");
  res.render("lecturers/assignmentReviewEdit", {
    student,
    assignment,
    review,
  });
};

module.exports.editAssignmentReview = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id);
  const assignment = await Assignment.findById(req.params.assignmentId);
  const review = await Review.findById(req.params.reviewId);
  if (review.data.length == 1) {
    const title = req.body.review.title;
    const content = req.body.review.content;
    const data = { title, content };
    review.data = data;
  } else if (review.data.length > 1) {
    for (let i = 0; i < review.data.length; i++) {
      const title = req.body.review.title[i];
      const content = req.body.review.content[i];
      const data = { title, content };
      review.data[i] = data;
    }
  }
  if (req.file) {
    const { originalname, path: url, filename } = req.file;
    const file = { originalname, url, filename };
    review.file = file;
  }
  const history = await historyCreationReview(
    assignment,
    review,
    `Lecturer (${lecturer.username} | ${lecturer.name}) has edited a review`
  );
  assignment.time.updatedOn = Date.now();
  assignment.histories.push(history);
  await review.save();
  await assignment.save();
  req.flash("success", "Successfully edited the review");
  res.redirect(
    `/lecturer/student/${assignment.author._id}/assignment/${assignment._id}/review/${review._id}`
  );
};

module.exports.renderAssignmentHistories = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(assignmentId).populate(
    "histories"
  );
  res.render("lecturers/histories", {
    student,
    assignment,
  });
};

module.exports.renderAssignmentHistoryDetail = async (req, res) => {
  const { studentId, assignmentId, historyId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(assignmentId);
  const history = await History.findById(historyId);
  res.render("lecturers/historyRenderDetail", {
    student,
    assignment,
    history,
  });
};

module.exports.renderInboxLettersOfApproval = async (req, res) => {
  const lecturer = await Lecturer.findById(req.user._id).populate("students");
  const lettersOfApproval = await LetterOfApproval.find({
    author: { $in: lecturer.students },
  })
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "author",
      populate: [{ path: "firstLecturer" }, { path: "secondLecturer" }],
    });
  let pendingLettersOfApprovalMe = [];
  let pendingLettersOfApprovalOthers = [];
  for (let letterOfApproval of lettersOfApproval) {
    if (letterOfApproval.status == "Waiting for Approval") {
      if (
        (letterOfApproval.statusOfFirstLecturer &&
          letterOfApproval.statusOfFirstLecturer.lecturer._id.toHexString() ==
            lecturer._id.toHexString() &&
          letterOfApproval.statusOfFirstLecturer.code == "Pending") ||
        (letterOfApproval.statusOfSecondLecturer &&
          letterOfApproval.statusOfSecondLecturer.lecturer._id.toHexString() ==
            lecturer._id.toHexString() &&
          letterOfApproval.statusOfSecondLecturer.code == "Pending")
      ) {
        pendingLettersOfApprovalMe.push(letterOfApproval);
      } else {
        pendingLettersOfApprovalOthers.push(letterOfApproval);
      }
    }
  }
  res.render("lecturers/inboxLettersOfApproval", {
    lecturer,
    lettersOfApproval,
    pendingLettersOfApprovalMe,
    pendingLettersOfApprovalOthers,
  });
};

module.exports.renderInboxLetterOfApprovalDetail = async (req, res) => {
  const { studentId, loaId } = req.params;
  const lecturer = await Lecturer.findById(req.user._id);
  const student = await Student.findById(studentId);
  const letterOfApproval = await LetterOfApproval.findById(loaId)
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    });
  res.render("lecturers/inboxLetterOfApprovalRenderDetail", {
    lecturer,
    student,
    letterOfApproval,
  });
};

module.exports.renderInboxLetterOfApprovalHistories = async (req, res) => {
  const { studentId, loaId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId).populate(
    "histories"
  );
  res.render("lecturers/inboxLetterOfApprovalHistories", {
    student,
    letterOfApproval,
  });
};

module.exports.renderLetterOfApprovalDetail = async (req, res) => {
  const { studentId, loaId } = req.params;
  const lecturer = await Lecturer.findById(req.user._id);
  const student = await Student.findById(studentId);
  const letterOfApproval = await LetterOfApproval.findById(loaId)
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    });
  res.render("lecturers/letterOfApprovalRenderDetail", {
    lecturer,
    student,
    letterOfApproval,
  });
};

module.exports.renderSignLetterOfApproval = async (req, res) => {
  const { studentId, loaId } = req.params;
  const student = await Student.findById(studentId);
  const letterOfApproval = await LetterOfApproval.findById(loaId);
  res.render("lecturers/letterOfApprovalSign", {
    student,
    letterOfApproval,
  });
};

module.exports.signLetterOfApproval = async (req, res) => {
  const { studentId, loaId } = req.params;
  const lecturer = await Lecturer.findById(req.user._id);
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId);
  const { originalname, path: url, filename } = req.file;
  letterOfApproval.file = { originalname, url, filename };
  if (
    letterOfApproval.statusOfFirstLecturer &&
    letterOfApproval.statusOfFirstLecturer.lecturer._id.toHexString() ==
      lecturer._id.toHexString()
  ) {
    letterOfApproval.statusOfFirstLecturer.code = "Approved";
  } else if (
    letterOfApproval.statusOfSecondLecturer &&
    letterOfApproval.statusOfSecondLecturer.lecturer._id.toHexString() ==
      lecturer._id.toHexString()
  ) {
    letterOfApproval.statusOfSecondLecturer.code = "Approved";
  }
  letterOfApproval.status = letterOfApproval.realStatus;
  letterOfApproval.time.updatedOn = Date.now();
  if (letterOfApproval.status == "Approved") {
    letterOfApproval.time.expiresOn =
      Date.now() + 1000 * 60 * 60 * 24 * 7 * 4 * 12;
    const deleteLecturerRef1 = await Lecturer.findByIdAndUpdate(
      student.firstLecturer._id,
      {
        $pull: { students: student._id },
      }
    );
    const deleteLecturerRef2 = await Lecturer.findByIdAndUpdate(
      student.secondLecturer._id,
      {
        $pull: { students: student._id },
      }
    );
  }
  const history = await historyCreationLetterOfApproval(
    letterOfApproval,
    `Lecturer (${lecturer.username} | ${lecturer.name}) has signed the student's Letter of Approval, and student's data has been removed from the related lecturers`
  );
  letterOfApproval.histories.push(history);
  await letterOfApproval.save();
  req.flash("success", "Successfully signed the student's Letter of Approval");
  res.redirect(`/lecturer/student/${student._id}`);
};

module.exports.renderLetterOfApprovalHistories = async (req, res) => {
  const { studentId, loaId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId).populate(
    "histories"
  );
  res.render("lecturers/letterOfApprovalHistories", {
    student,
    letterOfApproval,
  });
};

module.exports.renderLetterOfApprovalHistoryDetail = async (req, res) => {
  const { studentId, loaId, historyId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId);
  const letterOfApprovalHistory = await LetterOfApprovalHistory.findById(
    historyId
  );
  res.render("lecturers/letterOfApprovalHistoryRenderDetail", {
    student,
    letterOfApproval,
    letterOfApprovalHistory,
  });
};
