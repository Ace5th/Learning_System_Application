const mongoose = require("mongoose");
const LetterOfApprovalHistory = require("./letterOfApprovalHistory");
const Schema = mongoose.Schema;

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
  author: {
    type: Schema.Types.ObjectId,
    ref: "Student",
  },
  status: {
    type: String,
    enum: ["Waiting for Approval", "Approved"],
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

letterOfApprovalSchema.virtual("realStatus").get(function () {
  const pending = "Waiting for Approval";
  const accepted = "Approved";
  const st = this.status;
  const sfl = this.statusOfFirstLecturer.code;
  const ssl = this.statusOfSecondLecturer.code;
  if (st == "Waiting for Approval") {
    if (sfl == "Approved" && ssl == "Approved") {
      return accepted;
    } else if (sfl == "Pending" && ssl == "Pending") {
      return pending;
    } else if (
      (sfl == "Approved" && ssl == "Pending") ||
      (sfl == "Pending" && ssl == "Approved")
    ) {
      return pending;
    }
  }
});

letterOfApprovalSchema.virtual("elapsedTime").get(function () {
  return this.time.expiresOn.getTime() - this.time.updatedOn.getTime();
});

letterOfApprovalSchema.virtual("elapsedTimeDay").get(function () {
  const dayExpiring = this.time.expiresOn.getTime() / 1000 / 60 / 60 / 24;
  const dayUpdated = this.time.updatedOn.getTime() / 1000 / 60 / 60 / 24;
  return dayExpiring - dayUpdated;
});

letterOfApprovalSchema.post("findOneAndDelete", async function (doc) {
  if (doc.histories.length) {
    const historyDel = await LetterOfApprovalHistory.deleteMany({
      _id: { $in: doc.histories },
    });
  }
});

const LetterOfApproval = mongoose.model(
  "LetterOfApproval",
  letterOfApprovalSchema
);

module.exports = LetterOfApproval;
