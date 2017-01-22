import React, { Component } from 'react';
import socketInit from '../utils/socketInit';
import socket from '../utils/socket';

export default class ConnectDialog extends Component {
    onConnect(event) {
        event.preventDefault();
        const { dispatch, channelId: id } = this.props;
        socketInit({ id, dispatch });
    }

    onChange(event) {
        this.props.dispatch({ type: 'SET_CHANNEL_ID', value: event.target.value })
    }

    onDisconnect(event) {
        event.preventDefault();
        this.props.dispatch({ type: 'SOCKET_CLEAR_MESSAGES' });
        socket.close();
    }

    renderConnectForm() {
        return (
            <form className="connectDialog" onSubmit={event => this.onConnect(event)}>
                <label htmlFor="message">ChannelId:</label>
                <input id="message" value={this.props.channelId} onChange={event => this.onChange(event)}/>
                <button type="submit">Connect</button>
            </form>
        );
    }

    renderDisconnectForm() {
        return (
            <form className="connectDialog" onSubmit={event => this.onDisconnect(event)}>
                <button type="submit">Disconnect</button>
            </form>
        );
    }

    render() {
        if (!this.props.socketConnected) {
            return this.renderConnectForm();
        }
        return this.renderDisconnectForm();
    }
}
