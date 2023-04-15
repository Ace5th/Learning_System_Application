const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

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
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

lecturerSchema.plugin(passportLocalMongoose);

const Lecturer = mongoose.model("Lecturer", lecturerSchema);

module.exports = Lecturer;
