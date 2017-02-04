import socketUtils from './socketUtils'
import { RETRY_TIMEOUT } from '../constants/config';

export default class SocketHandler {
    constructor(emitter, retry = RETRY_TIMEOUT) {
        this._socket = null;
        this._emitter = emitter;
        this._retryConnect = retry;
    }

    connect(url = this._url) {
        this._url = url;
        this.close();
        this._socket = socketUtils.connectSocket(url, {
            onMessage: event => this._onMessage(event),
            onOpen: event => this._emit('open', event),
            onClose: event => this._emitAndReconnect('close', event),
            onError: event => this._emitAndReconnect('error', event)
        });
    }

    close() {
        if (this._socket) {
            this._socket.onclose = null;
            this._socket.onerror = null;
            try {
                this._socket.close();
            } catch (error) {
                this._emitter.emit('error', error);
            }
        }
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

    _emitAndReconnect(event, data) {
        this._emit(event, data);
        this._reconnect();
    }

    _emit(event, data) {
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
