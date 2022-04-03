import React from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input"

function valueIsSet(value)
{
    return (value && value.trim() !== "")
}

let name;
while (!valueIsSet(name)) {
    name = prompt("Unesi svoje ime");
}
 
function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

export default class App extends React.Component  {
  state = {
    messages: [],
    member: {
      username: name,
      color: randomColor()
    }
  }
  constructor() {
    super();
    this.drone = new window.Scaledrone("B2lcfuUxxSTYzp7I", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
      
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }
  

  render() {
    return (
      <div className="App">
        <h1>Dobrodošao {name}</h1>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
        onSendMessage={this.onSendMessage}
      />
      </div>

    );
  }
  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }
}


