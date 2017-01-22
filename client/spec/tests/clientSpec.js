import windowHelper from '../../js/utils/windowHelper';

describe('app', () => {
    beforeEach(() => {
        spyOn(windowHelper, 'getProtocol').and.returnValue('http:')
    });

    it('has a test', () => {
        expect(true).toEqual(true);
    });
});
