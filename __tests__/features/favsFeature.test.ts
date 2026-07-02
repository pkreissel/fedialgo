import favFeature from '../../src/features/favsFeature';
import { createMockMastodonClient, mockStatus } from '../__mocks__/mastodonMock';

describe('favsFeature', () => {
    it('should tally favorited accounts correctly', async () => {
        const api = createMockMastodonClient({
            favourites: [
                [
                    mockStatus('1', 'alice@server.com'),
                    mockStatus('2', 'bob@server.com'),
                    mockStatus('3', 'alice@server.com'),
                ],
                [
                    mockStatus('4', 'charlie@server.com'),
                ] // page length < 10, should break here
            ]
        });

        const result = await favFeature(api);

        expect(result).toEqual({
            'alice@server.com': 2,
            'bob@server.com': 1
        });
    });

    it('should return empty object on error', async () => {
        const api = {
            v1: {
                favourites: {
                    list: () => {
                        throw new Error('Network error');
                    }
                }
            }
        } as any;
        
        // Suppress console.error for this test
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const result = await favFeature(api);
        expect(result).toEqual({});
        consoleSpy.mockRestore();
    });
});
