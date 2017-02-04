import socket from '../../../js/utils/socket';
import Emitter from '../../../js/utils/Emitter';
import SocketHandler from '../../../js/utils/SocketHandler';
import windowHelper from '../../../js/utils/windowHelper';

describe('socket', () => {
    beforeEach(() => {
        spyOn(SocketHandler.prototype, 'connect');
        spyOn(SocketHandler.prototype, 'send');
        spyOn(SocketHandler.prototype, 'close');
        spyOn(Emitter.prototype, 'addListener');
        spyOn(Emitter.prototype, 'clearListeners');
        spyOn(windowHelper, 'getSocketProtocol').and.returnValue('ws:');
        spyOn(windowHelper, 'getSocketUrl').and.returnValue('somehost.com/socket');
    });

    describe('#connect', () => {
        it('connects and chains', () => {
            const result = socket.connect(123);

            expect(SocketHandler.prototype.connect).toHaveBeenCalledWith('ws://somehost.com/socket?id=123');
            expect(result).toEqual(socket);
        });

        it('connects with same id', () => {
            socket.connect(123);
            socket.connect();

            expect(SocketHandler.prototype.connect).toHaveBeenCalledTimes(2);
            expect(SocketHandler.prototype.connect).toHaveBeenCalledWith('ws://somehost.com/socket?id=123');
            expect(SocketHandler.prototype.connect).not.toHaveBeenCalledWith('ws://somehost.com/socket?id=undefined');
        });

        it('connects with ssl', () => {
            windowHelper.getSocketProtocol.and.returnValue('wss:');
            windowHelper.getSocketUrl.and.returnValue('www.securesite.com/some/path');
            socket.connect('secret');

            expect(SocketHandler.prototype.connect).toHaveBeenCalledWith('wss://www.securesite.com/some/path?id=secret');
        })
    });

    describe('#on', () => {
        it('adds listener and chains', () => {
            const result = socket.on('some event', 'some listener');

            expect(Emitter.prototype.addListener).toHaveBeenCalledWith('some event', 'some listener');
            expect(result).toEqual(socket);
        });
    });

    describe('#send', () => {
        it('sends the messsage and chains', () => {
            const result = socket.send({ the: 'type' }, { the: 'payload' });

            expect(SocketHandler.prototype.send).toHaveBeenCalledWith({
                type: { the: 'type' },
                payload: { the: 'payload' }
            });
            expect(result).toEqual(socket);
        });
    });

    describe('#clearListeners', () => {
        it('clears all listeners and chains', () => {
            const result = socket.clearListeners();

            expect(Emitter.prototype.clearListeners).toHaveBeenCalled();
            expect(result).toEqual(socket);
        });
    });

    describe('#close', () => {
        it('closes the socket and chains', () => {
            const result = socket.close();

            expect(SocketHandler.prototype.close).toHaveBeenCalled();
            expect(result).toEqual(socket);
        });
    });
});
