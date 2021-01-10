require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const { socketServer } = require("./socketServer");

const routes = require("./routes/allRoutes");

const app = express();

const port = process.env.PORT || 5000;
const mongo_uri = process.env.MONGO_URI;
const db_name = process.env.DB_NAME;

//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session Custom options
app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: parseInt(process.env.SESS_LIFETIME, 10),
      sameSite: true,
    },
  })
);

// CORS setup
app.use(cors());

routes(app);

//mongodb connection
mongoose.Promise = global.Promise;
mongoose.connect(
  `${mongo_uri}/${db_name}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log("Connected to MongoDB")
);

const server = app.listen(port, () => {
  console.log("server is listening on : " + port);
});

const socket = require("socket.io");
const io = new socket.Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//setup socket server
socketServer(io);

// io.on("connection", (socket) => {
//   socket.on("hey", (data) => {
//     console.log(data);
//   });
//   socket.on("disconnect", () => {
//     console.log("User Disconnected");
//   });
// });
