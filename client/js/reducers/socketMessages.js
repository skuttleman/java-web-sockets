import { SOCKET_CLEAR_MESSAGES, SOCKET_RECEIVE_MESSAGE } from '../constants/actionTypes';

export default (state = [], { type, message }) => {
    switch (type) {
        case SOCKET_CLEAR_MESSAGES:
            return [];
        case SOCKET_RECEIVE_MESSAGE:
            return state.concat({ message });
        default:
            return state;
    }
};
