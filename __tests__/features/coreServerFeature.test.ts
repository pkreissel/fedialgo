import coreServerFeature from '../../src/features/coreServerFeature';
import { createMockMastodonClient, mockAccount } from '../__mocks__/mastodonMock';
import * as helpers from '../../src/helpers';

jest.mock('../../src/helpers', () => ({
    ...jest.requireActual('../../src/helpers'),
    mastodonFetch: jest.fn(),
}));

describe('coreServerFeature', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate overrepresented servers correctly', async () => {
        const api = createMockMastodonClient({
            following: [
                [
                    mockAccount('1', 'alice@server.com'),
                    mockAccount('2', 'bob@server.com'),
                    mockAccount('3', 'charlie@otherserver.com'),
                ],
                []
            ]
        });

        const user = mockAccount('99', 'me@myserver.com');

        const mockFetch = helpers.mastodonFetch as jest.Mock;
        mockFetch.mockImplementation(async (server: string) => {
            if (server === 'server.com/') return { usage: { users: { activeMonth: 100 } } };
            if (server === 'otherserver.com/') return { usage: { users: { activeMonth: 50 } } };
            return { usage: { users: { activeMonth: 10 } } };
        });

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const result = await coreServerFeature(api, user as any);
        consoleSpy.mockRestore();

        // server.com/ has 2 followers / 100 users = 0.02
        // otherserver.com/ has 1 follower / 50 users = 0.02
        expect(result).toEqual({
            'server.com/': 0.02,
            'otherserver.com/': 0.02,
        });
    });

    it('should filter out servers with < 10 active users', async () => {
        const api = createMockMastodonClient({
            following: [
                [
                    mockAccount('1', 'alice@tinyserver.com'),
                ],
                []
            ]
        });

        const user = mockAccount('99', 'me@myserver.com');

        const mockFetch = helpers.mastodonFetch as jest.Mock;
        mockFetch.mockImplementation(async () => {
            return { usage: { users: { activeMonth: 5 } } };
        });

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const result = await coreServerFeature(api, user as any);
        consoleSpy.mockRestore();

        expect(result).toEqual({});
    });

    it('should return empty object on api error', async () => {
        const api = {
            v1: {
                accounts: {
                    $select: () => ({
                        following: {
                            list: () => {
                                throw new Error('API Error');
                            }
                        }
                    })
                }
            }
        } as any;
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const result = await coreServerFeature(api, {} as any);
        consoleSpy.mockRestore();
        expect(result).toEqual({});
    });
});
