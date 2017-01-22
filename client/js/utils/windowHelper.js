const getProtocol = () => {
    return window.location.protocol;
};

const getSocketUrl = () => {
    return 'localhost:8080/socket';
};

export default {
    getProtocol,
    getSocketUrl
};
