import React, { Component } from 'react';
import socket from '../utils/socket';

export default class BroadcastDialog extends Component {
    onSubmit(event) {
        event.preventDefault();
        const { connection: to, value: message, dispatch } = this.props;
        socket.send('broadcast', { to, message });
        dispatch({ type: 'SUBMIT_BROADCAST_MESSAGE' });
    }

    onChange({ target: { value }}) {
        this.props.dispatch({ type: 'SET_BROADCAST_MESSAGE', value });
    }

    render() {
        const { socketConnected, value } = this.props;
        if (socketConnected) {
            return (
                <form className="broadcastDialog" onSubmit={event => this.onSubmit(event)}>
                    <label htmlFor="message">Message:</label>
                    <input id="message" value={value} onChange={event => this.onChange(event)}/>
                    <button type="submit" disabled={!value}>Send</button>
                </form>
            );
        }
        return <div></div>
    }
}
