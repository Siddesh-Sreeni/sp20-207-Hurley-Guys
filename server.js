var express = require("express");
var login = require("./routes/loginroutes");
var messageRoute = require("./routes/messageroutes");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
var router = express.Router();
// test route
router.get("/", function(req, res) {
  res.json({ message: "welcome to our upload module apis" });
});

//mongo

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://junlan:abcdefg@123@cluster0-ghofm.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, poolSize: 100 }
  )
  .then(result => {
    console.log("connected to mongo");
  })
  .catch(err => {
    console.log(err);
  });
//route
router.post("/register", login.register);
router.post("/login", login.login);
router.get("/getMessageList", messageRoute.getMessageList);
router.get("/sendMessage", messageRoute.sendMessage);
router.get("/getChatRoom", messageRoute.getChatRoom);
app.use("/api", router);
app.listen(5000);
