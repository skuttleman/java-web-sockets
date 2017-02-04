import socket from './socket';

const handleMessage = (id, dispatch, { type, payload }) => {
    if (id === payload.id || id === payload.from) {
        return;
    }
    dispatchAction(dispatch, type, payload);
};

const dispatchAction = (dispatch, type, payload) => {
    switch (type) {
        case 'connected':
            return dispatch({ type: 'CLIENT_SOCKET_CONNECTED', id: payload.id });
        case 'disconnected':
            return dispatch({ type: 'CLIENT_SOCKET_DISCONNECTED', id: payload.id });
        default:
            dispatch({ type: 'SOCKET_RECEIVE_MESSAGE', ...payload });
    }
};

export default ({ id = '', dispatch }) => {
    return socket.connect(id)
        .on('open', () => dispatch({ type: 'SOCKET_CONNECTION_ESTABLISHED' }))
        .on('close', () => dispatch({ type: 'SOCKET_CONNECTION_CLOSED' }))
        .on('message', event => handleMessage(id, dispatch, event))
        .on('message', console.debug)
        .on('error', console.error);
};
