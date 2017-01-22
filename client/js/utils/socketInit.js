import socket from './socket';

const handleMessage = (id, dispatch, { type, payload }) => {
    if (id === payload.id || id === payload.from) {
        return;
    }
    switch (type) {
        case 'connected':
            dispatch({ type: 'CLIENT_SOCKET_CONNECTED', id: payload.id });
            return;
        case 'disconnected':
            dispatch({ type: 'CLIENT_SOCKET_DISCONNECTED', id: payload.id });
            return;
        default:
            dispatch({ type: 'SOCKET_RECEIVE_MESSAGE', ...payload });
    }
};

export default ({ id = '', dispatch }) => {
    return socket.connect(id)
        .on('open', () => dispatch({ type: 'SOCKET_CONNECTION_ESTABLISHED' }))
        .on('close', () => dispatch({ type: 'SOCKET_CONNECTION_CLOSED' }))
        .on('message', event => handleMessage(id, dispatch, event))
        .on('error', console.error);
};
