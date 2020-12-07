import React, { Component } from 'react';
import io from 'socket.io-client';
//import { BrowserRouter as Router, Route, Link, Switch, } from 'react-router-dom';
import './App.css';
import PlayerWithSocket from './components/Player.jsx';

const socket = io('http://localhost:8000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      room: '',
      enteredRoom: false
    }
  }
  
  handleChange = (event) =>
  this.setState({
    [event.target.name]: event.target.value
  });
  
  joinRoom = () => {
    //find room in database, if found, login and load room
    console.log(this.state.room);
    try{
      fetch('http://localhost:8000/api/sessions/' + this.state.room).then(
        (res) => {
          return res.json();
        }
      ).then((result) => {
        console.log(result);
        if (result.status.code === 404) {
          fetch('http://localhost:8000/api/sessions/', {
            method: 'POST',
            body: JSON.stringify({
              room_name: this.state.room
            }),
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            return res.json();
          }).then((data) => {
            console.log(data);
          }).catch((err) => {console.error({'Error': err})});
        }
      }).catch((err) => {console.error({'Error': err})});
     }
    catch(err) {
      console.log(err);
    }
    try{
      // socket.on('connect', () => {
        socket.emit('connection', {username: this.state.username, room: this.state.room}, (res) => {
          console.log(res);
        });
      // });
      this.setState({
        enteredRoom: true
      })
    }
    catch(err) {
      console.log(err)
    }
  };

  render() {
    return (
        <div className="App">
          {
            this.state.enteredRoom
            ? <PlayerWithSocket username={this.state.username} socket={socket}/>
            :
              <div className="sign-in">
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Enter a name" 
                  onChange={this.handleChange} 
                  required 
                />
                <input 
                  type="text" 
                  name="room" 
                  placeholder="Enter room name" 
                  onChange={this.handleChange} 
                  required 
                />
                <button onClick={this.joinRoom}>Submit Username</button>
              </div>
          }
        </div>
    );
  }
}

export default App;
