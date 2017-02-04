import socket from '../../../js/utils/socket';
import Emitter from '../../../js/utils/Emitter';
import socketInit from '../../../js/utils/socketInit';
import {
    CLIENT_SOCKET_CONNECTED,
    CLIENT_SOCKET_DISCONNECTED,
    SOCKET_CONNECTION_CLOSED,
    SOCKET_CONNECTION_ESTABLISHED,
    SOCKET_RECEIVE_MESSAGE
} from '../../../js/constants/actionTypes';

describe('socketInit', () => {
    let emitter;

    const callFake = (event, callback) => {
        emitter.addListener(event, callback);
        return socket;
    };

    beforeEach(() => {
        emitter = new Emitter;
        spyOn(socket, 'connect').and.returnValue(socket);
        spyOn(socket, 'on').and.callFake(callFake);
    });

    it('connects to a socket', () => {
        socketInit({ id: 123 });

        expect(socket.connect).toHaveBeenCalledWith(123);

        socketInit({});

        expect(socket.connect).toHaveBeenCalledWith('');
        expect(socket.on).toHaveBeenCalledWith('open', jasmine.any(Function));
        expect(socket.on).toHaveBeenCalledWith('close', jasmine.any(Function));
        expect(socket.on).toHaveBeenCalledWith('message', jasmine.any(Function));
        expect(socket.on).toHaveBeenCalledWith('error', console.error);
    });

    describe('on event', () => {
        let dispatch;

        beforeEach(() => {
            spyOn(console, 'error');
            dispatch = jasmine.createSpy('dispatchSpy');

            socketInit({ dispatch, id: 123 });
        });

        it('dispatches an action on open', () => {
            emitter.emit('open');

            expect(dispatch).toHaveBeenCalledWith({ type: SOCKET_CONNECTION_ESTABLISHED });
        });

        it('dispatches an action on close', () => {
            emitter.emit('close');

            expect(dispatch).toHaveBeenCalledWith({ type: SOCKET_CONNECTION_CLOSED });
        });

        it('logs errors', () => {
            emitter.emit('error', 'some error');

            expect(console.error).toHaveBeenCalledWith('some error');
        });

        describe('message', () => {
            it('ignores messages from same id', () => {
                emitter.emit('message', { payload: { id: 123 } });
                emitter.emit('message', { payload: { from: 123 } });

                expect(dispatch).not.toHaveBeenCalled();
            });

            it('handles a new client connection', () => {
                const event = {
                    type: 'connected',
                    payload: { id: 999 }
                };
                emitter.emit('message', event);

                expect(dispatch).toHaveBeenCalledWith({
                    type: CLIENT_SOCKET_CONNECTED,
                    id: 999
                });
            });

            it('handles a client disconnection', () => {
                const event = {
                    type: 'disconnected',
                    payload: { id: 999 }
                };
                emitter.emit('message', event);

                expect(dispatch).toHaveBeenCalledWith({
                    type: CLIENT_SOCKET_DISCONNECTED,
                    id: 999
                });
            });

            it('handles incoming messages', () => {
                const event = {
                    type: 'who knows',
                    payload: {
                        the: 'wheels on the bus',
                        go: 'round and round'
                    }
                };
                emitter.emit('message', event);

                expect(dispatch).toHaveBeenCalledWith({
                    type: SOCKET_RECEIVE_MESSAGE,
                    the: 'wheels on the bus',
                    go: 'round and round'
                });
            });
        });
    });
});
