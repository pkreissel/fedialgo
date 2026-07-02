import TheAlgorithm from '../src/index';
import { mastodon } from 'masto';
import Storage from '../src/Storage';
import { FeatureScorer, FeedScorer } from '../src/scorer';
import { StatusType } from '../src/types';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('TheAlgorithm (Unit Tests)', () => {
    let api: mastodon.rest.Client;
    let user: mastodon.v1.Account;
    let algo: TheAlgorithm;

    beforeEach(() => {
        api = {} as mastodon.rest.Client;
        user = { id: '1', acct: 'me@server.com' } as mastodon.v1.Account;
        algo = new TheAlgorithm(api, user);
    });

    it('should initialize and set identity in Storage', async () => {
        expect(algo).toBeDefined();
        const identity = await Storage.getIdentity();
        expect(identity).toEqual(user);
    });

    it('should getFeedAdvanced with injected dependencies', async () => {
        // Mock a status
        const mockStatus: StatusType = {
            id: '1',
            uri: 'https://server.com/1',
            content: 'Hello World',
            createdAt: new Date().toISOString(),
            inReplyToId: null,
        } as StatusType;

        const fetcher = async () => [mockStatus];

        class MockFeatureScorer extends FeatureScorer {
            async getFeature() { this.feature = {}; }
            async score() { return 10; }
        }

        class MockFeedScorer extends FeedScorer {
            async setFeed() {}
            async score() { return 5; }
        }

        const featureScorer = new MockFeatureScorer({ featureGetter: async () => ({}), verboseName: 'mockFeature' });
        const feedScorer = new MockFeedScorer('mockFeed');

        const feed = await algo.getFeedAdvanced([fetcher], [featureScorer], [feedScorer]);
        
        expect(feed).toHaveLength(1);
        expect(feed[0].scores).toEqual({
            mockFeature: 10,
            mockFeed: 5,
        });
        expect(feed[0].value).toBeDefined();
    });

    it('should filter out replies and muted statuses', async () => {
        const mockStatuses: StatusType[] = [
            { id: '1', uri: '1', content: 'Normal', createdAt: new Date().toISOString(), inReplyToId: null } as StatusType,
            { id: '2', uri: '2', content: 'Reply', createdAt: new Date().toISOString(), inReplyToId: '1' } as StatusType,
            { id: '3', uri: '3', content: 'Muted', createdAt: new Date().toISOString(), inReplyToId: null, muted: true } as StatusType,
            { id: '4', uri: '4', content: 'RT @someone', createdAt: new Date().toISOString(), inReplyToId: null } as StatusType,
        ];

        const fetcher = async () => mockStatuses;
        const feed = await algo.getFeedAdvanced([fetcher], [], []);
        
        expect(feed).toHaveLength(1);
        expect(feed[0].id).toBe('1');
    });

    it('should correctly paginate', async () => {
        const mockStatuses = [
            { id: '1', uri: '1', content: 'A', createdAt: new Date().toISOString(), inReplyToId: null } as StatusType,
            { id: '2', uri: '2', content: 'B', createdAt: new Date().toISOString(), inReplyToId: null } as StatusType,
        ];
        
        await algo.getFeedAdvanced([async () => mockStatuses], [], []);
        const paginator = algo.list();
        
        const page1 = await paginator.next();
        expect(page1.done).toBe(false);
        expect(page1.value).toHaveLength(2); // Assuming paginator yields the feed somehow or first page
    });
});
