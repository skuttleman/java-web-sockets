import React, { Component } from 'react';
import socketInit from '../utils/socketInit';
import socket from '../utils/socket';
import { SET_CHANNEL_ID, SOCKET_CLEAR_MESSAGES } from '../constants/actionTypes';

export default class ConnectDialog extends Component {
    render() {
        if (!this.props.socketConnected) {
            return this.renderConnectedForm();
        }
        return this.renderDisconnectForm();
    }

    renderConnectedForm() {
        return (
            <form className="dialog dialog-connect" onSubmit={event => this.connect(event)}>
                <label htmlFor="channelId">ChannelId:</label>
                <input
                    id="channelId"
                    type="text"
                    value={this.props.channelId}
                    autoComplete="off"
                    onChange={event => this.change(event)}
                    />
                <button type="submit" disabled={!this.props.channelId}>Connect</button>
            </form>
        );
    }

    renderDisconnectForm() {
        return (
            <form className="dialog dialog-disconnect" onSubmit={event => this.disconnect(event)}>
                <button type="submit">Disconnect</button>
            </form>
        );
    }

    connect(event) {
        event.preventDefault();
        const { dispatch, channelId } = this.props;
        socketInit({ id: channelId, dispatch });
    }

    change(event) {
        this.props.dispatch({ type: SET_CHANNEL_ID, value: event.target.value })
    }

    disconnect(event) {
        event.preventDefault();
        this.props.dispatch({ type: SOCKET_CLEAR_MESSAGES });
        socket.close().clearListeners();
    }
}
