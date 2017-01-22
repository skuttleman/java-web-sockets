const set = (list, newItem) => {
    if (list.indexOf(newItem) === -1) {
        return list.concat(newItem);
    }
    return list;
};

export default (state = [], { type, id }) => {
    switch (type) {
        case 'CLIENT_SOCKET_CONNECTED':
            return set(state, id);
        case 'CLIENT_SOCKET_DISCONNECTED':
            return state.filter(item => item !== id);
        case 'SOCKET_CONNECTION_CLOSED':
            return [];
        default:
            return state;
    }
};
