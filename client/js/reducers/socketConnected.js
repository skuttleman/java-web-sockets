import { SOCKET_CONNECTION_CLOSED, SOCKET_CONNECTION_ESTABLISHED } from '../constants/actionTypes';

export default (state = false, { type }) => {
    switch (type) {
        case SOCKET_CONNECTION_CLOSED:
            return false;
        case SOCKET_CONNECTION_ESTABLISHED:
            return true;
        default:
            return state;
    }
}
