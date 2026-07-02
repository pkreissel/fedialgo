import interactFeature from '../../src/features/interactsFeature';
import { createMockMastodonClient, mockNotification } from '../__mocks__/mastodonMock';

describe('interactsFeature', () => {
    it('should tally interacted accounts correctly', async () => {
        const api = createMockMastodonClient({
            notifications: [
                [
                    mockNotification('1', 'mention', 'alice@server.com'),
                    mockNotification('2', 'favourite', 'bob@server.com'),
                    mockNotification('3', 'reblog', 'alice@server.com'),
                ],
                [] // Empty page to break loop
            ]
        });

        const result = await interactFeature(api);

        expect(result).toEqual({
            'alice@server.com': 2,
            'bob@server.com': 1,
        });
    });

    it('should return empty object on error', async () => {
        const api = {
            v1: {
                notifications: {
                    list: () => {
                        throw new Error('Network error');
                    }
                }
            }
        } as any;
        
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const result = await interactFeature(api);
        expect(result).toEqual({});
        consoleSpy.mockRestore();
    });
});
