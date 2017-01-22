export default (state = '', { type, value }) => {
    switch (type) {
        case 'SET_CHANNEL_ID':
            return value;
        default:
            return state;
    }
}
