const mongoose = require("mongoose");
const user = require("../schema/user_model");
exports.register = function(req, res) {
  var today = new Date();

  const user1 = new user({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    isTyping: false,
    created: today
  });
  user1
    .save()
    .then(resul => {
      console.log(resul);
      console.log("user enrolled");
      res.send({
        code: 200,
        success: "User registered sucessfully"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log("in login");

  user.find({ email: req.body.email }, function(err, doc) {
    if (doc) {
      console.log("doc found");
      console.log(doc);
      //console.log(doc[0].name);
      var user = doc[0];
      if (user.password == password) {
        res.send({
          id: user._id,
          firstName: user.name,
          lastName: "",
          email: user.email
        });
        res.end("sucessfull login");
      } else {
        console.log("password doesnt match");
        console.log("error ocurred", err);
        res.writeHead(401, {
          "Content-Type": "text/plain"
        });
        res.end("Fail login");
      }
    } else {
      console.log("Email does not exist");
      console.log("error ocurred", err);
      res.writeHead(401, {
        "Content-Type": "text/plain"
      });
      res.end("Fail login");
    }
  });
};
