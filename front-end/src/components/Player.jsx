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
                    controls: 0
                }
            },
            playerState: 0
        };
    };

    addToQueue = (result) => {
        const queueBuffer = [...this.state.queue];
        queueBuffer.push(result);
        this.setState({
            queue: queueBuffer
        });
    };

    nextVideo = (event) => {
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
    }
    
    onError = (event) => {
        console.log("Error loading video: " + event.data)
        this.nextVideo(event);
    }

    render() {
        let nextVideoID;
        if (!this.state.queue.length) {
            nextVideoID = null;
        }
        else {
            nextVideoID = this.state.queue[0].id.videoId
        };
        return (
            <div className="player">
                <div className="video">
                    <YouTube
                        id="YouTube-Video"
                        videoId={nextVideoID}
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
                                    <div className="queue-item" id={item.id.videoId}>
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
                <Search addToQueue={this.addToQueue}/>
            </div>
        );
    }
};

export default Player;
