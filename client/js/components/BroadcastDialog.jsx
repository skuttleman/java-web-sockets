import React, { Component } from 'react';
import socket from '../utils/socket';

export default class BroadcastDialog extends Component {
    onSubmit(event) {
        event.preventDefault();
        const { connection: to, value: message } = this.props;
        socket.send('broadcast', { to, message });
        this.props.dispatch({ type: 'SUBMIT_BROADCAST_MESSAGE' });
    }

    onChange({ target: { value }}) {
        this.props.dispatch({ type: 'SET_BROADCAST_MESSAGE', value });
    }

    render() {
        if (this.props.socketConnected) {
            return (
                <form className="broadcastDialog" onSubmit={event => this.onSubmit(event)}>
                    <label htmlFor="message">Message:</label>
                    <input id="message" value={this.props.value} onChange={event => this.onChange(event)}/>
                    <button type="submit">Send</button>
                </form>
            );
        }
        return <div></div>
    }
}
