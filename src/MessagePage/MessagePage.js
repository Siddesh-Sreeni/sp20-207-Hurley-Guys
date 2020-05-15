import React from "react";
import "./style.css";
import axios from "axios";
///
// const process = require('process');
// process.stdin.setEncoding('utf8');
///
// const readline = require('readline');
// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

// var stdin = process.stdin;
// stdin.setRawMode(true);
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');


const DUMMY_DATA = [
  {
    senderId: "perborgen",
    text: "who'll win?"
  },
  {
    senderId: "janedoe",
    text: "who'll win?"
  },
  {
    senderId: "Junlan",
    text: "hello"
  }
];
///

///
class MessagePage extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props.location;
    console.log("print data");
    console.log(data);
    this.state = {
      fake_messages: DUMMY_DATA,
      messages: [],
      roomId: data._id,
      typing_state: false,
      typing_msg: '',
      mssg: ''
    };
    this.sendSocketIO = this.sendSocketIO.bind(this);
  }

  /*Getting messages from the backend every 1 second */
  componentDidMount() {
    // this.msg.addEventListener('keydown', event => {
    //   this.setState({
    //         typing_msg: <p>Typing...</p>
    //   })
    // })
    socket.on('typ_msg', (msg)=>{
      console.log('MSG ', msg);
      console.log('Room_id',data._id);
      this.setState({
        typing_msg:  <p>{msg}</p>
      })
    });

    socket.on('keyUp_msg', (msg)=>{
      this.setState({
        typing_msg: msg
      })
    });

    var self = this;
    const { data } = this.props.location;
    // process.stdin.on('keypress', (key, press)=>{
    //   this.setState({
    //     typing_msg: <p>Typing...</p>
    //   })
    // })
    setInterval(function() {
      axios
        .get("http://localhost:5000/api/getMessageList", {
          params: {
            roomId: data._id
          }
        })
        .then(response => {
          console.log(response);
          self.setState({
            messages: response.data
          });
        });
    }, 4000);
  }


  sendSocketIO() {
    socket.emit('example_message', 'demo');
  }
  render() {
    // socket.on('onkeypress', (data)=>{
    //   console.log('Data ', data) 
    //   this.setState({
    //     typing_msg: <p>Typing...</p>
    //   })
    // })
    
    return (
      <div className="app">
        <Title />
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages} //dummy data change later
        />
        
        <div>

            {this.state.typing_msg}
            
         
        <SendMessageForm roomId={this.state.roomId}/>
        </div>
        
      </div>
      
    );
  }
}
class MessageList extends React.Component {
  render() {
    return (
      <ul className="message-list">
        {this.props.messages.map((message, index) => {
          return (
            <li key={message.id} className="message">
              <div>{message._id}</div>
              <div>{message.message}</div>
            </li>
          );
        })}
      </ul>
    );
  }
}
class SendMessageForm extends React.Component {
  constructor(props) {
    super(props);
    const roomId = this.props.roomId;
    console.log("print roomId");
    console.log(roomId);

    this.state = {
      message: "",
      roomId: roomId
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    var new_messages = this.state.message;
    console.log(new_messages);

    const roomId = this.state.roomId;
    console.log("print roomId");
    console.log(this.state.roomId);

    axios
      .get("http://localhost:5000/api/sendMessage", {
        params: {
          messages: new_messages,
          roomId: roomId
        }
      })
      .then(response => {
        //get from backend
        console.log("Response from Send Message API",response);
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="send-message-form">
        <input
          onChange={this.handleChange}
          value={this.state.message}
          placeholder="Type your message and hit ENTER"
          type="text"
          onKeyDown={()=>{
            socket.emit('Hello', this.state.roomId);
          }}
          onKeyUp={()=>{
            socket.emit('keyUp', '');
          }}
        />
        <button type="submit"  value="SubmitMessages" onClick={this.handleSubmit.bind(this)}>Submit</button>
      </form>
    );
  }
}

function Title() {
  return <p className="title">My Chat Room</p>;
}
export default MessagePage;

