const History = require("../models/history.js");
const LetterOfApprovalHistory = require("../models/letterOfApprovalHistory.js");

const historyCreationAssignment = function (asg, msg) {
  const history = new History({
    createdOn: new Date(),
    detail: msg,
    content: {
      originalname: asg.content.originalname,
      url: asg.content.url,
      filename: asg.content.filename,
    },
    assignment: asg,
    status: asg.status,
    statusOfFirstLecturer: {
      code: asg.statusOfFirstLecturer.code,
      lecturer: asg.statusOfFirstLecturer.lecturer,
    },
    statusOfSecondLecturer: {
      code: asg.statusOfSecondLecturer.code,
      lecturer: asg.statusOfSecondLecturer.lecturer,
    },
  });
  return history.save();
};

const historyCreationReview = function (asg, rev, msg) {
  const history = new History({
    createdOn: new Date(),
    detail: msg,
    content: {
      originalname: rev.file.originalname,
      url: rev.file.url,
      filename: rev.file.filename,
    },
    assignment: asg,
    review: rev,
    status: asg.status,
    statusOfFirstLecturer: {
      code: asg.statusOfFirstLecturer.code,
      lecturer: asg.statusOfFirstLecturer.lecturer,
    },
    statusOfSecondLecturer: {
      code: asg.statusOfSecondLecturer.code,
      lecturer: asg.statusOfSecondLecturer.lecturer,
    },
  });
  return history.save();
};

const historyCreationLetterOfApproval = function (loa, msg) {
  const history = new LetterOfApprovalHistory({
    createdOn: new Date(),
    detail: msg,
    file: {
      originalname: loa.file.originalname,
      url: loa.file.url,
      filename: loa.file.filename,
    },
    status: loa.status,
    letterOfApproval: loa,
    statusOfFirstLecturer: {
      code: loa.statusOfFirstLecturer.code,
      lecturer: loa.statusOfFirstLecturer.lecturer,
    },
    statusOfSecondLecturer: {
      code: loa.statusOfSecondLecturer.code,
      lecturer: loa.statusOfSecondLecturer.lecturer,
    },
  });
  return history.save();
};

module.exports = {
  historyCreationAssignment,
  historyCreationReview,
  historyCreationLetterOfApproval,
};
