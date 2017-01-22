import windowHelper from './windowHelper';

const CONNECTION_URL = 'localhost:8080/socket';
const PROTOCOL = windowHelper.getProtocol() === 'https:' ? 'wss:' : 'ws:';
const WebSocket = windowHelper.WebSocket;
const STORE = {
    socket: null,
    id: '',
    listeners: {}
};

const dispatchEvent = (event, payload) => {
    let callbacks = STORE.listeners[event] || [];
    callbacks.forEach(callback => callback(payload));
};

const onOpen = info => {
    dispatchEvent('open', info);
};

const onClose = reason => {
    dispatchEvent('close', reason);
    reconnect();
};

const onError = error => {
    dispatchEvent('error', error);
    reconnect();
};

const onMessage = message => {
    try {
        dispatchEvent('message', JSON.parse(message.data));
    } catch (error) {
        dispatchEvent('error', error);
    }
};

const connect = (lastId = STORE.id) => {
    close();
    STORE.id = lastId;
    STORE.socket = new WebSocket(`${PROTOCOL}//${CONNECTION_URL}?id=${STORE.id}`);
    STORE.socket.onopen = onOpen;
    STORE.socket.onclose = onClose;
    STORE.socket.onerror = onError;
    STORE.socket.onmessage = onMessage;
    return library;
};

const reconnect = () => {
    setTimeout(() => {
        if (STORE.socket.readyState > STORE.socket.OPEN) {
            connect();
        }
    }, 250);
};

const close = () => {
    try {
        STORE.socket.onerror = null;
        STORE.socket.onclose = null;
        STORE.socket.close();
        dispatchEvent('close', { message: 'socket closed' });
    } catch (error) {
        dispatchEvent('error', error);
    }
};

const on = (event, callback) => {
    STORE.listeners[event] = STORE.listeners[event] || [];
    STORE.listeners[event].push(callback);
    return library;
};

const send = (event, payload) => {
    STORE.socket.send(JSON.stringify({event, payload}));
    return library;
};

const library = {
    on,
    send,
    connect,
    close
};

export default library;
