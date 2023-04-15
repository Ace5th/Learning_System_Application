const mongoose = require("mongoose");
const {
  Student,
  Lecturer,
  Admin,
  Assignment,
  Review,
  LetterOfApproval,
  History,
  LetterOfApprovalHistory,
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
  await LetterOfApprovalHistory.deleteMany({});
  await Question.deleteMany({});
  await Instruction.deleteMany({});
};
// /////////////////////////////////////////

// /////////////////////////////////////////
///ORIGINAL DB WITH USABLE SALT & HASH
// const StudentDb = new Student({
//   name: "origin",
//   email: "origin@gmail.com",
//   username: "1511",
//   password: 123,
//   salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
//   hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
// });
// /////////////////////////////////////////

// /////////////////////////////////////////
const seedDB = async () => {
  await cleanSlate();
  const StudentDb1 = new Student({
    name: "Ajie Maaz Muawwaz",
    email: "ajie@gmail.com",
    username: "110311031103",
    phoneNumber: "085796059660",
    department: "Accounting",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const StudentDb2 = new Student({
    name: "Muhammad Gazali",
    email: "gazali@gmail.com",
    username: "130313031303",
    phoneNumber: "085422381223",
    department: "Management",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const StudentDb3 = new Student({
    name: "Asturi Miyana",
    email: "astur@gmail.com",
    username: "232232232232",
    phoneNumber: "085422382421",
    department: "Accounting",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const LecturerDb1 = new Lecturer({
    name: "Ridho Muhammad Purnomosidi",
    email: "acelightning9@gmail.com",
    username: "280528052805",
    department: "Accounting",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const LecturerDb2 = new Lecturer({
    name: "Muhammad Fitra",
    email: "fitra@gmail.com",
    username: "280128012801",
    department: "Accounting",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const LecturerDb3 = new Lecturer({
    name: "Faisal Riyadi",
    email: "faisal@gmail.com",
    username: "150415041504",
    department: "Accounting",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const AdminDb1 = new Admin({
    name: "Shavira Zalshabila",
    email: "ajie.muawwaz@gmail.com",
    username: "040604060406",
    department: "Dean Associate",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const AdminDb2 = new Admin({
    name: "Syafri Anto",
    email: "syafri@gmail.com",
    username: "123412341234",
    department: "Accounting",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const AdminDb3 = new Admin({
    name: "Anastasia Putri",
    email: "anas@gmail.com",
    username: "567856785678",
    department: "Management",
    salt: "898eddf5f1b810ece8328099850b1207acc9c7e51e4b3720bb7c0a3aef89dd14",
    hash: "2cc00d413ac90206010163158007c2cb51ffe8866a92cafcf10c3c45b48e4ac62abcc2fee65097e396cda3124cff4d602b4a6ef3d31f64bbe47db4536a8b77a503738d035501c8d8ca8275454a117e6f916d998f5ba3de599cb031f439957041461a6fe1018be1fdf84696ca383e05bc0218653f4a287cc240e0382b954982536a6a644f8c1bb2e7ca4b8d2da8cf1be1b76af66302199740d1dcae68f4a73d6c3643fb308b21497ea9c703ea8d70e5027c9158a5bf2c292863c61b1c162bcf1e1e635dcd5aa5302e5cbce3b26c4d6babf8fe40d11d8e1700539f946fe6c322af72bab4b4598289559ae1897eacd724ab83181be144f09a336fdb895e495fa2d5087e4ba5fe7230c647c199159e701d70f5a1dc4b58ad020d260fe0e31e53f8fcb562e61c276e996560fb15f3b581eb5819b0e2eb63ceaf9cf3c9bdeba8b7262dbf66b3648abc80a480505f8b9dd4fa310f5190a50545fa4efc8945ae4577be2cc71e82ab5de77b379b82e34d12829b06578f33cb30cb0894f751080f3baffd0e924bd18512730dc7b7a61de7d6159404415419d110b395892c06237afb6ea87d244198bdef5cecfb28627167a966c8254643f88b54d2fd6f25ed84954bfb84be94d5347309ee1a441b505c0e70a50fc3b57d650d174f8d074dbfb9ed81ac5575e42c4921ba0d125bcde9e15b9734dc3acbfabd0c3fe843bd3023022bbb4943c1",
  });
  const AssignmentDb1 = new Assignment({
    title: "Understanding Qualitative Methods",
    content: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    phase: "Phase 1",
    time: {
      createdOn: Date.now(),
      updatedOn: Date.now(),
      expiresOn: Date.now() + 1000 * 60 * 60 * 24 * 7 * 2,
    },
    status: "Under Review by Lecturers",
  });
  const AssignmentDb2 = new Assignment({
    title: "Understanding Quantitative Methods",
    content: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    phase: "Phase 1",
    time: {
      createdOn: Date.now(),
      updatedOn: Date.now(),
      expiresOn: Date.now() + 1000 * 60 * 60 * 24 * 7 * 2,
    },
    status: "Under Review by Lecturers",
  });
  const AssignmentDb3 = new Assignment({
    title: "Understanding Quantitative Methods 2",
    content: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    phase: "Phase 1",
    time: {
      createdOn: Date.now(),
      updatedOn: Date.now(),
      expiresOn: Date.now() + 1000 * 60 * 60 * 24 * 7 * 2,
    },
    status: "Accepted",
  });
  const AssignmentDb4 = new Assignment({
    title: "Understanding Quantitative Methods 3",
    content: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    phase: "Phase 2",
    time: {
      createdOn: Date.now(),
      updatedOn: Date.now(),
      expiresOn: Date.now() + 1000 * 60 * 60 * 24 * 7 * 2,
    },
    status: "Accepted",
  });
  const ReviewDb1 = new Review({
    data: [
      {
        title: "Chapter 1",
        content: "Very Good, need a little more flair",
      },
    ],
    file: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    createdOn: new Date(),
  });
  const LetterOfApprovalDb1 = new LetterOfApproval({
    file: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    time: {
      createdOn: Date.now(),
      updatedOn: Date.now(),
      expiresOn: Date.now() + 1000 * 60 * 60 * 24 * 7 * 2,
    },
    status: "Waiting for Approval",
  });
  const HistoryDb1 = new History({
    createdOn: new Date(),
    detail: "Student has created an assignment",
    content: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    status: "Under Review by Lecturers",
  });
  const HistoryDb2 = new History({
    createdOn: new Date(),
    detail: "Lecturer has sent a review",
    content: {
      originalname:
        "Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      url: "https://res.cloudinary.com/dpghf08pr/image/upload/v1661760167/UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk.pdf",
      filename:
        "UNHAS-SISTA/STUDENT-UPLOAD/Criminological_Research_Understanding_Qualitative_Methods_w0iruk",
    },
    status: "Under Review by Lecturers",
  });
  const QuestionDb1 = new Question({
    title: "How to log in?",
    content: "Click on the login button",
    audience: "Student",
  });
  const QuestionDb2 = new Question({
    title: "How to log out?",
    content: "Click on the logout button",
    audience: "Student",
  });
  const InstructionDb1 = new Instruction({
    title: "Learning the instruction",
    content: "You can learn how to do use SISTA through the 'How To' page",
    audience: "Student",
  });
  const InstructionDb2 = new Instruction({
    title: "Learning about SISTA",
    content: "You can learn more about SISTA through the 'About' page",
    audience: "Student",
  });
  // /////////////////////////////////////

  // /////////////////////////////////////////
  AssignmentDb1.statusOfFirstLecturer.lecturer = LecturerDb1;
  AssignmentDb1.statusOfSecondLecturer.lecturer = LecturerDb2;
  AssignmentDb1.statusOfFirstLecturer.code = "Reviewed";
  AssignmentDb1.statusOfSecondLecturer.code = "Pending";
  AssignmentDb2.statusOfFirstLecturer.lecturer = LecturerDb2;
  AssignmentDb2.statusOfSecondLecturer.lecturer = LecturerDb3;
  AssignmentDb2.statusOfFirstLecturer.code = "Pending";
  AssignmentDb2.statusOfSecondLecturer.code = "Accepted";
  AssignmentDb3.statusOfFirstLecturer.lecturer = LecturerDb1;
  AssignmentDb3.statusOfSecondLecturer.lecturer = LecturerDb3;
  AssignmentDb3.statusOfFirstLecturer.code = "Accepted";
  AssignmentDb3.statusOfSecondLecturer.code = "Accepted";
  AssignmentDb4.statusOfFirstLecturer.lecturer = LecturerDb1;
  AssignmentDb4.statusOfSecondLecturer.lecturer = LecturerDb3;
  AssignmentDb4.statusOfFirstLecturer.code = "Accepted";
  AssignmentDb4.statusOfSecondLecturer.code = "Accepted";
  HistoryDb1.statusOfFirstLecturer.code = "Pending";
  HistoryDb1.statusOfSecondLecturer.code = "Pending";
  HistoryDb1.statusOfFirstLecturer.lecturer = LecturerDb1;
  HistoryDb1.statusOfSecondLecturer.lecturer = LecturerDb2;
  HistoryDb2.statusOfFirstLecturer.code = "Reviewed";
  HistoryDb2.statusOfSecondLecturer.code = "Pending";
  HistoryDb2.statusOfFirstLecturer.lecturer = LecturerDb1;
  HistoryDb2.statusOfSecondLecturer.lecturer = LecturerDb2;
  StudentDb1.firstLecturer = LecturerDb1;
  StudentDb1.secondLecturer = LecturerDb2;
  StudentDb2.firstLecturer = LecturerDb2;
  StudentDb2.secondLecturer = LecturerDb3;
  StudentDb3.firstLecturer = LecturerDb1;
  StudentDb3.secondLecturer = LecturerDb3;
  StudentDb1.assignments.push(AssignmentDb1);
  StudentDb2.assignments.push(AssignmentDb2);
  StudentDb3.assignments.push(AssignmentDb3);
  StudentDb3.assignments.push(AssignmentDb4);
  StudentDb3.letterOfApproval = LetterOfApprovalDb1;
  LecturerDb1.students.push(StudentDb1, StudentDb3);
  LecturerDb2.students.push(StudentDb1, StudentDb2);
  LecturerDb3.students.push(StudentDb2, StudentDb3);
  AssignmentDb1.author = StudentDb1;
  AssignmentDb2.author = StudentDb2;
  AssignmentDb3.author = StudentDb3;
  AssignmentDb4.author = StudentDb3;
  ReviewDb1.author = LecturerDb1;
  LetterOfApprovalDb1.author = StudentDb3;
  LetterOfApprovalDb1.statusOfFirstLecturer.code = "Pending";
  LetterOfApprovalDb1.statusOfFirstLecturer.lecturer = LecturerDb1;
  LetterOfApprovalDb1.statusOfSecondLecturer.code = "Approved";
  LetterOfApprovalDb1.statusOfSecondLecturer.lecturer = LecturerDb3;
  HistoryDb2.review = ReviewDb1;
  AssignmentDb1.reviews.push(ReviewDb1);
  AssignmentDb1.histories.push(HistoryDb1, HistoryDb2);
  // /////////////////////////////////////////

  // /////////////////////////////////////////
  await StudentDb1.save();
  await StudentDb2.save();
  await StudentDb3.save();
  await LecturerDb1.save();
  await LecturerDb2.save();
  await LecturerDb3.save();
  await AdminDb1.save();
  await AdminDb2.save();
  await AdminDb3.save();
  await AssignmentDb1.save();
  await AssignmentDb2.save();
  await AssignmentDb3.save();
  await AssignmentDb4.save();
  await ReviewDb1.save();
  await LetterOfApprovalDb1.save();
  await HistoryDb1.save();
  await HistoryDb2.save();
  await QuestionDb1.save();
  await QuestionDb2.save();
  await InstructionDb1.save();
  await InstructionDb2.save();
  // /////////////////////////////////////////
};

seedDB().then(() => {
  db.close();
});
