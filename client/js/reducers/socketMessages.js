export default (state = [], {type, message}) => {
    switch (type) {
        case 'SOCKET_RECEIVE_MESSAGE':
            return state.concat({message});
        case 'SOCKET_CLEAR_MESSAGES':
            return [];
        default:
            return state;
    }
};
