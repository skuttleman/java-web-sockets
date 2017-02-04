import React, { Component } from 'react';
import socket from '../utils/socket';
import { SET_BROADCAST_MESSAGE, SUBMIT_BROADCAST_MESSAGE } from '../constants/actionTypes';

export default class BroadcastDialog extends Component {
    render() {
        const { socketConnected, value } = this.props;
        if (socketConnected) {
            return (
                <form className="dialog dialog-broadcast" onSubmit={event => this.submit(event)}>
                    <label htmlFor="message">Broadcast a Message:</label>
                    <input
                        id="message"
                        type="text"
                        value={value}
                        autoComplete="off"
                        onChange={event => this.change(event)}
                        />
                    <button type="submit" disabled={!value}>Send</button>
                </form>
            );
        }
        return <div />
    }

    submit(event) {
        const { connection, value, dispatch } = this.props;
        event.preventDefault();
        socket.send('broadcast', { to: connection, message: value });
        dispatch({ type: SUBMIT_BROADCAST_MESSAGE });
    }

    change({ target: { value }}) {
        this.props.dispatch({ type: SET_BROADCAST_MESSAGE, value });
    }
}
