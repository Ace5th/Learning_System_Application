const Student = require("../../models/student.js");
const Lecturer = require("../../models/lecturer.js");
const Admin = require("../../models/admin.js");
const Assignment = require("../../models/assignment.js");
const Review = require("../../models/review.js");
const LetterOfApproval = require("../../models/letterOfApproval.js");
const History = require("../../models/history.js");
const LetterOfApprovalHistory = require("../../models/letterOfApprovalHistory.js");
const { Question, Instruction } = require("../../models/info.js");

const { cloudinary } = require("../../utilities/cloudinary");

const {
  historyCreationAssignment,
  historyCreationReview,
  historyCreationLetterOfApproval,
} = require("../../utilities/historyCreation.js");

const reviewTitles = [
  "Chapter 1",
  "Chapter 2",
  "Chapter 3",
  "Chapter 4",
  "Chapter 5",
];

module.exports.dashboard = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  const studentsReq = await Student.find({}).populate({
    path: "assignments",
    populate: { path: "reviews" },
  });
  const lecturersReq = await Lecturer.find({});
  const adminsReq = await Admin.find({});
  let students = [];
  let lecturers = [];
  let admins = [];
  let unassignedStudents = 0;
  let totalAssignments = 0;
  let pendingAssignments = 0;
  let reviewedAssignments = 0;
  let acceptedAssignments = 0;
  let totalReviews = 0;
  const department = admin.department;
  switch (department) {
    case "Dean Associate":
      for (let student of studentsReq) {
        students.push(student);
      }
      for (let lecturer of lecturersReq) {
        lecturers.push(lecturer);
      }
      for (let admin of adminsReq) {
        admins.push(admin);
      }
      break;
    case "Accounting":
    case "Economics":
    case "Management":
      for (let student of studentsReq) {
        if (student.department == department) {
          students.push(student);
        }
      }
      for (let lecturer of lecturersReq) {
        if (lecturer.department == department) {
          lecturers.push(lecturer);
        }
      }
      for (let admin of adminsReq) {
        if (admin.department == department) {
          admins.push(admin);
        }
      }
      break;
    default:
      break;
  }
  for (let student of students) {
    if (
      (student.firstLecturer == undefined &&
        student.secondLecturer == undefined) ||
      (student.firstLecturer && student.secondLecturer == undefined) ||
      (student.firstLecturer == undefined && student.secondLecturer)
    ) {
      unassignedStudents += 1;
    }
    for (let assignment of student.assignments) {
      if (assignment.status == "Under Review by Lecturers") {
        pendingAssignments += 1;
      } else if (assignment.status == "Under Editing by Student") {
        reviewedAssignments += 1;
      } else if (assignment.status == "Accepted") {
        acceptedAssignments += 1;
      }
      for (let review of assignment.reviews) {
        totalReviews += 1;
      }
    }
  }
  totalAssignments =
    pendingAssignments + reviewedAssignments + acceptedAssignments;
  res.render("admins/dashboard", {
    admin,
    students,
    unassignedStudents,
    lecturers,
    admins,
    totalAssignments,
    pendingAssignments,
    reviewedAssignments,
    acceptedAssignments,
    totalReviews,
  });
};

module.exports.renderDownloadAssignment = async (req, res) => {
  const { fileId } = req.params;
  const assignment = await Assignment.findById(fileId);
  const downloadUrl = assignment.content.url;
  res.render("admins/download", { downloadUrl });
};

module.exports.renderDownloadReview = async (req, res) => {
  const { fileId } = req.params;
  const review = await Review.findById(fileId);
  const downloadUrl = review.file.url;
  res.render("admins/download", { downloadUrl });
};

module.exports.renderDownloadLetterOfApproval = async (req, res) => {
  const { fileId } = req.params;
  const letterOfApproval = await LetterOfApproval.findById(fileId);
  const downloadUrl = letterOfApproval.file.url;
  res.render("admins/download", { downloadUrl });
};

module.exports.renderDownloadHistory = async (req, res) => {
  const { fileId } = req.params;
  const history = await History.findById(fileId);
  const downloadUrl = history.content.url;
  res.render("admins/download", { downloadUrl });
};

module.exports.renderDownloadLetterOfApprovalHistory = async (req, res) => {
  const { fileId } = req.params;
  const letterOfApprovalHistory = await LetterOfApprovalHistory.findById(
    fileId
  );
  const downloadUrl = letterOfApprovalHistory.file.url;
  res.render("admins/download", { downloadUrl });
};

module.exports.setting = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  res.render("admins/setting", { admin });
};

module.exports.renderEditProfile = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  let departments = [];
  const department = admin.department;
  switch (department) {
    case "Dean Associate":
      const toBeInserted = [
        "Dean Associate",
        "Accounting",
        "Economics",
        "Management",
      ];
      departments.push(...toBeInserted);
      break;
    case "Accounting":
    case "Economics":
    case "Management":
      departments.push(department);
      break;
    default:
      break;
  }
  res.render("admins/settingEditProfile", { admin, departments });
};

module.exports.editProfile = async (req, res) => {
  const { username, name, department, email } = req.body.admin;
  const admin = await Admin.findById(req.user._id);
  // const updatedAdmin = await Admin.findOneAndUpdate(req.user._id, {
  //   $set: { username, name, department, email },
  // });
  admin.username = username;
  admin.name = name;
  admin.department = department;
  admin.email = email;
  await admin.save();
  req.flash("success", "Successfully edited your profile");
  res.redirect("/admin");
};

module.exports.renderEditPassword = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  res.render("admins/settingChangePassword", { admin });
};

module.exports.editPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body.admin;
  const admin = await Admin.findById(req.user._id);
  const updatedPassword = await admin.changePassword(oldPassword, newPassword);
  req.flash("success", "Successfully changed your password");
  res.redirect("/admin");
};

//////////This is Info How Tos Routes
module.exports.viewInfoHowTos = async (req, res) => {
  const howtos = await Instruction.find({});
  res.render("admins/infoHowTosDashboard", { howtos });
};

module.exports.renderAddInfoHowTo = (req, res) => {
  res.render("admins/infoHowToAdd");
};

module.exports.addInfoHowTo = async (req, res) => {
  const { title, content, audience } = req.body.howto;
  const howto = new Instruction({ title, content, audience });
  howto.files = req.files.map((f) => ({
    originalname: f.originalname,
    url: f.path,
    filename: f.filename,
  }));
  await howto.save();
  req.flash("success", "Successfully added a how to");
  res.redirect(`/admin/info-howtos/${howto._id}`);
};

module.exports.renderInfoHowTo = async (req, res) => {
  const howto = await Instruction.findById(req.params.howtoId);
  res.render("admins/infoHowTo", { howto });
};

module.exports.renderEditInfoHowTo = async (req, res) => {
  const howto = await Instruction.findById(req.params.howtoId);
  res.render("admins/infoHowToEdit", { howto });
};

module.exports.editInfoHowTo = async (req, res) => {
  const { title, content, audience } = req.body.howto;
  const howto = await Instruction.findById(req.params.howtoId);
  const updatedHowTo = await Instruction.findOneAndUpdate(howto._id, {
    $set: { title, content, audience },
  });
  const imgs = req.files.map((f) => ({
    originalname: f.originalname,
    url: f.path,
    filename: f.filename,
  }));
  howto.files.push(...imgs);
  await howto.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await howto.updateOne({
      $pull: { files: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully edited a how to");
  res.redirect(`/admin/info-howtos/${howto._id}`);
};

module.exports.renderDeleteInfoHowTo = async (req, res) => {
  const howto = await Instruction.findById(req.params.howtoId);
  res.render("admins/infoHowToDelete", { howto });
};

module.exports.deleteInfoHowTo = async (req, res) => {
  const howto = await Instruction.findByIdAndDelete(req.params.howtoId);
  req.flash("success", "Successfully deleted a how to");
  res.redirect("/admin/info-howtos");
};
//////////This is Info How Tos Routes

//////////This is Info Faqs Routes
module.exports.viewInfoFaqs = async (req, res) => {
  const faqs = await Question.find({});
  res.render("admins/infoFaqsDashboard", { faqs });
};

module.exports.renderAddInfoFaqs = (req, res) => {
  res.render("admins/infoFaqAdd");
};

module.exports.addInfoFaq = async (req, res) => {
  const { title, content, audience } = req.body.faq;
  const faq = new Question({ title, content, audience });
  faq.files = req.files.map((f) => ({
    originalname: f.originalname,
    url: f.path,
    filename: f.filename,
  }));
  await faq.save();
  req.flash("success", "Successfully added a faq");
  res.redirect(`/admin/info-faqs/${faq._id}`);
};

module.exports.renderInfoFaq = async (req, res) => {
  const faq = await Question.findById(req.params.faqId);
  res.render("admins/infoFaq", { faq });
};

module.exports.renderEditInfoFaq = async (req, res) => {
  const faq = await Question.findById(req.params.faqId);
  res.render("admins/infoFaqEdit", { faq });
};

module.exports.editInfoFaq = async (req, res) => {
  const { title, content, audience } = req.body.faq;
  const faq = await Question.findById(req.params.faqId);
  faq.title = title;
  faq.content = content;
  faq.audience = audience;
  const imgs = req.files.map((f) => ({
    originalname: f.originalname,
    url: f.path,
    filename: f.filename,
  }));
  faq.files.push(...imgs);
  await faq.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await faq.updateOne({
      $pull: { files: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully edited a faq");
  res.redirect(`/admin/info-faqs/${faq._id}`);
};

module.exports.renderDeleteInfoFaq = async (req, res) => {
  const faq = await Question.findById(req.params.faqId);
  res.render("admins/infoFaqDelete", { faq });
};

module.exports.deleteInfoFaq = async (req, res) => {
  const faq = await Question.findByIdAndDelete(req.params.faqId);
  req.flash("success", "Successfully deleted a faq");
  res.redirect("/admin/info-faqs");
};
//////////This is Info Faqs Routes

//////////This is User Students Controllers
module.exports.viewUserStudents = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  const studentsReq = await Student.find({})
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate("assignments");
  let students = [];
  let unassignedStudents = 0;
  let acceptedStudents = 0;
  const department = admin.department;
  switch (department) {
    case "Dean Associate":
      for (let student of studentsReq) {
        students.push(student);
      }
      break;
    case "Accounting":
    case "Economics":
    case "Management":
      for (let student of studentsReq) {
        if (student.department == department) {
          students.push(student);
        }
      }
      break;
    default:
      break;
  }
  for (let student of students) {
    if (
      (student.firstLecturer == undefined &&
        student.secondLecturer == undefined) ||
      (student.firstLecturer && student.secondLecturer == undefined) ||
      (student.firstLecturer == undefined && student.secondLecturer)
    ) {
      unassignedStudents += 1;
    }
  }
  for (let student of students) {
    if (
      student.assignments.length == 2 &&
      student.assignments[0].status == "Accepted" &&
      student.assignments[1].status == "Accepted"
    ) {
      acceptedStudents += 1;
    }
  }
  res.render("admins/userStudentsDashboard", {
    students,
    unassignedStudents,
    acceptedStudents,
  });
};

module.exports.renderUserStudent = async (req, res) => {
  const student = await Student.findById(req.params.studentId)
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate("assignments")
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
  res.render("admins/userStudent", { student });
};

module.exports.renderUserStudentsUnassigned = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  const studentsReq = await Student.find({})
    .populate("firstLecturer")
    .populate("secondLecturer");
  let students = [];
  let unassignedStudents = [];
  if (admin.department == "Dean Associate") {
    for (let student of studentsReq) {
      students.push(student);
    }
  } else if (admin.department == "Accounting") {
    for (let student of studentsReq) {
      if (student.department == "Accounting") {
        students.push(student);
      }
    }
  } else if (admin.department == "Economics") {
    for (let student of studentsReq) {
      if (student.department == "Economics") {
        students.push(student);
      }
    }
  } else if (admin.department == "Management") {
    for (let student of studentsReq) {
      if (student.department == "Management") {
        students.push(student);
      }
    }
  }
  for (let student of students) {
    if (
      (student.firstLecturer == undefined &&
        student.secondLecturer == undefined) ||
      (student.firstLecturer && student.secondLecturer == undefined) ||
      (student.firstLecturer == undefined && student.secondLecturer)
    ) {
      unassignedStudents.push(student);
    }
  }
  res.render("admins/userStudentsUnassigned", { students, unassignedStudents });
};

module.exports.renderUserStudentsAccepted = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  const studentsReq = await Student.find({})
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate("assignments");
  let students = [];
  let acceptedStudents = [];
  if (admin.department == "Dean Associate") {
    for (let student of studentsReq) {
      students.push(student);
    }
  } else if (admin.department == "Accounting") {
    for (let student of studentsReq) {
      if (student.department == "Accounting") {
        students.push(student);
      }
    }
  } else if (admin.department == "Economics") {
    for (let student of studentsReq) {
      if (student.department == "Economics") {
        students.push(student);
      }
    }
  } else if (admin.department == "Management") {
    for (let student of studentsReq) {
      if (student.department == "Management") {
        students.push(student);
      }
    }
  }
  for (let student of students) {
    if (
      student.assignments.length == 2 &&
      student.assignments[0].status == "Accepted" &&
      student.assignments[1].status == "Accepted"
    ) {
      acceptedStudents.push(student);
    }
  }
  res.render("admins/userStudentsAccepted", { students, acceptedStudents });
};

module.exports.renderAddUserStudent = (req, res) => {
  const departments = ["Accounting", "Economics", "Management"];
  res.render("admins/userStudentAddStudent", { departments });
};

module.exports.addUserStudent = async (req, res) => {
  const { username, name, email, phoneNumber, department, password } =
    req.body.student;
  const student = new Student({
    name,
    email,
    username,
    phoneNumber,
    department,
  });
  const registeredStudent = await Student.register(student, password);
  req.flash("success", "Successfully added a student");
  res.redirect(`/admin/user-students/${registeredStudent._id}`);
};

module.exports.renderDeleteUserStudent = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  res.render("admins/userStudentDelete", { student });
};

module.exports.deleteUserStudent = async (req, res) => {
  const student = await Student.findById(req.params.studentId)
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate({
      path: "assignments",
      populate: {
        path: "reviews",
      },
    });
  for (let assignment of student.assignments) {
    for (let review of assignment.reviews) {
      await Review.findByIdAndDelete(review._id);
    }
    await Assignment.findByIdAndDelete(assignment._id);
  }
  if (student.firstLecturer) {
    await Lecturer.findByIdAndUpdate(student.firstLecturer._id, {
      $pull: { students: student._id },
    });
  }
  if (student.secondLecturer) {
    await Lecturer.findByIdAndUpdate(student.secondLecturer._id, {
      $pull: { students: student._id },
    });
  }
  await Student.findByIdAndDelete(req.params.studentId);
  req.flash("success", "Successfully deleted the student");
  res.redirect("/admin/user-students");
};

module.exports.renderEditUserStudentProfile = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const departments = ["Accounting", "Economics", "Management"];
  res.render("admins/userStudentEditProfile", { student, departments });
};

module.exports.editUserStudentProfile = async (req, res) => {
  const { username, name, email, phoneNumber, department, password } =
    req.body.student;
  const student = await Student.findById(req.params.studentId);
  // const updatedStudent = await Student.findOneAndUpdate(req.params.studentId, {
  //   $set: { username, name, email, department, phoneNumber },
  // });
  student.username = username;
  student.name = name;
  student.email = email;
  student.phoneNumber = phoneNumber;
  student.department = department;
  const updatedPassword = await student.setPassword(password);
  const savedStudent = await student.save();
  req.flash("success", "Successfully edited the student's profile");
  res.redirect(`/admin/user-students/${student._id}`);
};

module.exports.renderAddUserStudentLecturer = async (req, res) => {
  const student = await Student.findById(req.params.studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const lecturers = await Lecturer.find({});
  res.render("admins/userStudentAddLecturer", { student, lecturers });
};

module.exports.addUserStudentLecturer = async (req, res) => {
  const student = await Student.findById(req.params.studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  if (
    student.firstLecturer == undefined ||
    (req.body.lecturer.firstSupervisor &&
      req.body.lecturer.firstSupervisor != student.firstLecturer._id)
  ) {
    const lecturer1 = await Lecturer.findById(
      req.body.lecturer.firstSupervisor
    );
    student.firstLecturer = lecturer1;
    lecturer1.students.push(student);
    await lecturer1.save();
  }
  if (
    student.secondLecturer == undefined ||
    (req.body.lecturer.secondSupervisor &&
      req.body.lecturer.secondSupervisor != student.secondLecturer._id)
  ) {
    const lecturer2 = await Lecturer.findById(
      req.body.lecturer.secondSupervisor
    );
    student.secondLecturer = lecturer2;
    lecturer2.students.push(student);
    await lecturer2.save();
  }
  await student.save();
  req.flash("success", "Successfully chose supervisors for the student");
  res.redirect(`/admin/user-students/${req.params.studentId}`);
};

module.exports.renderDeleteUserStudentLecturer = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  res.render("admins/userStudentDeleteLecturer", { student, lecturer });
};

module.exports.deleteUserStudentLecturer = async (req, res) => {
  const { studentId, lecturerId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate({
      path: "assignments",
      populate: [
        { path: "statusOfFirstLecturer" },
        { path: "statusOfSecondLecturer" },
      ],
    });
  if (student.firstLecturer && lecturerId == student.firstLecturer._id) {
    const deleteStudentRef = await Student.findByIdAndUpdate(studentId, {
      $unset: { firstLecturer: 1 },
    });
    const deleteLecturerRef = await Lecturer.findByIdAndUpdate(lecturerId, {
      $pull: { students: studentId },
    });
    for (let assignment of student.assignments) {
      assignment.statusOfFirstLecturer = undefined;
      await assignment.save();
    }
  } else if (
    student.secondLecturer &&
    lecturerId == student.secondLecturer._id
  ) {
    const deleteStudentRef = await Student.findByIdAndUpdate(studentId, {
      $unset: { secondLecturer: 1 },
    });
    const deleteLecturerRef = await Lecturer.findByIdAndUpdate(lecturerId, {
      $pull: { students: studentId },
    });
    for (let assignment of student.assignments) {
      assignment.statusOfSecondLecturer = undefined;
      await assignment.save();
    }
  }
  req.flash("success", "Successfully deleted the student's assigned lecturer");
  res.redirect(`/admin/user-students/${studentId}`);
};

module.exports.renderAddUserStudentAssignment = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const phases = ["Phase 1", "Phase 2"];
  res.render("admins/userStudentAddAssignment", {
    student,
    phases,
  });
};

module.exports.addUserStudentAssignment = async (req, res) => {
  const { originalname, path: url, filename } = req.file;
  const student = await Student.findById(req.params.studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = new Assignment(req.body.assignment);
  assignment.status = "Under Review by Lecturers";
  assignment.author = student;
  assignment.content = { originalname, url, filename };
  assignment.time.createdOn = Date.now();
  assignment.time.updatedOn = Date.now();
  assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
  if (student.firstLecturer) {
    assignment.statusOfFirstLecturer.code = "Pending";
    assignment.statusOfFirstLecturer.lecturer = student.firstLecturer;
  }
  if (student.secondLecturer) {
    assignment.statusOfSecondLecturer.code = "Pending";
    assignment.statusOfSecondLecturer.lecturer = student.secondLecturer;
  }
  if (assignment.phase == "Phase 1") {
    const history = await historyCreationAssignment(
      assignment,
      "Student has created a phase 1 assignment"
    );
  } else if (assignment.phase == "Phase 2") {
    const history = await historyCreationAssignment(
      assignment,
      "Student has created a phase 2 assignment"
    );
  }
  assignment.histories.push(history);
  student.assignments.push(assignment);
  await assignment.save();
  await student.save();
  req.flash("success", "Successfully added an assignment");
  res.redirect(
    `/admin/user-students/${student._id}/assignment/${assignment._id}`
  );
};

module.exports.renderUserStudentAssignmentDetail = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const assignment = await Assignment.findById(req.params.assignmentId);
  res.render("admins/userStudentRenderAssignment", {
    student,
    assignment,
  });
};

module.exports.renderAcceptUserStudentAssignment = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(assignmentId);
  res.render("admins/userStudentAssignmentAccept", {
    student,
    assignment,
  });
};

module.exports.acceptUserStudentAssignment = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const { lecturerId } = req.body.assignment;
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
  const lecturer = await Lecturer.findById(lecturerId);
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
  req.flash("success", "Successfully accepted the assignment");
  res.redirect(`/admin/user-students/${student._id}`);
};

module.exports.renderOverrideUserStudentAssignment = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId)
    .populate("statusOfFirstLecturer")
    .populate("statusOfSecondLecturer");
  res.render("admins/userStudentAssignmentOverride", {
    student,
    assignment,
  });
};

module.exports.overrideUserStudentAssignment = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  assignment.override = req.body.assignment.override;
  await assignment.save();
  if (assignment.override == true) {
    req.flash("success", `Successfully enabled the override status`);
  }
  if (assignment.override == false) {
    req.flash("success", `Successfully disabled the override status`);
  }
  res.redirect(`/admin/user-students/${student._id}`);
};

module.exports.renderEditUserStudentAssignment = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const assignment = await Assignment.findById(req.params.assignmentId);
  res.render("admins/userStudentEditAssignment", { student, assignment });
};

module.exports.editUserStudentAssignment = async (req, res) => {
  const { originalname, path: url, filename } = req.file;
  const { studentId, assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId);
  const { title } = req.body.assignment;
  assignment.status = "Under Review by Lecturers";
  assignment.statusOfFirstLecturer.code = "Pending";
  assignment.statusOfSecondLecturer.code = "Pending";
  assignment.title = title;
  assignment.time.updatedOn = new Date();
  assignment.time.expiresOn = new Date() + 1000 * 60 * 60 * 24 * 7 * 2;
  assignment.content = { originalname, url, filename };
  const history = await historyCreationAssignment(
    assignment,
    "Student has edited the assignment"
  );
  assignment.histories.push(history);
  const savedAssignment = await assignment.save();
  req.flash("success", "Successfully edited a student's assignment");
  res.redirect(`/admin/user-students/${studentId}/assignment/${assignmentId}`);
};

module.exports.renderDeleteUserStudentAssignment = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  const assignment = await Assignment.findById(req.params.assignmentId);
  res.render("admins/userStudentDeleteAssignment", { student, assignment });
};

module.exports.deleteUserStudentAssignment = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const deleteStudentRef = await Student.findByIdAndUpdate(studentId, {
    $pull: { assignments: assignmentId },
  });
  const deleteAssignment = await Assignment.findByIdAndDelete(assignmentId);
  req.flash("success", "Successfully deleted a student's assignment");
  res.redirect(`/admin/user-students/${studentId}`);
};

module.exports.renderUserStudentReviews = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(assignmentId).populate({
    path: "reviews",
    populate: { path: "author" },
  });
  res.render("admins/userStudentRenderReviews", {
    student,
    assignment,
  });
};

module.exports.renderAddUserStudentReview = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const assignment = await Assignment.findById(assignmentId);
  res.render("admins/userStudentAddReview", {
    student,
    assignment,
    reviewTitles,
  });
};

module.exports.addUserStudentReview = async (req, res) => {
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
  const lecturer = await Lecturer.findById(req.body.review.author);
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
  } else if (assignment.phase == "Phase 2") {
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
  if (assignment.status == "Under Review by Lecturers") {
    assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
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
  req.flash("success", "Successfully added the assignment's review");
  res.redirect(
    `/admin/user-students/${student._id}/assignment/${assignment._id}/reviews`
  );
};

module.exports.renderUserStudentReviewDetail = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId).populate("author");
  res.render("admins/userStudentRenderReview", {
    student,
    assignment,
    review,
  });
};

module.exports.renderEditUserStudentReview = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId)
    .populate("data")
    .populate("author");
  res.render("admins/userStudentEditReview", { student, assignment, review });
};

module.exports.editUserStudentReview = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId).populate("author");
  const lecturer = await Lecturer.findById(review.author._id);
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
  req.flash("success", "Successfully edited an assignment's review");
  res.redirect(
    `/admin/user-students/${studentId}/assignment/${assignmentId}/review/${reviewId}`
  );
};

module.exports.renderDeleteUserStudentReview = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const student = await Student.findById(studentId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId);
  res.render("admins/userStudentDeleteReview", {
    student,
    assignment,
    review,
  });
};

module.exports.deleteUserStudentReview = async (req, res) => {
  const { studentId, assignmentId, reviewId } = req.params;
  const deleteAssignmentRef = await Assignment.findByIdAndUpdate(assignmentId, {
    $pull: { reviews: reviewId },
  });
  const deleteReview = await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted an assignment's review");
  res.redirect(
    `/admin/user-students/${studentId}/assignment/${assignmentId}/reviews`
  );
};

module.exports.renderUserStudentAssignmentHistories = async (req, res) => {
  const { studentId, assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId)
    .populate("histories")
    .populate("author");
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  res.render("admins/userStudentHistories", {
    assignment,
    student,
  });
};

module.exports.renderUserStudentAssignmentHistoryDetail = async (req, res) => {
  const { studentId, assignmentId, historyId } = req.params;
  const assignment = await Assignment.findById(assignmentId);
  const history = await History.findById(historyId);
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  res.render("admins/userStudentHistoryRenderDetail", {
    assignment,
    history,
    student,
  });
};

module.exports.renderUserStudentAddLetterOfApproval = async (req, res) => {
  const student = await Student.findById(req.params.studentId);
  res.render("admins/userStudentLetterOfApprovalAdd", { student });
};

module.exports.addUserStudentLetterOfApproval = async (req, res) => {
  const student = await Student.findById(req.params.studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
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
  res.redirect(
    `/admin/user-students/${student._id}/loa/${letterOfApproval._id}`
  );
};

module.exports.renderUserStudentLetterOfApprovalDetail = async (req, res) => {
  const { studentId, loaId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId)
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    });
  res.render("admins/userStudentLetterOfApprovalRenderDetail", {
    student,
    letterOfApproval,
  });
};

module.exports.renderUserStudentSignLetterOfApproval = async (req, res) => {
  const { studentId, loaId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId);
  res.render("admins/userStudentLetterOfApprovalSign", {
    student,
    letterOfApproval,
  });
};

module.exports.signUserStudentLetterOfApproval = async (req, res) => {
  const { studentId, loaId } = req.params;
  const lecturer = await Lecturer.findById(req.body.lecturer);
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId)
    .populate("author")
    .populate("statusOfFirstLecturer")
    .populate("statusOfSecondLecturer");
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
  res.redirect(`/admin/user-students/${student._id}`);
};

module.exports.renderUserStudentDeleteLetterOfApproval = async (req, res) => {
  const { studentId, loaId } = req.params;
  const student = await Student.findById(studentId);
  const letterOfApproval = await LetterOfApproval.findById(loaId);
  res.render("admins/userStudentLetterOfApprovalDelete", {
    student,
    letterOfApproval,
  });
};

module.exports.deleteUserStudentLetterOfApproval = async (req, res) => {
  const { studentId, loaId } = req.params;
  const deleteStudentRef = await Student.findByIdAndUpdate(studentId, {
    $unset: { letterOfApproval: 1 },
  });
  const deleteLetterOfApproval = await LetterOfApproval.findByIdAndDelete(
    loaId
  );
  req.flash("success", "Successfully deleted your Letter of Approval");
  res.redirect(`/admin/user-students/${studentId}`);
};

module.exports.renderUserStudentLetterOfApprovalHistories = async (
  req,
  res
) => {
  const { studentId, loaId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId).populate(
    "histories"
  );
  res.render("admins/userStudentLetterOfApprovalHistories", {
    student,
    letterOfApproval,
  });
};

module.exports.renderUserStudentLetterOfApprovalHistoryDetail = async (
  req,
  res
) => {
  const { studentId, loaId, historyId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const letterOfApproval = await LetterOfApproval.findById(loaId);
  const letterOfApprovalHistory = await LetterOfApprovalHistory.findById(
    historyId
  );
  res.render("admins/userStudentLetterOfApprovalHistoryRenderDetail", {
    student,
    letterOfApproval,
    letterOfApprovalHistory,
  });
};
//////////This is User Students Controllers

//////////This is User Lecturers Controllers
module.exports.viewUserLecturers = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  const lecturersReq = await Lecturer.find({});
  let lecturers = [];
  const department = admin.department;
  switch (department) {
    case "Dean Associate":
      for (let lecturer of lecturersReq) {
        lecturers.push(lecturer);
      }
      break;
    case "Accounting":
    case "Economics":
    case "Management":
      for (let lecturer of lecturersReq) {
        if (lecturer.department == department) {
          lecturers.push(lecturer);
        }
      }
      break;
    default:
      break;
  }
  res.render("admins/userLecturersDashboard", { lecturers });
};

module.exports.renderAddUserLecturer = (req, res) => {
  const departments = ["Accounting", "Economics", "Management"];
  res.render("admins/userLecturerAddLecturer", { departments });
};

module.exports.addUserLecturer = async (req, res) => {
  const { username, name, email, department, password } = req.body.lecturer;
  const lecturer = new Lecturer({ name, email, username, department });
  const registeredLecturer = await Lecturer.register(lecturer, password);
  req.flash("success", "Successfully added a lecturer");
  res.redirect(`/admin/user-lecturers/${registeredLecturer._id}`);
};

module.exports.renderDeleteUserLecturer = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  res.render("admins/userLecturerDelete", { lecturer });
};

module.exports.deleteUserLecturer = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId).populate({
    path: "students",
    populate: [{ path: "firstLecturer" }, { path: "secondLecturer" }],
  });
  for (let student of lecturer.students) {
    if (student.firstLecturer && student.firstLecturer._id == lecturer._id) {
      student.firstLecturer = undefined;
      await student.save();
    } else if (
      student.secondLecturer &&
      student.secondLecturer._id == lecturer._id
    ) {
      student.secondLecturer = undefined;
      await student.save();
    }
  }
  await Lecturer.findByIdAndDelete(req.params.lecturerId);
  req.flash("success", "Successfully deleted a lecturer");
  res.redirect("/admin/user-lecturers");
};

module.exports.renderUserLecturer = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId).populate(
    "students"
  );
  const students = await Student.find({
    _id: { $in: lecturer.students },
  })
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate({
      path: "assignments",
      populate: [
        { path: "statusOfFirstLecturer" },
        { path: "statusOfSecondLecturer" },
        { path: "reviews" },
      ],
    })
    .populate({
      path: "letterOfApproval",
      populate: [
        { path: "statusOfFirstLecturer" },
        { path: "statusOfSecondLecturer" },
      ],
    });
  res.render("admins/userLecturer", { lecturer, students });
};

module.exports.renderEditUserLecturerProfile = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const departments = ["Accounting", "Economics", "Management"];
  res.render("admins/userLecturerEditProfile", { lecturer, departments });
};

module.exports.editUserLecturerProfile = async (req, res) => {
  const { username, name, email, department, password } = req.body.lecturer;
  const lecturer = await Lecturer.findById(req.params.lecturerId);
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
  const updatedPassword = await lecturer.setPassword(password);
  const savedLecturer = await lecturer.save();
  req.flash("success", "Successfully edited a lecturer's profile");
  res.redirect(`/admin/user-lecturers/${lecturer._id}`);
};

module.exports.renderAddUserLecturerStudent = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const students = await Student.find({});
  res.render("admins/userLecturerAddStudent", { lecturer, students });
};

module.exports.addUserLecturerStudent = async (req, res) => {
  const student = await Student.findById(req.body.student.username)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  if (req.body.student.role == "firstSupervisor") {
    student.firstLecturer = lecturer;
  } else if (req.body.student.role == "secondSupervisor") {
    student.secondLecturer = lecturer;
  }
  lecturer.students.push(student);
  await student.save();
  await lecturer.save();
  req.flash("success", "Successfully added a lecturer's assigned student");
  res.redirect(`/admin/user-lecturers/${req.params.lecturerId}`);
};

module.exports.renderDeleteUserLecturerStudent = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const student = await Student.findById(req.params.studentId);
  res.render("admins/userLecturerDeleteStudent", { lecturer, student });
};

module.exports.deleteUserLecturerStudent = async (req, res) => {
  const { lecturerId, studentId } = req.params;
  const student = await Student.findById(studentId)
    .populate("firstLecturer")
    .populate("secondLecturer")
    .populate({
      path: "assignments",
      populate: [
        { path: "statusOfFirstLecturer" },
        { path: "statusOfSecondLecturer" },
      ],
    });
  const deleteLecturerRef = await Lecturer.findByIdAndUpdate(lecturerId, {
    $pull: { students: studentId },
  });
  if (student.firstLecturer && lecturerId == student.firstLecturer._id) {
    const deleteStudentRef = await Student.findByIdAndUpdate(studentId, {
      $unset: { firstLecturer: 1 },
    });
    for (let assignment of student.assignments) {
      assignment.statusOfFirstLecturer = undefined;
      await assignment.save();
    }
  } else if (
    student.secondLecturer &&
    lecturerId == student.secondLecturer._id
  ) {
    const deleteStudentRef = await Student.findByIdAndUpdate(studentId, {
      $unset: { secondLecturer: 1 },
    });
    for (let assignment of student.assignments) {
      assignment.statusOfSecondLecturer = undefined;
      await assignment.save();
    }
  }
  req.flash("success", "Successfully deleted a lecturer's assigned student");
  res.redirect(`/admin/user-lecturers/${lecturerId}`);
};

module.exports.renderAddUserLecturerAssignment = async (req, res) => {
  const students = await Student.find({});
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignments = await Assignment.find({});
  const phases = ["Phase 1", "Phase 2"];
  res.render("admins/userLecturerAddAssignment", {
    students,
    lecturer,
    assignments,
    phases,
  });
};

module.exports.addUserLecturerAssignment = async (req, res) => {
  const { originalname, path: url, filename } = req.file;
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignment = new Assignment(req.body.assignment);
  const student = await Student.findById(req.body.assignment.author)
    .populate("firstLecturer")
    .populate("secondLecturer");
  assignment.status = "Under Review by Lecturers";
  assignment.content = { originalname, url, filename };
  assignment.time.createdOn = Date.now();
  assignment.time.updatedOn = Date.now();
  assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
  assignment.statusOfFirstLecturer.code = "Pending";
  assignment.statusOfFirstLecturer.lecturer = student.firstLecturer;
  assignment.statusOfSecondLecturer.code = "Pending";
  assignment.statusOfSecondLecturer.lecturer = student.secondLecturer;
  if (assignment.phase == "Phase 1") {
    const history = await historyCreationAssignment(
      assignment,
      "Student has created a phase 1 assignment"
    );
  } else if (assignment.phase == "Phase 2") {
    const history = await historyCreationAssignment(
      assignment,
      "Student has created a phase 2 assignment"
    );
  }
  assignment.histories.push(history);
  student.assignments.push(assignment);
  await assignment.save();
  await student.save();
  req.flash("success", "Successfully added an assignment");
  res.redirect(
    `/admin/user-lecturers/${lecturer._id}/assignment/${assignment._id}`
  );
};

module.exports.renderUserLecturerAssignmentDetail = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignment = await Assignment.findById(
    req.params.assignmentId
  ).populate("author");
  res.render("admins/userLecturerRenderAssignment", {
    lecturer,
    assignment,
  });
};

module.exports.renderAcceptUserLecturerAssignment = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const assignment = await Assignment.findById(assignmentId).populate("author");
  res.render("admins/userLecturerAssignmentAccept", {
    lecturer,
    assignment,
  });
};

module.exports.acceptUserLecturerAssignment = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
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
  const lecturer = await Lecturer.findById(lecturerId);
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
  req.flash("success", "Successfully accepted the assignment");
  res.redirect(`/admin/user-lecturers/${lecturer._id}`);
};

module.exports.renderEditUserLecturerAssignment = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignment = await Assignment.findById(
    req.params.assignmentId
  ).populate("author");
  res.render("admins/userLecturerEditAssignment", { lecturer, assignment });
};

module.exports.editUserLecturerAssignment = async (req, res) => {
  const { originalname, path: url, filename } = req.file;
  const { lecturerId, assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId);
  const { title } = req.body.assignment;
  assignment.status = "Under Review by Lecturers";
  assignment.statusOfFirstLecturer.code = "Pending";
  assignment.statusOfSecondLecturer.code = "Pending";
  assignment.title = title;
  assignment.time.updatedOn = Date.now();
  assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
  assignment.content = { originalname, url, filename };
  const history = await historyCreationAssignment(
    assignment,
    "Student has edited the assignment"
  );
  assignment.histories.push(history);
  const savedAssignment = await assignment.save();
  req.flash("success", "Successfully edited the assignment");
  res.redirect(
    `/admin/user-lecturers/${lecturerId}/assignment/${assignmentId}`
  );
};

module.exports.renderOverrideUserLecturerAssignment = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const assignment = await Assignment.findById(assignmentId)
    .populate("statusOfFirstLecturer")
    .populate("statusOfSecondLecturer");
  res.render("admins/userLecturerAssignmentOverride", {
    lecturer,
    assignment,
  });
};

module.exports.overrideUserLecturerAssignment = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const assignment = await Assignment.findById(assignmentId);
  assignment.override = req.body.assignment.override;
  await assignment.save();
  if (assignment.override == true) {
    req.flash("success", `Successfully enabled the override status`);
  }
  if (assignment.override == false) {
    req.flash("success", `Successfully disabled the override status`);
  }
  res.redirect(`/admin/user-lecturers/${lecturer._id}`);
};

module.exports.renderDeleteUserLecturerAssignment = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignment = await Assignment.findById(req.params.assignmentId);
  res.render("admins/userLecturerDeleteAssignment", { lecturer, assignment });
};

module.exports.deleteUserLecturerAssignment = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId).populate("author");
  const deleteStudentRef = await Student.findByIdAndUpdate(
    assignment.author._id,
    {
      $pull: { assignments: assignmentId },
    }
  );
  const deleteAssignment = await Assignment.findByIdAndDelete(assignmentId);
  req.flash("success", "Successfully deleted the assignment");
  res.redirect(`/admin/user-lecturers/${lecturerId}`);
};

module.exports.renderUserLecturerReviews = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignment = await Assignment.findById(
    req.params.assignmentId
  ).populate({
    path: "reviews",
    populate: { path: "author" },
  });
  res.render("admins/userLecturerRenderReviews", {
    lecturer,
    assignment,
  });
};

module.exports.renderAddUserLecturerReview = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const assignment = await Assignment.findById(assignmentId);
  res.render("admins/userLecturerAddReview", {
    lecturer,
    assignment,
    reviewTitles,
  });
};

module.exports.addUserLecturerReview = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
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
  const lecturer = await Lecturer.findById(lecturerId);
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
  } else if (assignment.phase == "Phase 2") {
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
  if (assignment.status == "Under Review by Lecturers") {
    assignment.time.expiresOn = Date.now() + 1000 * 60 * 60 * 24 * 7 * 2;
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
  req.flash("success", "Successfully added a review");
  res.redirect(
    `/admin/user-lecturers/${lecturer._id}/assignment/${assignment._id}/reviews`
  );
};

module.exports.renderUserLecturerReviewDetail = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignment = await Assignment.findById(req.params.assignmentId);
  const review = await Review.findById(req.params.reviewId);
  res.render("admins/userLecturerRenderReview", {
    lecturer,
    assignment,
    review,
  });
};

module.exports.renderEditUserLecturerReview = async (req, res) => {
  const { lecturerId, assignmentId, reviewId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const assignment = await Assignment.findById(assignmentId).populate("author");
  const review = await Review.findById(reviewId).populate("data");
  res.render("admins/userLecturerEditReview", { lecturer, assignment, review });
};

module.exports.editUserLecturerReview = async (req, res) => {
  const { lecturerId, assignmentId, reviewId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const assignment = await Assignment.findById(assignmentId);
  const review = await Review.findById(reviewId);
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
  req.flash("success", "Successfully edited the lecturer's review");
  res.redirect(
    `/admin/user-lecturers/${lecturerId}/assignment/${assignmentId}/review/${reviewId}`
  );
};

module.exports.renderDeleteUserLecturerReview = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const assignment = await Assignment.findById(req.params.assignmentId);
  const review = await Review.findById(req.params.reviewId);
  res.render("admins/userLecturerDeleteReview", {
    lecturer,
    assignment,
    review,
  });
};

module.exports.deleteUserLecturerReview = async (req, res) => {
  const { lecturerId, assignmentId, reviewId } = req.params;
  const deleteAssignmentRef = await Assignment.findByIdAndUpdate(assignmentId, {
    $pull: { reviews: reviewId },
  });
  const deleteReview = await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the lecturer's review");
  res.redirect(
    `/admin/user-lecturers/${lecturerId}/assignment/${assignmentId}/reviews`
  );
};

module.exports.renderUserLecturerAssignmentHistories = async (req, res) => {
  const { lecturerId, assignmentId } = req.params;
  const assignment = await Assignment.findById(assignmentId)
    .populate("histories")
    .populate("author");
  const student = await Student.findById(assignment.author._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  const lecturer = await Lecturer.findById(lecturerId);
  res.render("admins/userLecturerHistories", {
    assignment,
    student,
    lecturer,
  });
};

module.exports.renderUserLecturerAssignmentHistoryDetail = async (req, res) => {
  const { lecturerId, assignmentId, historyId } = req.params;
  const assignment = await Assignment.findById(assignmentId);
  const history = await History.findById(historyId);
  const lecturer = await Lecturer.findById(lecturerId);
  const student = await Student.findById(assignment.author._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  res.render("admins/userLecturerHistoryRenderDetail", {
    assignment,
    history,
    lecturer,
    student,
  });
};

module.exports.renderUserLecturerAddLetterOfApproval = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId).populate(
    "students"
  );
  let studentsWithoutLoa = [];
  for (let student of lecturer.students) {
    if (student.letterOfApproval == undefined) {
      studentsWithoutLoa.push(student);
    }
  }
  res.render("admins/userLecturerLetterOfApprovalAdd", {
    lecturer,
    studentsWithoutLoa,
  });
};

module.exports.addUserLecturerLetterOfApproval = async (req, res) => {
  const lecturer = await Lecturer.findById(req.params.lecturerId);
  const student = await Student.findById(req.body.student)
    .populate("firstLecturer")
    .populate("secondLecturer");
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
  res.redirect(
    `/admin/user-lecturers/${lecturer._id}/loa/${letterOfApproval._id}`
  );
};

module.exports.renderUserLecturerLetterOfApprovalDetail = async (req, res) => {
  const { lecturerId, loaId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const letterOfApproval = await LetterOfApproval.findById(loaId)
    .populate("author")
    .populate({
      path: "statusOfFirstLecturer",
      populate: { path: "lecturer" },
    })
    .populate({
      path: "statusOfSecondLecturer",
      populate: { path: "lecturer" },
    });
  const student = await Student.findById(letterOfApproval.author._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  res.render("admins/userLecturerLetterOfApprovalRenderDetail", {
    lecturer,
    letterOfApproval,
    student,
  });
};

module.exports.renderUserLecturerSignLetterOfApproval = async (req, res) => {
  const { lecturerId, loaId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const letterOfApproval = await LetterOfApproval.findById(loaId).populate(
    "author"
  );
  const student = await Student.findById(letterOfApproval.author._id);
  res.render("admins/userLecturerLetterOfApprovalSign", {
    lecturer,
    student,
    letterOfApproval,
  });
};

module.exports.signUserLecturerLetterOfApproval = async (req, res) => {
  const { lecturerId, loaId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const letterOfApproval = await LetterOfApproval.findById(loaId)
    .populate("author")
    .populate("statusOfFirstLecturer")
    .populate("statusOfSecondLecturer");
  const student = await Student.findById(letterOfApproval.author._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
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
  res.redirect(`/admin/user-lecturers/${lecturer._id}`);
};

module.exports.renderUserLecturerDeleteLetterOfApproval = async (req, res) => {
  const { lecturerId, loaId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const letterOfApproval = await LetterOfApproval.findById(loaId).populate(
    "author"
  );
  const student = await Student.findById(letterOfApproval.author._id);
  res.render("admins/userLecturerLetterOfApprovalDelete", {
    lecturer,
    student,
    letterOfApproval,
  });
};

module.exports.deleteUserLecturerLetterOfApproval = async (req, res) => {
  const { lecturerId, loaId } = req.params;
  const letterOfApproval = await LetterOfApproval.findById(loaId).populate(
    "author"
  );
  const deleteStudentRef = await Student.findByIdAndUpdate(
    letterOfApproval.author._id,
    {
      $unset: { letterOfApproval: 1 },
    }
  );
  const deleteLetterOfApproval = await LetterOfApproval.findByIdAndDelete(
    loaId
  );
  req.flash("success", "Successfully deleted your Letter of Approval");
  res.redirect(`/admin/user-lecturers/${lecturerId}`);
};

module.exports.renderUserLecturerLetterOfApprovalHistories = async (
  req,
  res
) => {
  const { lecturerId, loaId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const letterOfApproval = await LetterOfApproval.findById(loaId)
    .populate("histories")
    .populate("author");
  const student = await Student.findById(letterOfApproval.author._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  res.render("admins/userLecturerLetterOfApprovalHistories", {
    lecturer,
    student,
    letterOfApproval,
  });
};

module.exports.renderUserLecturerLetterOfApprovalHistoryDetail = async (
  req,
  res
) => {
  const { lecturerId, loaId, historyId } = req.params;
  const lecturer = await Lecturer.findById(lecturerId);
  const letterOfApproval = await LetterOfApproval.findById(loaId).populate(
    "author"
  );
  const letterOfApprovalHistory = await LetterOfApprovalHistory.findById(
    historyId
  );
  const student = await Student.findById(letterOfApproval.author._id)
    .populate("firstLecturer")
    .populate("secondLecturer");
  res.render("admins/userLecturerLetterOfApprovalHistoryRenderDetail", {
    lecturer,
    student,
    letterOfApproval,
    letterOfApprovalHistory,
  });
};
//////////This is User Lecturers Controllers

//////////This is User Admins Controllers
module.exports.viewUserAdmins = async (req, res) => {
  const adminMe = await Admin.findById(req.user._id);
  const adminsReq = await Admin.find({});
  let admins = [];
  if (adminMe.department == "Dean Associate") {
    for (let admin of adminsReq) {
      admins.push(admin);
    }
  } else if (adminMe.department == "Accounting") {
    for (let admin of adminsReq) {
      if (admin.department == "Accounting") {
        admins.push(admin);
      }
    }
  } else if (adminMe.department == "Economics") {
    for (let admin of adminsReq) {
      if (admin.department == "Economics") {
        admins.push(admin);
      }
    }
  } else if (adminMe.department == "Management") {
    for (let admin of adminsReq) {
      if (admin.department == "Management") {
        admins.push(admin);
      }
    }
  }
  res.render("admins/userAdminsDashboard", { admins });
};

module.exports.renderAddUserAdmin = async (req, res) => {
  const admin = await Admin.findById(req.user._id);
  let departments = [];
  const department = admin.department;
  switch (department) {
    case "Dean Associate":
      const toBeInserted = [
        "Dean Associate",
        "Accounting",
        "Economics",
        "Management",
      ];
      departments.push(...toBeInserted);
      break;
    case "Accounting":
    case "Economics":
    case "Management":
      departments.push(department);
      break;
    default:
      break;
  }
  res.render("admins/userAdminAddAdmin", { departments });
};

module.exports.addUserAdmin = async (req, res) => {
  const { username, name, email, department, password } = req.body.admin;
  const admin = new Admin({ name, email, username, department });
  const registeredAdmin = await Admin.register(admin, password);
  req.flash("success", "Successfully added an admin");
  res.redirect(`/admin/user-admins/${registeredAdmin._id}`);
};

module.exports.renderDeleteUserAdmin = async (req, res) => {
  const admin = await Admin.findById(req.params.adminId);
  res.render("admins/userAdminDelete", { admin });
};

module.exports.deleteUserAdmin = async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.adminId);
  req.flash("success", "Successfully deleted an admin");
  res.redirect("/admin/user-admins");
};

module.exports.renderUserAdmin = async (req, res) => {
  const admin = await Admin.findById(req.params.adminId);
  let departments = [];
  if (admin.department == "Master") {
    const toBeInserted = ["Master", "Accounting", "Economics", "Management"];
    departments.push(...toBeInserted);
  } else if (admin.department == "Accounting") {
    departments.push("Accounting");
  } else if (admin.department == "Economics") {
    departments.push("Economics");
  } else if (admin.department == "Management") {
    departments.push("Management");
  }
  res.render("admins/userAdmin", { admin, departments });
};

module.exports.renderEditUserAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.params.adminId);
  const user = await Admin.findById(req.user._id);
  let departments = [];
  const department = user.department;
  switch (department) {
    case "Dean Associate":
      const toBeInserted = [
        "Dean Associate",
        "Accounting",
        "Economics",
        "Management",
      ];
      departments.push(...toBeInserted);
      break;
    case "Accounting":
    case "Economics":
    case "Management":
      departments.push(department);
      break;
    default:
      break;
  }
  res.render("admins/userAdminEditProfile", { admin, departments });
};

module.exports.editUserAdminProfile = async (req, res) => {
  const { username, name, email, department, password } = req.body.admin;
  const admin = await Admin.findById(req.params.adminId);
  const updatedAdmin = await Admin.findOneAndUpdate(req.params.adminId, {
    $set: { username, name, email, department },
  });
  const updatedPassword = await admin.setPassword(password);
  const savedAdmin = await admin.save();
  req.flash("success", "Successfully edited an admin's profile");
  res.redirect(`/admin/user-admins/${admin._id}`);
};
//////////This is User Admins Controllers
