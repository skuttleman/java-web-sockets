import { SET_BROADCAST_MESSAGE, SUBMIT_BROADCAST_MESSAGE } from '../constants/actionTypes';

export default (state = '', { type, value }) => {
    switch (type) {
        case SET_BROADCAST_MESSAGE:
            return value;
        case SUBMIT_BROADCAST_MESSAGE:
            return '';
        default:
            return state;
    }
}
