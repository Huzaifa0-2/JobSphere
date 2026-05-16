// const multer = require("multer");

// // store in memory (NOT disk)
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB
// });

// module.exports = upload;

const multer = require("multer");

// store in memory of server (NOT disk)
const storage = multer.memoryStorage(); // memory (important)

const upload = multer({ storage });

module.exports = upload;