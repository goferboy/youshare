import React, { Component } from 'react';
import io from 'socket.io-client';
//import { BrowserRouter as Router, Route, Link, Switch, } from 'react-router-dom';
import './App.css';
import Playlist from './components/Playlist.jsx';


//
// socket.on('connect', () => {
//   socket.emit('connection', {data: "HELLOOOOO"});
//   socket.on('connection', (res) => {
//     console.log(res);
//   });
// });

// try {
//   fetch('http://localhost:8000/api/sessions').then((res) => {
//     return res.json();
//   }).then((data) => {
//     console.log(data);
//   });
// }
// catch(err) {
//   console.log(err);
// }



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      //room: ''
    }
  }

  handleChange = (event) =>
  this.setState({
    [event.target.name]: event.target.value
  });

  // joinRoom = () => {
  //   const socket = io('http://localhost:8000');
  //   socket.on('connect', () => {
  //     socket.emit('connection', {data: "HELLOOOOO"});
  //     socket.on('connection', (res) => {
  //       console.log(res);
  //     });
  //     socket.emit('join', {username: this.state.username, room: this.state.room});
  //     socket.on('join', (res) => {console.log(res)}); 
  //   });
  // };

  render() {
    return (
      <div className="App">
        <input 
          type="text" 
          name="username" 
          placeholder="Enter a name" 
          onChange={this.handleChange} 
          required />
        <button onClick={this.joinRoom}>Submit Username</button>
        <Playlist />
      </div>
    );
  }
}

export default App;
