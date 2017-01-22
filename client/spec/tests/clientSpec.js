import windowHelper from '../../js/utils/windowHelper';

describe('app', () => {
    beforeEach(() => {
        windowHelper.WebSocket = function() {};
        spyOn(windowHelper, 'getProtocol');
    });

    it('has a test', () => {
        expect(true).toEqual(true);
    });
});
