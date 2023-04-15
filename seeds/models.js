const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    enum: ["Accounting", "Economics", "Management"],
    required: true,
  },
  role: {
    type: String,
    default: "Student",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  firstLecturer: {
    type: Schema.Types.ObjectId,
    ref: "Lecturer",
  },
  secondLecturer: {
    type: Schema.Types.ObjectId,
    ref: "Lecturer",
  },
  assignments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
    },
  ],
  letterOfApproval: {
    type: Schema.Types.ObjectId,
    ref: "LetterOfApproval",
  },
});

const Student = mongoose.model("Student", studentSchema);

const lecturerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    enum: ["Accounting", "Economics", "Management"],
    required: true,
  },
  role: {
    type: String,
    default: "Lecturer",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Lecturer = mongoose.model("Lecturer", lecturerSchema);

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    enum: ["Dean Associate", "Accounting", "Economics", "Management"],
    required: true,
  },
  role: {
    type: String,
    default: "Admin",
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  salt: {
    type: String,
    required: true,
  },
  hash: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

const assignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    originalname: String,
    url: String,
    filename: String,
  },
  phase: {
    type: String,
    enum: ["Phase 1", "Phase 2"],
    required: true,
  },
  time: {
    createdOn: Date,
    updatedOn: Date,
    expiresOn: Date,
  },
  status: {
    type: String,
    enum: ["Under Review by Lecturers", "Under Editing by Student", "Accepted"],
  },
  statusOfFirstLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
  statusOfSecondLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
  override: {
    type: Boolean,
    default: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  histories: [
    {
      type: Schema.Types.ObjectId,
      ref: "History",
    },
  ],
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

const dataSchema = new Schema({
  title: {
    type: String,
    enum: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const reviewSchema = new Schema({
  data: [dataSchema],
  file: {
    originalname: String,
    url: String,
    filename: String,
  },
  createdOn: Date,
  author: {
    type: Schema.Types.ObjectId,
    ref: "Lecturer",
  },
});

const Review = mongoose.model("Review", reviewSchema);

const letterOfApprovalSchema = new Schema({
  file: {
    originalname: String,
    url: String,
    filename: String,
  },
  time: {
    createdOn: Date,
    updatedOn: Date,
    expiresOn: Date,
  },
  status: {
    type: String,
    enum: ["Waiting for Approval", "Approved"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  statusOfFirstLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Approved"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
  statusOfSecondLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Approved"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
  histories: [
    {
      type: Schema.Types.ObjectId,
      ref: "LetterOfApprovalHistory",
    },
  ],
});

const LetterOfApproval = mongoose.model(
  "LetterOfApproval",
  letterOfApprovalSchema
);

const historySchema = new Schema({
  createdOn: Date,
  detail: String,
  content: {
    originalname: String,
    url: String,
    filename: String,
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
  status: {
    type: String,
    enum: ["Under Editing by Student", "Under Review by Lecturers", "Accepted"],
  },
  statusOfFirstLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
  statusOfSecondLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Reviewed", "Accepted"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
});

const History = mongoose.model("History", historySchema);

const letterOfApprovalHistorySchema = new Schema({
  createdOn: Date,
  detail: String,
  file: {
    originalname: String,
    url: String,
    filename: String,
  },
  status: {
    type: String,
    enum: ["Waiting for Approval", "Approved"],
  },
  letterOfApproval: {
    type: Schema.Types.ObjectId,
    ref: "LetterOfApproval",
  },
  statusOfFirstLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Approved"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
  statusOfSecondLecturer: {
    code: {
      type: String,
      enum: ["Pending", "Approved"],
    },
    lecturer: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
    },
  },
});

const LetterOfApprovalHistory = mongoose.model(
  "LetterOfApprovalHistory",
  letterOfApprovalHistorySchema
);

const infoSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  audience: {
    type: String,
    enum: ["Student", "Lecturer"],
    required: true,
  },
  files: [
    {
      originalname: String,
      url: String,
      filename: String,
    },
  ],
});

const Question = mongoose.model("Question", infoSchema);
const Instruction = mongoose.model("Instruction", infoSchema);

module.exports = {
  Student: Student,
  Lecturer: Lecturer,
  Admin: Admin,
  Assignment: Assignment,
  Review: Review,
  LetterOfApproval: LetterOfApproval,
  History: History,
  LetterOfApprovalHistory: LetterOfApprovalHistory,
  Question: Question,
  Instruction: Instruction,
};
