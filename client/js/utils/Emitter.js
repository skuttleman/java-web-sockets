export default class Emitter {
    constructor() {
        this.clearEventListeners();
    }

    emit(event, payload) {
        console.debug('emitter:', event, payload);
        let callbacks = this._listeners[event] || [];
        callbacks.forEach(callback => callback(payload));
    }

    addEventListener(event, listener) {
        this._listeners[event] = this._listeners[event] || [];
        this._listeners[event].push(listener);
    }

    clearEventListeners() {
        this._listeners = {};
    }
}
