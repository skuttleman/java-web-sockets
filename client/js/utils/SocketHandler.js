export default class SocketHandler {
    constructor(emitter, retry = 250) {
        this._socket = null;
        this._emitter = emitter;
        this._retryConnect = retry;
    }

    connect(url = this._url) {
        this._url = url;
        this.close();
        this._socket = new WebSocket(url);
        this._socket.onopen = this._withoutReconnect.bind(this, 'open');
        this._socket.onclose = this._withReconnect.bind(this, 'close');
        this._socket.onerror = this._withReconnect.bind(this, 'error');
        this._socket.onmessage = this._onMessage.bind(this);
    }

    close() {
        if (this._socket) {
            this._socket.onclose = null;
            this._socket.onerror = null;
            try {
                this._socket.close();
                this._emitter.emit('close', { message: 'socket closed' });
            } catch (error) {
                this._emitter.emit('error', error);
            }
        }
        this._emitter.clearListeners();
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

    _withReconnect(event, data) {
        this._withoutReconnect(event, data);
        this._reconnect();
    }

    _withoutReconnect(event, data) {
        this._emitter.emit(event, data);
    }

    _onMessage({ data }) {
        try {
            this._emitter.emit('message', JSON.parse(data));
        } catch (error) {
            this._emitter.emit('message', data);
        }
    }
}
