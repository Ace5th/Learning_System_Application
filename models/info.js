const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

module.exports = { Question, Instruction };
