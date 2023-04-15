const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema({
  createdOn: Date,
  detail: String,
  content: {
    originalname: String,
    url: String,
    filename: String,
  },
  assignment: {
    type: Schema.Types.ObjectId,
    ref: "Assignment",
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

historySchema.virtual("realStatus").get(function () {
  const pending = "Under Review by Lecturers";
  const editing = "Under Editing by Student";
  const accepted = "Accepted";
  const st = this.status;
  const sfl = this.statusOfFirstLecturer.code;
  const ssl = this.statusOfSecondLecturer.code;
  if (st == "Under Review by Lecturers") {
    if (sfl == "Accepted" && ssl == "Accepted") {
      return accepted;
    } else if (sfl == "Reviewed" && ssl == "Reviewed") {
      return editing;
    } else if (sfl == "Pending" || ssl == "Pending") {
      return pending;
    }
  }
});

const History = mongoose.model("History", historySchema);

module.exports = History;
