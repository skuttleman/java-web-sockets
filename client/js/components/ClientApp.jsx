import React, { Component } from 'react';
import { connect } from 'react-redux';
import BroadcastDialog from './BroadcastDialog';
import ConnectDialog from './ConnectDialog';
import ConnectionIndicator from './ConnectionIndicator';
import Messages from './Messages';

export class ClientApp extends Component {
    render() {
        const {
            channelId, dialogMessage, dispatch, socketConnected, socketMessages
        } = this.props;
        return (
            <div>
                <h1 className="pageTitle">Socket Client App</h1>
                <ConnectionIndicator
                    connected={socketConnected}
                    channelId={channelId}
                    />
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
}

export default connect(store => store)(ClientApp);

