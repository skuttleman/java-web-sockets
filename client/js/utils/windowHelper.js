const getProtocol = () => {
    return window && window.location && window.location.protocol;
};

export default {
    getProtocol,
    WebSocket: window.WebSocket
};
