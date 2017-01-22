import React, { Component } from 'react';
import { connect } from 'react-redux';
import socketInit from '../utils/socketInit';
import BroadcastDialog from './BroadcastDialog';
import Connections from './Connections';
import Messages from './Messages';

export class ManagerApp extends Component {
    componentDidMount() {
        const { dispatch } = this.props;
        socketInit({ id: 'manager', dispatch });
    }

    render() {
        const {
            socketList, socketMessages, dialogMessage,
            dispatch, selectedConnection, socketConnected
        } = this.props;
        return (
            <div>
                <h1>Socket Manager App</h1>
                <Connections
                    connections={socketList}
                    selectedConnection={selectedConnection}
                    dispatch={dispatch}
                />
                <BroadcastDialog
                    dispatch={dispatch}
                    value={dialogMessage}
                    connection={selectedConnection}
                    socketConnected={socketConnected}
                />
                <Messages messages={socketMessages} dispatch={dispatch}/>
            </div>
        );
    }
}

export default connect(store => store)(ManagerApp);

