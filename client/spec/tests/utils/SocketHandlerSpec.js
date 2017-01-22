import SocketHandler from '../../../js/utils/SocketHandler';
import Emitter from '../../../js/utils/Emitter';

describe('Socket Handler', () => {
    let connectSpy, emitter;

    beforeEach(() => {
        connectSpy = jasmine.createSpy('connectSpy');
        global.WebSocket = function(input) {
            connectSpy(input);
        };
        global.WebSocket.prototype.close = jasmine.createSpy('closeSpy');
        global.WebSocket.prototype.send = jasmine.createSpy('sendSpy');

        emitter = new Emitter;
        spyOn(emitter, 'emit');
        spyOn(emitter, 'clearListeners');
    });

    const instantiate = retry => {
        return new SocketHandler(emitter, retry);
    };

    describe('#connect', () => {
        it('connects the socket', () => {
            const socketHandler = instantiate();
            spyOn(socketHandler, 'close');

            socketHandler.connect('some url');
            expect(connectSpy).toHaveBeenCalledWith('some url');
            expect(socketHandler.close).toHaveBeenCalled();
        });

        it('emits events', () => {
            const socketHandler = instantiate();

            socketHandler.connect();
            const socket = socketHandler._socket;

            socket.onopen('open event');
            expect(emitter.emit).toHaveBeenCalledWith('open', 'open event');

            socket.onclose('close event');
            expect(emitter.emit).toHaveBeenCalledWith('close', 'close event');

            socket.onerror('error event');
            expect(emitter.emit).toHaveBeenCalledWith('error', 'error event');

            socket.onmessage({ data: 'message event' });
            expect(emitter.emit).toHaveBeenCalledWith('message', 'message event');

            socket.onmessage({ data: '{"message": "event"}' });
            expect(emitter.emit).toHaveBeenCalledWith('message', { message: 'event'});
        });

        it('reconnects on "error" and "close" events', () => {
            const socketHandler = instantiate();
            spyOn(socketHandler, '_reconnect');

            socketHandler.connect();

            socketHandler._socket.onerror();
            socketHandler._socket.onclose();

            expect(socketHandler._reconnect).toHaveBeenCalledTimes(2);
        });

        it('does not reconnect on "open" and "message" events', () => {
            const socketHandler = instantiate();
            spyOn(socketHandler, '_reconnect');

            socketHandler.connect();

            socketHandler._socket.onmessage({});
            socketHandler._socket.onopen();

            expect(socketHandler._reconnect).not.toHaveBeenCalled();
        });

        it('stores the previous url', () => {
            const socketHandler = instantiate();

            socketHandler.connect('some url');
            expect(connectSpy).toHaveBeenCalledWith('some url');

            socketHandler.connect();
            expect(connectSpy).not.toHaveBeenCalledWith(undefined);
        });
    });

    describe('#close', () => {
        it('clears listeners', () => {
            const socketHandler = instantiate();

            socketHandler.close();

            expect(emitter.emit).not.toHaveBeenCalled();
            expect(emitter.clearListeners).toHaveBeenCalled();
        });

        it('closes the socket', () => {
            const socketHandler = instantiate();

            socketHandler._socket = new WebSocket('some url');
            socketHandler.close();

            expect(socketHandler._socket.onclose).toEqual(null);
            expect(socketHandler._socket.onerror).toEqual(null);
            expect(socketHandler._socket.close).toHaveBeenCalled();
            expect(emitter.emit).toHaveBeenCalledWith('close', { message: 'socket closed' });
            expect(emitter.clearListeners).toHaveBeenCalled();
        });

        it('fails to close a connection', () => {
            const socketHandler = instantiate();

            socketHandler._socket = new WebSocket('some url');
            socketHandler._socket.close = jasmine.createSpy().and.throwError('Sad for You');

            socketHandler.close();

            expect(emitter.emit).toHaveBeenCalledWith('error', new Error('Sad for You'));
            expect(emitter.clearListeners).toHaveBeenCalled();
        });
    });

    describe('#send', () => {
        it('sends data', () => {
            const socketHandler = instantiate();
            socketHandler._socket = new WebSocket('some url');

            socketHandler.send('data');

            expect(socketHandler._socket.send).toHaveBeenCalledWith('"data"');
            expect(emitter.emit).toHaveBeenCalledWith('sending', 'data');
        });

        it('emits and error when it cannot send', () => {
            const socketHandler = instantiate();
            socketHandler._socket = new WebSocket('some url');
            socketHandler._socket.send.and.throwError('Socket blocket');

            socketHandler.send('data');

            expect(emitter.emit).toHaveBeenCalledWith('error', new Error('Socket blocket'));
        });
    });

    describe('#_reconnect', () => {
        it('sets a default timeout', () => {
            const socketHandler = instantiate();
            spyOn(global, 'setTimeout');

            socketHandler._reconnect();
            expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 250);
        });

        it('sets a custom timeout', () => {
            const socketHandler = instantiate(98765);
            spyOn(global, 'setTimeout');

            socketHandler._reconnect();
            expect(global.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 98765);
        });

        it('attempts to reconnect if readyState is > OPEN', done => {
            const socketHandler = instantiate(0);
            spyOn(socketHandler, 'connect');
            socketHandler._socket = {
                readyState: 2,
                OPEN: 1
            };

            socketHandler._reconnect();

            setTimeout(() => {
                expect(socketHandler.connect).toHaveBeenCalled();
                done();
            }, 1);
        });

        it('does not attempt to reconnect', done => {
            const socketHandler = instantiate(0);
            spyOn(socketHandler, 'connect');
            socketHandler._socket = null;

            socketHandler._reconnect();

            socketHandler._socket = {
                readyState: 1,
                OPEN: 1
            };

            socketHandler._reconnect();

            socketHandler._socket = {
                readyState: 0,
                OPEN: 1
            };

            socketHandler._reconnect();

            setTimeout(() => {
                expect(socketHandler.connect).not.toHaveBeenCalled();
                done();
            }, 1);
        });
    });
});