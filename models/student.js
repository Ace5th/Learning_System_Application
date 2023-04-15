const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Assignment= require("./assignment");
const Lecturer= require("./assignment");
const passportLocalMongoose = require("passport-local-mongoose");

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

studentSchema.plugin(passportLocalMongoose);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
