import { SOCKET_URL } from '../constants/config';

const getSocketProtocol = () => {
    return window.location.protocol === 'https:' ? 'wss:' : 'ws:';
};

const getSocketUrl = () => {
    return SOCKET_URL;
};

export default {
    getSocketProtocol,
    getSocketUrl
};
