const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

letterOfApprovalHistorySchema.virtual("realStatus").get(function () {
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

const LetterOfApprovalHistory = mongoose.model("LetterOfApprovalHistory", letterOfApprovalHistorySchema);

module.exports = LetterOfApprovalHistory;
