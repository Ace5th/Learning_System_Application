const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = Review;
