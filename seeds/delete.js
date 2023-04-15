const mongoose = require("mongoose");
const {
  Student,
  Lecturer,
  Admin,
  Assignment,
  Review,
  LetterOfApproval,
  History,
  LoaHistory,
  Question,
  Instruction,
} = require("./models.js");

mongoose.connect("mongodb://localhost:27017/unhas-sista", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection  error:"));
db.once("open", () => {
  console.log("Database connected");
});

const cleanSlate = async () => {
  await Student.deleteMany({});
  await Lecturer.deleteMany({});
  await Admin.deleteMany({});
  await Assignment.deleteMany({});
  await Review.deleteMany({});
  await LetterOfApproval.deleteMany({});
  await History.deleteMany({});
  await LoaHistory.deleteMany({})
  await Question.deleteMany({});
  await Instruction.deleteMany({});
};

const seedDB = async () => {
  await cleanSlate();
};

seedDB().then(() => {
  db.close();
});
