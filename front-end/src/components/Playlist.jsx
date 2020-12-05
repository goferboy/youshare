import React, { Component } from 'react';
//import io from 'socket.io-client';
//import { BrowserRouter as Router, Route, Link, Switch, } from 'react-router-dom';

class Playlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playlist: [],
            query: '',
            searchResults: []
        }
    };

    searchResults = () => {
        console.log(this.state.query);
        fetch('https://youtube.googleapis.com/youtube/v3/search?part=id,snippet&q=' 
        + this.state.query + '&maxResults=5&key=' 
        + process.env.REACT_APP_API_KEY).then((res) => {
            return res.json();
        }).then((data) => {
            this.setState({
                searchResults: data.items
            });
        })
    }

    addToQueue = (result) => {
        const playlistBuffer = [...this.state.playlist];
        playlistBuffer.push(result);
        console.log(playlistBuffer);
        this.setState({
            playlist: playlistBuffer
        });
    }

    handleChange = (event) =>
        this.setState({
            [event.target.name]: event.target.value
    });

    render() {
        return (
            <div className="playlist">
                <div className="search">
                    <input type="text" name="query" onChange={this.handleChange} placeholder="Search For Videos" />
                    <button type="button" onClick={this.searchResults}>Search YouTube</button>
                </div>
                <div className="search-results"></div>
                    <ul>
                        {
                            this.state.searchResults.map((result) => {
                                return (
                                    <div className="result-item" id={result.id.videoId}>
                                        <li>
                                            <img src={result.snippet.thumbnails.default.url} />
                                            <p>{result.snippet.title}</p>
                                            <button onClick={()=> this.addToQueue(result)}>+</button>
                                        </li>
                                    </div>
                                );
                            })
                        }
                    </ul>
                <div className="queue">
                    <ol>
                        {
                            this.state.playlist.map((item) => {
                                return (
                                    <div className="playlist-item" id={item.id.videoId}>
                                        <li>
                                            <img src={item.snippet.thumbnails.default.url} />
                                            <p>{item.snippet.title}</p>
                                        </li>
                                    </div>
                                );
                            })
                        }
                    </ol>
                </div>
            </div>
        );
    }
}

export default Playlist;
