import socketUtils from '../../../js/utils/socketUtils';

describe('socketUtils', () => {
    describe('connectSocket', () => {
        beforeEach(() => {
            global.WebSocket = jasmine.createSpy('WebSocket').and.returnValue({});
        });

        it('connects a socket', () => {
            socketUtils.connectSocket('some url', {});
            expect(global.WebSocket).toHaveBeenCalledWith('some url');
        });

        it('sets event handlers', () => {
            const socket = socketUtils.connectSocket('some url', {
                onMessage: 'onMessage',
                onError: 'onError',
                onClose: 'onClose',
                onOpen: 'onOpen'
            });

            expect(socket.onmessage).toEqual('onMessage');
            expect(socket.onerror).toEqual('onError');
            expect(socket.onclose).toEqual('onClose');
            expect(socket.onopen).toEqual('onOpen');
        });
    });
});