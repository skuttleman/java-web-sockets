export default class Emitter {
    constructor() {
        this.clearListeners();
    }

    emit(event, payload) {
        let callbacks = this._listeners[event] || [];
        callbacks.forEach(callback => callback(payload));
    }

    addListener(event, listener) {
        this._listeners[event] = this._listeners[event] || [];
        this._listeners[event].push(listener);
    }

    clearListeners() {
        this._listeners = {};
    }
}
