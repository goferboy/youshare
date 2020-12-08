import React, { Component } from 'react';
import Search from './Search.jsx';
import YouTube from 'react-youtube';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queue: [],
            opts: {
                height: '390',
                width: '640',
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    enablejsapi: 1
                }
            },
            playerState: 0
        };

        //holds target for YouTube react element
        //assigns value once onReady is triggered.
        this.youTubeElem = {};
        
        //Listener for playlists added by all users via socket.io
        this.props.socket.on('playlist', (res) => {
            let queueBuffer = [...this.state.queue];
            queueBuffer.push(res);
            this.setState({
                queue: queueBuffer
            });
        });

        //listener for when video are puased or not
        this.props.socket.on('player-state', (res) => {
            console.log(res);
            this.setState({
                playerState: res.playerState
            });
            if (this.state.playerState === 1)
                this.youTubeElem.playVideo();
            else if (this.state.playerState === 2)
                this.youTubeElem.pauseVideo();
        });
        
        //figure out how to do this
        this.props.socket.on('user-leaves', (res) => {
            console.log(res);
        })
    };

    onReady = (event) => {
        this.youTubeElem = event.target;
    }

    broadcastToQueue = (result) => {
        this.props.socket.emit('playlist', {
            username: this.props.username,
            room: this.props.room, 
            video: result});
    }

    nextVideo = (event) => {
        console.log(event);
        let queueBuffer = [...this.state.queue];
        queueBuffer = queueBuffer.slice(1);
        console.log(queueBuffer);
        this.setState({
            queue: queueBuffer
        });
        if (queueBuffer.length) {
            event.target.playVideo();
            this.setState({
                playerState: event.target.getPlayerState()
            })
        }
        else {
            this.setState({
                playerState: event.target.getPlayerState()
            })
        };
    }

    playerStateHandler = (event) => {
        this.setState({
            playerState: event.target.getPlayerState()
        })
        if (this.state.playerState === 2) {
            this.props.socket.emit('player-state', {playerState: 2, room: this.props.room});
        }
        else if (this.state.playerState === 1) {
            this.props.socket.emit('player-state', {playerState: 1, room: this.props.room});
        }
    }
    
    onError = (event) => {
        console.log("Error loading video: " + event.data)
        this.nextVideo(event);
    }

    render() {
        let currentVideoID;
        if (!this.state.queue.length) {
            currentVideoID = null;
        }
        else {
            currentVideoID = this.state.queue[0].video.id.videoId
        };
        
        return (
            <div className="player">
                <div className="video">
                    <YouTube
                        id="YouTube-Video"
                        videoId={currentVideoID}
                        opts={this.state.opts}
                        onReady={this.onReady}
                        onEnd={this.nextVideo}
                        onError={this.onError}
                        onStateChange={this.playerStateHandler}
                    />
                </div>
                <div className="queue">
                    <ol>
                        {
                            this.state.queue.map((item) => {
                                return (
                                    <div className="queue-item" id={item.video.id.videoId}>
                                        <li>
                                            <img src={item.video.snippet.thumbnails.default.url} />
                                            <p>{item.video.snippet.title}</p>
                                            <p>from {item.username}</p>
                                        </li>
                                    </div>
                                );
                            })
                        }
                    </ol>
                </div>
                <Search addToQueue={this.broadcastToQueue}/>
            </div>
        );
    }
}

export default Player;
