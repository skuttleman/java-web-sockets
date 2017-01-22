import Emitter from '../../../js/utils/Emitter';

describe('Emitter', () => {
    let emitter;
    console.debug = console.debug || (() => null);

    beforeEach(() => {
        emitter = new Emitter;
    });

    it('can have multiple listeners', () => {
        const listenerSpy1 = jasmine.createSpy('listenerSpy1');
        const listenerSpy2 = jasmine.createSpy('listenerSpy2');
        const listenerSpy3 = jasmine.createSpy('listenerSpy3');
        emitter.addListener('some event', listenerSpy1);
        emitter.addListener('some event', listenerSpy2);
        emitter.addListener('some event', listenerSpy3);

        emitter.emit('some event', 'payload');

        expect(listenerSpy1).toHaveBeenCalledWith('payload');
        expect(listenerSpy2).toHaveBeenCalledWith('payload');
        expect(listenerSpy3).toHaveBeenCalledWith('payload');
    });

    it('can emit an event with no listeners', () => {
        const listenerSpy1 = jasmine.createSpy('listenerSpy1');
        const listenerSpy2 = jasmine.createSpy('listenerSpy2');
        emitter.addListener('some event', listenerSpy1);
        emitter.addListener('some other event', listenerSpy2);

        emitter.emit('some other event', 'payload');

        expect(listenerSpy1).not.toHaveBeenCalled();
        expect(listenerSpy2).toHaveBeenCalledWith('payload');
    });

    it('can clear all listeners', () => {
        const listenerSpy = jasmine.createSpy('listenerSpy');
        emitter.addListener('some event', listenerSpy);
        emitter.clearListeners();

        emitter.emit('some event', 'payload');

        expect(listenerSpy).not.toHaveBeenCalled();
    });
});
