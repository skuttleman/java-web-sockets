import React, { Component } from 'react';
import { connect } from 'react-redux';
import BroadcastDialog from './BroadcastDialog';
import ConnectDialog from './ConnectDialog';
import Messages from './Messages';

export class ClientApp extends Component {
    render() {
        const {
            channelId, dialogMessage, dispatch, socketConnected, socketMessages
        } = this.props;
        return (
            <div>
                <h1>Socket Client App</h1>
                {this.renderChannelId()}
                <ConnectDialog
                    dispatch={dispatch}
                    socketConnected={socketConnected}
                    channelId={channelId}
                />
                <BroadcastDialog
                    dispatch={dispatch}
                    value={dialogMessage}
                    connection={null}
                    socketConnected={socketConnected}
                />
                <Messages messages={socketMessages} dispatch={dispatch} />
            </div>
        );
    }

    renderChannelId() {
        if (this.props.socketConnected) {
            return [
                <h2 key={0}>Id: {this.props.channelId}</h2>,
                <p key={1}>Connected</p>
            ];
        }
        return <p>Not Connected</p>;
    }
}

export default connect(store => store)(ClientApp);

