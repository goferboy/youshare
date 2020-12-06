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
      enteredRoom: false
    }
  }
  
  handleChange = (event) =>
  this.setState({
    [event.target.name]: event.target.value
  });
  
  join = () => {
    try {
      // socket.on('connect', () => {
        socket.emit('connection', {username: this.state.username}, (res) => {
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
                <button onClick={this.join}>Submit Username</button>
              </div>
          }
        </div>
    );
  }
}

export default App;
