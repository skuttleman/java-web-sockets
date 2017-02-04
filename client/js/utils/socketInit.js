import socket from './socket';
import {
    CLIENT_SOCKET_CONNECTED,
    CLIENT_SOCKET_DISCONNECTED,
    SOCKET_CONNECTION_CLOSED,
    SOCKET_CONNECTION_ESTABLISHED,
    SOCKET_RECEIVE_MESSAGE
} from '../constants/actionTypes';

const handleMessage = (id, dispatch, { type, payload }) => {
    if (id === payload.id || id === payload.from) {
        return;
    }
    dispatchAction(dispatch, type, payload);
};

const dispatchAction = (dispatch, type, payload) => {
    switch (type) {
        case 'connected':
            return dispatch({ type: CLIENT_SOCKET_CONNECTED, id: payload.id });
        case 'disconnected':
            return dispatch({ type: CLIENT_SOCKET_DISCONNECTED, id: payload.id });
        default:
            dispatch({ type: SOCKET_RECEIVE_MESSAGE, ...payload });
    }

};

export default ({ id = '', dispatch }) => {
    return socket.connect(id)
        .on('close', () => dispatch({ type: SOCKET_CONNECTION_CLOSED }))
        .on('open', () => dispatch({ type: SOCKET_CONNECTION_ESTABLISHED }))
        .on('message', event => handleMessage(id, dispatch, event))
        .on('error', console.error);
};
