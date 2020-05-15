var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var cookie= require("react-cookies");
const express = require('express');
const app = express();
const axios = require('axios')

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// connect string for mongodb server running locally, connecting to a database called test
var url = "mongodb://127.0.0.1:27017";
const dbName = "messageApp";
var mongodb;
const options1 = {
  useUnifiedTopology: true
};

const mongoose = require("mongoose");
const chatroom = require("../schema/chatroom_model");
const message = require("../schema/message_model");

const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('User Disconnected');
  });
  socket.on('Hello', function (msg) {
    console.log('message: ' + msg);
    socket.broadcast.emit('typ_msg', msg + ' typing...');
  });
  socket.on('keyUp', function (msg) {
    socket.broadcast.emit('keyUp_msg', '');
  })
});
io.listen(8000);

exports.getMessageList = function (req, res) {
  console.log("Print id  " + req.query.roomId);
 

  message.find({ roomId: req.query.roomId }, function (err, doc) {
    if (doc) {
      console.log("doc found");
      console.log(doc);
      var messages = [];
      index = 0;
      let loopArray = (arr)=>{
        let proceed = ()=>{
          index++;
          if(index < doc.length){
            loopArray(arr)
          }else{
            res.send(messages);
          }
        };
        console.log("Sending Request Number = "+index);
      let id = doc[index]._id
      axios.get('http://10.0.0.81:5000/getMessage?messageId=' + id).then((response) => {
            console.log(response.data);
            let resp = response.data || {}
            var message = {
              messageId: id,
              message: resp.message,
              //sentBy: doc[index].userId
            };
            messages.push(message);
            proceed()
          }).catch(e=>{console.log("ERROR 501");proceed();});
      };
      if(doc.length){
        loopArray(doc)
      }
      else{
        res.send([]);
      }
      

     } else {
      console.log("NO doc found");
      console.log(err);
    }
  });
};

exports.sendMessage = function (req, res) {
  var content = req.query.messages;
  var roomId = req.query.roomId;
  console.log("send Message req section", content);

  var today = new Date();

  const message1 = new message({
    _id: new mongoose.Types.ObjectId(),
    message: content,
    roomId: roomId,
    //userId: emailid,
    created: today
  });
  message1
    .save()
    .then(resul => {
      console.log("send Message Saved", resul);

      //call to the other component
      axios.post('http://10.0.0.81:5000/addMessage', {
        messageId: resul._id,
        message: resul.message
      },{
        headers : {
          'Content-Type' : 'application/json'
        }
      })
        .then((res) => {

          console.log(res.success)
        })
        .catch((error) => {
          console.error(error)
        })



      console.log("message enrolled");
      res.send({
        code: 200,
        success: "User registered sucessfully",
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getChatRoom = function (req, res) {
  chatroom.find({}, function (err, doc) {
    if (doc) {
      console.log("doc found");
      console.log(doc);
      res.send(doc);
    } else {
      console.log("NO doc found");
      console.log(err);
    }
  });
};
