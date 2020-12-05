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
                    autoplay: 1
                }
            }
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
        this.setState({
            queue: queueBuffer
        });
        event.target.playVideo();
    }

    _onReady = (event) => {
        event.target.playVideo();
    };

    render() {
        return (
            <div className="player">
                <div className="video">
                    <YouTube
                        videoId={
                            (!Array.isArray(this.state.queue) || !this.state.queue.length) ? "" : this.state.queue[0].id.videoId
                        }
                        opts={this.state.opts}
                        onReady={this._onReady}
                        onEnd={this.nextVideo}
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
