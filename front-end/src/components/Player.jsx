import React, { Component } from 'react';
import Search from './Search.jsx';
import YouTube from 'react-youtube';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            queue: []
        };
    };

    addToQueue = (result) => {
        const queueBuffer = [...this.state.queue];
        queueBuffer.push(result);
        this.setState({
            queue: queueBuffer
        });
    };

    render() {
        return (
            <div className="player">
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
