const connectSocket = (url, { onMessage, onOpen, onClose, onError }) => {
    const socket = new WebSocket(url);
    socket.onmessage = onMessage;
    socket.onopen = onOpen;
    socket.onclose = onClose;
    socket.onerror = onError;
    return socket;
};

export default {
    connectSocket
};