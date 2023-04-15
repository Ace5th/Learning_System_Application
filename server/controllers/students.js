const Student = require("../../models/student.js");
const Lecturer = require("../../models/lecturer.js");
const Assignment = require("../../models/assignment.js");
const Review = require("../../models/review.js");
const LetterOfApproval = require("../../models/letterOfApproval.js");
const History = require("../../models/history.js");
const LetterOfApprovalHistory = require("../../models/letterOfApprovalHistory.js");

const {
  historyCreationAssignment,
  historyCreationLetterOfApproval,
} = require("../../utilities/historyCreation.js");

module.exports.dashboard = async (req, res) => {
  const student = await Student.findById(req.user._id)
    .populate({
      path: "assignments",
      populate: { path: "histories" },
    })
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate("letterOfApproval");
  res.render("students/dashboard", { student });
};

module.exports.renderDownloadAssignment = async (req, res) => {
  const { fileId } = req.params;
  const assignment = await Assignment.findById(fileId);
  const downloadUrl = assignment.content.url;
  res.render("students/download", { downloadUrl });
};

module.exports.renderDownloadReview = async (req, res) => {
  const { fileId } = req.params;
  const review = await Review.findById(fileId);
  const downloadUrl = review.file.url;
  res.render("students/download", { downloadUrl });
};

module.exports.renderDownloadLetterOfApproval = async (req, res) => {
  const { fileId } = req.params;
  const letterOfApproval = await LetterOfApproval.findById(fileId);
  const downloadUrl = letterOfApproval.file.url;
  res.render("students/download", { downloadUrl });
};

module.exports.renderDownloadHistory = async (req, res) => {
  const { fileId } = req.params;
  const history = await History.findById(fileId);
  const downloadUrl = history.content.url;
  res.render("students/download", { downloadUrl });
};

module.exports.renderDownloadLetterOfApprovalHistory = async (req, res) => {
  const { fileId } = req.params;
  const letterOfApprovalHistory = await LetterOfApprovalHistory.findById(
    fileId
  );
  const downloadUrl = letterOfApprovalHistory.file.url;
  res.render("students/download", { downloadUrl });
};

module.exports.setting = async (req, res) => {
  const student = await Student.findById(req.user._id);
  res.render("students/setting", { student });
};

module.exports.renderEditProfile = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const departments = ["Accounting", "Economics", "Management"];
  res.render("students/settingEditProfile", { student, departments });
};

module.exports.editProfile = async (req, res) => {
  const { username, name, email, phoneNumber, department } = req.body.student;
  const student = await Student.findById(req.user._id);
  // const updatedStudent = await Student.findOneAndUpdate(req.params.studentId, {
  //   $set: { username, name, email, department, phoneNumber },
  // });
  student.username = username;
  student.name = name;
  student.email = email;
  student.phoneNumber = phoneNumber;
  student.department = department;
  await student.save();
  req.flash("success", "Successfully edited your profile");
  res.redirect("/student");
};

module.exports.renderEditPassword = async (req, res) => {
  const student = await Student.findById(req.user._id);
  res.render("students/settingChangePassword", { student });
};

module.exports.editPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body.student;
  const student = await Student.findById(req.user._id);
  const updatedPassword = await student.changePassword(
    oldPassword,
    newPassword
  );
  req.flash("success", "Successfully changed your password");
  res.redirect("/student");
};

module.exports.renderSelectPhase = async (req, res) => {
  const student = await Student.findById(req.user._id);
  res.render("students/assignmentPhaseSelect", {
    student,
  });
};

module.exports.renderAddAssignmentPhase1 = async (req, res) => {
  const student = await Student.findById(req.user._id);
  res.render("students/assignmentAddPhase1", {
    student,
  });
};

module.exports.addAssignmentPhase1 = async (req, res) => {
  const { originalname, path: url, filename } = req.file;
  const student = await Student.findById(req.user._id);
  const assignment = new Assignment(req.body.assignment);
  assignment.phase = "Phase 1";
  assignment.status = "Under Review by Lecturers";
  assignment.author = student;
  assignment.content = { originalname, url, filename };
  assignment.time.createdOn = Date.now();
  assignment.time.updatedOn = Date.now();
  assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
  assignment.statusOfFirstLecturer.code = "Pending";
  assignment.statusOfFirstLecturer.lecturer = student.firstLecturer;
  assignment.statusOfSecondLecturer.code = "Pending";
  assignment.statusOfSecondLecturer.lecturer = student.secondLecturer;
  const history = await historyCreationAssignment(
    assignment,
    "Student has created an assignment (phase 1)"
  );
  assignment.histories.push(history);
  student.assignments.push(assignment);
  await assignment.save();
  await student.save();
  req.flash("success", "Successfully added an assignment");
  res.redirect(`/student/assignment/${assignment._id}`);
};

module.exports.renderAddAssignmentPhase2 = async (req, res) => {
  const student = await Student.findById(req.user._id);
  res.render("students/assignmentAddPhase2", {
    student,
  });
};

module.exports.addAssignmentPhase2 = async (req, res) => {
  const { originalname, path: url, filename } = req.file;
  const student = await Student.findById(req.user._id);
  const assignment = new Assignment(req.body.assignment);
  assignment.phase = "Phase 2";
  assignment.status = "Under Review by Lecturers";
  assignment.author = student;
  assignment.content = { originalname, url, filename };
  assignment.time.createdOn = Date.now();
  assignment.time.updatedOn = Date.now();
  assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
  assignment.statusOfFirstLecturer.code = "Pending";
  assignment.statusOfFirstLecturer.lecturer = student.firstLecturer;
  assignment.statusOfSecondLecturer.code = "Pending";
  assignment.statusOfSecondLecturer.lecturer = student.secondLecturer;
  const history = await historyCreationAssignment(
    assignment,
    "Student has created an assignment (phase 2)"
  );
  assignment.histories.push(history);
  student.assignments.push(assignment);
  await assignment.save();
  await student.save();
  req.flash("success", "Successfully added an assignment");
  res.redirect(`/student/assignment/${assignment._id}`);
};

module.exports.renderAssignmentDetail = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const assignment = await Assignment.findById(req.params.assignmentId);
  res.render("students/assignmentRenderDetail", {
    student,
    assignment,
  });
};

module.exports.renderEditAssignment = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const assignment = await Assignment.findById(req.params.assignmentId);
  res.render("students/assignmentEdit", { student, assignment });
};

module.exports.editAssignment = async (req, res) => {
  const { originalname, path: url, filename } = req.file;
  const assignment = await Assignment.findById(req.params.assignmentId);
  const { title } = req.body.assignment;
  assignment.status = "Under Review by Lecturers";
  assignment.statusOfFirstLecturer.code = "Pending";
  assignment.statusOfSecondLecturer.code = "Pending";
  assignment.title = title;
  assignment.override = false;
  assignment.time.updatedOn = Date.now();
  assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
  assignment.content = { originalname, url, filename };
  const history = await historyCreationAssignment(
    assignment,
    "Student has edited the assignment"
  );
  assignment.histories.push(history);
  await assignment.save();
  req.flash("success", "Successfully edited your assignment");
  res.redirect(`/student/assignment/${assignment._id}`);
};

module.exports.renderDeleteAssignment = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const assignment = await Assignment.findById(req.params.assignmentId);
  res.render("students/assignmentDelete", { student, assignment });
};

module.exports.deleteAssignment = async (req, res) => {
  const deleteStudentRef = await Student.findByIdAndUpdate(req.user._id, {
    $pull: { assignments: req.params.assignmentId },
  });
  const deleteAssignment = await Assignment.findByIdAndDelete(
    req.params.assignmentId
  );
  req.flash("success", "Successfully deleted your assignment");
  res.redirect("/student");
};

module.exports.renderAssignmentReviews = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const assignment = await Assignment.findById(
    req.params.assignmentId
  ).populate({ path: "reviews", populate: { path: "author" } });
  res.render("students/reviews", {
    student,
    assignment,
  });
};

module.exports.renderAssignmentReviewDetail = async (req, res) => {
  const { assignmentId, reviewId } = req.params;
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId).populate("author");
  res.render("students/reviewRenderDetail", {
    assignment,
    review,
  });
};

module.exports.renderAssignmentHistories = async (req, res) => {
  const student = await Student.findById(req.user._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(
    req.params.assignmentId
  ).populate("histories");
  res.render("students/histories", {
    student,
    assignment,
  });
};

module.exports.renderAssignmentHistoryDetail = async (req, res) => {
  const { assignmentId, historyId } = req.params;
  const student = await Student.findById(req.user._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(assignmentId);
  const history = await History.findById(historyId);
  res.render("students/historyRenderDetail", {
    student,
    assignment,
    history,
  });
};

module.exports.renderAddLetterOfApproval = async (req, res) => {
  const student = await Student.findById(req.user._id);
  res.render("students/letterOfApprovalAdd", { student });
};

module.exports.addLetterOfApproval = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const letterOfApproval = new LetterOfApproval();
  const { originalname, path: url, filename } = req.file;
  letterOfApproval.file = { originalname, url, filename };
  letterOfApproval.time.createdOn = Date.now();
  letterOfApproval.time.updatedOn = Date.now();
  letterOfApproval.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
  letterOfApproval.author = student;
  letterOfApproval.status = "Waiting for Approval";
  letterOfApproval.statusOfFirstLecturer.code = "Pending";
  letterOfApproval.statusOfFirstLecturer.lecturer = student.firstLecturer;
  letterOfApproval.statusOfSecondLecturer.code = "Pending";
  letterOfApproval.statusOfSecondLecturer.lecturer = student.secondLecturer;
  const letterOfApprovalHistory = await historyCreationLetterOfApproval(
    letterOfApproval,
    "Student has sent a Letter of Approval"
  );
  letterOfApproval.histories.push(letterOfApprovalHistory);
  student.letterOfApproval = letterOfApproval;
  await student.save();
  await letterOfApproval.save();
  req.flash("success", "Successfully sent your Letter of Approval");
  res.redirect(`/student/loa/${letterOfApproval._id}`);
};

module.exports.renderLetterOfApprovalDetail = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const letterOfApproval = await LetterOfApproval.findById(req.params.loaId);
  res.render("students/letterOfApprovalRenderDetail", {
    student,
    letterOfApproval,
  });
};

module.exports.renderDeleteLetterOfApproval = async (req, res) => {
  const student = await Student.findById(req.user._id);
  const letterOfApproval = await LetterOfApproval.findById(req.params.loaId);
  res.render("students/letterOfApprovalDelete", { student, letterOfApproval });
};

module.exports.deleteLetterOfApproval = async (req, res) => {
  const deleteStudentRef = await Student.findByIdAndUpdate(req.user._id, {
    $unset: { letterOfApproval: 1 },
  });
  const deleteLetterOfApproval = await LetterOfApproval.findByIdAndDelete(
    req.params.loaId
  );
  req.flash("success", "Successfully deleted your Letter of Approval");
  res.redirect("/student");
};

module.exports.renderLetterOfApprovalHistories = async (req, res) => {
  const student = await Student.findById(req.user._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(
    req.params.loaId
  ).populate("histories");
  res.render("students/letterOfApprovalhistories", {
    student,
    letterOfApproval,
  });
};

module.exports.renderLetterOfApprovalHistoryDetail = async (req, res) => {
  const { loaId, historyId } = req.params;
  const student = await Student.findById(req.user._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId);
  const letterOfApprovalHistory = await LetterOfApprovalHistory.findById(
    historyId
  );
  res.render("students/letterOfApprovalHistoryRenderDetail", {
    student,
    letterOfApproval,
    letterOfApprovalHistory,
  });
};
