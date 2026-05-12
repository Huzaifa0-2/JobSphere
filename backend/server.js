// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");

// dotenv.config();

// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/jobs", require("./routes/jobRoutes"));

// app.use("/applications", require("./routes/applicationRoutes"));

// app.use("/users", require("./routes/userRoutes"));

// app.use("/profile", require("./routes/profileRoutes"));

// app.use("/resume", require("./routes/resumeRoutes"));

// app.use("/notifications", require("./routes/notificationRoutes"));

// // Gemini AI
// app.use("/ai", require("./routes/aiRoutes"));



// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);

// });


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/jobs", require("./routes/jobRoutes"));
app.use("/applications", require("./routes/applicationRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/notifications", require("./routes/notificationRoutes"));
app.use("/ai", require("./routes/aiRoutes"));


// CREATE HTTP SERVER
const server = http.createServer(app);


// SOCKET.IO SERVER
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

global.io = io;

// STORE SOCKET USERS
global.onlineUsers = {};


// CONNECTION
io.on("connection", (socket) => {

  console.log("User connected:", socket.id);

  // REGISTER USER
  socket.on("register", (userId) => {

    global.onlineUsers[userId] = socket.id;

    console.log("Registered:", userId);
  });

  // DISCONNECT
  socket.on("disconnect", () => {

    console.log("Disconnected:", socket.id);

    for (const userId in global.onlineUsers) {

      if (global.onlineUsers[userId] === socket.id) {
        delete global.onlineUsers[userId];
      }
    }
  });
});


// START SERVER
server.listen(process.env.PORT, () => {

  console.log(
    `Server running on port ${process.env.PORT}`
  );
});