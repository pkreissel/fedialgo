import getReblogsFeature from '../../src/features/reblogsFeature';
import { createMockMastodonClient, mockStatus, mockAccount } from '../__mocks__/mastodonMock';

describe('reblogsFeature', () => {
    it('should tally reblogged accounts correctly', async () => {
        const api = createMockMastodonClient({
            reblogs: [
                [
                    mockStatus('1', 'me@server.com', 'alice@server.com'), // Reblogged alice
                    mockStatus('2', 'me@server.com'), // Not a reblog
                    mockStatus('3', 'me@server.com', 'bob@server.com'), // Reblogged bob
                    mockStatus('4', 'me@server.com', 'alice@server.com'), // Reblogged alice again
                ],
                [] // Empty page to break loop
            ]
        });

        const user = mockAccount('1', 'me@server.com');
        
        // Suppress console.log for this test
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const result = await getReblogsFeature(api, user as any);
        consoleSpy.mockRestore();

        expect(result).toEqual({
            'alice@server.com': 2,
            'bob@server.com': 1,
        });
    });

    it('should return empty object on error', async () => {
        const api = {
            v1: {
                accounts: {
                    $select: () => ({
                        statuses: {
                            list: () => {
                                throw new Error('Network error');
                            }
                        }
                    })
                }
            }
        } as any;
        
        const user = mockAccount('1', 'me@server.com');
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const result = await getReblogsFeature(api, user as any);
        expect(result).toEqual({});
        consoleSpy.mockRestore();
    });
});
