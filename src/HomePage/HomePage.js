import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Avatar, List, ListItem } from "material-ui";
import { Grid, Row, Col } from "react-flexbox-grid";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatRooms: []
    };
    axios.get("http://localhost:5000/api/getChatRoom").then(response => {
      console.log(response.data);
      this.setState({
        chatRooms: this.state.chatRooms.concat(response.data)
      });
    });
  }
  toggleDrawer = () => this.setState({ open: !this.state.open });
  render() {
    return (
      <div>
        <div className="container">{this.props.children}</div>
        <h4>Chart Rooms</h4>
        <List>
          {this.state.chatRooms.map(chatRoom => (
            <Grid fluid key={chatRoom._id}>
              <Row center="lg" style={RowItemStyle}>
                <Link
                  to={{
                    pathname: "/messagePage",
                    data: chatRoom
                  }}
                >
                  Enter Chat Rooms
                </Link>
                <Col xs={6} sm={6} lg={4}>
                  {chatRoom.userName}
                </Col>
              </Row>
            </Grid>
          ))}
        </List>
      </div>
    );
  }
}
const RowItemStyle = {
  alignItems: "center"
};
export default HomePage;
