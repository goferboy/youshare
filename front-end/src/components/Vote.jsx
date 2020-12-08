import React, { Component } from 'react';

class Vote extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasVoted: '',
            numOfUsers: this.props.currentUsers.length,
            negativeVotes: 0,
        }
        
    }

    componentDidMount() {
        this.props.socket.on('voting', (res) => {
            console.log(res);
            let negativeVotesBuffer = this.state.negativeVotes + res.negativeVotes;
            this.setState({
                negativeVotes: negativeVotesBuffer,
            });
            if (negativeVotesBuffer >= this.state.numOfUsers / 2) {
                this.props.nextVideo();
                this.setState({
                    hasVoted: '',
                    negativeVotes: 0,
                    numOfUsers: this.props.currentUsers.length
                });
            }
        });
    }

    voteButton = (event) => {
        console.log(event.target.id);
        if (this.state.hasVoted !== event.target.id) {
            if (event.target.id === 'thumbs-up')
                this.props.socket.emit('voting', {room: this.props.room, negativeVotes: 0});
            else
                this.props.socket.emit('voting', {room: this.props.room, negativeVotes: 1})
            this.setState({
                hasVoted: event.target.id
            });
        }
        // this.props.voteCheck(this.state.negativeVotes, this.state.totalVotes);
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
