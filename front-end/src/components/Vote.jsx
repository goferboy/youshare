import React, { Component } from 'react';

class Vote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasVoted: '',
            negativeVotes: 0
        }    
    }

    componentDidMount() {
        this.props.socket.on('voting', (res) => {
            console.log(res);
            if (res)
                this.props.nextVideo();
        });
    }

    voteButton = (event) => {
        console.log(event.target.id);
        console.log(this.props.currentUsers.length);
        if (this.state.hasVoted !== event.target.id) {
            if (this.state.hasVoted === 'thumbs-down')
                this.props.socket.emit('voting', {room: this.props.room, negativeVotes: -1});
            if (event.target.id === 'thumbs-down')
                this.props.socket.emit('voting', {room: this.props.room, negativeVotes: 1})
            this.setState({
                hasVoted: event.target.id
            });
        }
    }

    render() {
        return (
            <div className="vote-bar">
                <button type="button" id="thumbs-up" onClick={this.voteButton}>👍</button>
                <button type="button" id="thumbs-down" onClick={this.voteButton}>👎</button>
            </div>
        )
    }
}

export default Vote;
