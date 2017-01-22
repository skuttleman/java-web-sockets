export default (state = false, {type}) => {
    switch (type) {
        case 'SOCKET_CONNECTION_ESTABLISHED':
            return true;
        case 'SOCKET_CONNECTION_CLOSED':
            return false;
        default:
            return state;
    }
}
