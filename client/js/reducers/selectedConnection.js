import {
    CLIENT_SOCKET_DISCONNECTED,
    SET_SELECTED_CONNECTION
} from '../constants/actionTypes';

export default (state = null, { type, connection, id }) => {
    switch (type) {
        case SET_SELECTED_CONNECTION:
            return connection;
        case CLIENT_SOCKET_DISCONNECTED:
            if (state === id) {
                return null;
            }
        default:
            return state;
    }
}
