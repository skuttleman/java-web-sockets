import { combineReducers } from 'redux';

import channelId from './channelId';
import dialogMessage from './dialogMessage';
import selectedConnection from './selectedConnection';
import socketConnected from './socketConnected';
import socketList from './socketList';
import socketMessages from './socketMessages';

export default combineReducers({
    channelId,
    dialogMessage,
    selectedConnection,
    socketConnected,
    socketList,
    socketMessages
});
