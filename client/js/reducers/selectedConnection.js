export default (state = null, {type, connection}) => {
    switch (type) {
        case 'SET_SELECTED_CONNECTION':
            return connection;
        default:
            return state;
    }
}
