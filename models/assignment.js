const mongoose = require("mongoose");
const Review = require("./review");
const History = require("./history");
const Schema = mongoose.Schema;

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

assignmentSchema.virtual("realStatus").get(function () {
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
    } else if (
      (sfl == "Accepted" && ssl == "Reviewed") ||
      (sfl == "Reviewed" && ssl == "Accepted")
    ) {
      return editing;
    } else if (
      (sfl == "Accepted" && ssl == "Pending") ||
      (sfl == "Pending" && ssl == "Accepted")
    ) {
      return pending;
    }
  }
});

assignmentSchema.virtual("elapsedTime").get(function () {
  return this.time.expiresOn.getTime() - this.time.updatedOn.getTime();
});

assignmentSchema.virtual("elapsedTimeDay").get(function () {
  const dayExpiring = this.time.expiresOn.getTime() / 1000 / 60 / 60 / 24;
  const dayUpdated = this.time.updatedOn.getTime() / 1000 / 60 / 60 / 24;
  return dayExpiring - dayUpdated;
});

assignmentSchema.post("findOneAndDelete", async function (doc) {
  if (doc.reviews.length) {
    const reviewDel = await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
  if (doc.histories.length) {
    const historyDel = await History.deleteMany({
      _id: { $in: doc.histories },
    });
  }
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
