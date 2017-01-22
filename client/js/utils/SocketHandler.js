export default class SocketHandler {
    constructor(emitter, retry = 250) {
        this._socket = null;
        this._emitter = emitter;
        this._retryConnect = retry;
    }

    close() {
        if (this._socket) {
            this._socket.onclose = null;
            this._socket.onerror = null;
            try {
                this._socket.close();
                this._emitter.emit('close', { message: 'socket close' });
            } catch (error) {
                this._emitter.emit('error', error);
            }
        }
        this._emitter.clearEventListeners();
    }

    connect(url) {
        this.close();
        this._socket = new WebSocket(url);
        this._socket.onopen = this._onOpen.bind(this);
        this._socket.onclose = this._onClose.bind(this);
        this._socket.onerror = this._onError.bind(this);
        this._socket.onmessage = this._onMessage.bind(this);
    }

    send(data) {
        try {
            this._socket.send(JSON.stringify(data));
            this._emitter.emit('sending', data);
        } catch (error) {
            this._emitter.emit('error', error);
        }
    }

    _reconnect() {
        setTimeout(() => {
            if (this._socket && this._socket.readyState > this._socket.OPEN) {
                this.connect();
            }
        }, this._retryConnect);
    }

    _onOpen(info) {
        this._emitter.emit('open', info);
    }

    _onClose(reason) {
        this._emitter.emit('close', reason);
        this._reconnect();
    }

    _onError(error) {
        this._emitter.emit('error', error);
        this._reconnect();
    }

    _onMessage({ data }) {
        try {
            this._emitter.emit('message', JSON.parse(data));
        } catch (error) {
            this._emitter.emit('message', data);
        }
    }
}
